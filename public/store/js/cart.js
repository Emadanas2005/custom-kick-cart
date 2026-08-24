/* ============================================================
   cart.js
   - localStorage-backed cart module (shared by every page)
   - Navbar badge, mobile nav, toast helper
   - Cart page rendering (cart.html)
   ============================================================ */

const CART_KEY = "solevault_cart";
const SHIPPING_FLAT = 149;      // flat shipping fee
const FREE_SHIPPING_OVER = 9999; // free shipping threshold

const Cart = {
  /** Read the cart array from localStorage (never throws). */
  read() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.warn("Cart could not be read, starting empty.", error);
      return [];
    }
  },

  /** Persist the cart and refresh dependent UI. */
  write(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    updateCartBadge();
    document.dispatchEvent(new CustomEvent("cart:change"));
  },

  /** Add a product/size pair, merging quantities for duplicates. */
  add(product, size, quantity = 1) {
    const items = Cart.read();
    const existing = items.find((i) => i.id === product.id && i.size === size);
    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        image: product.image,
        size,
        quantity,
      });
    }
    Cart.write(items);
  },

  /** Increase/decrease quantity; removes the line when it hits zero. */
  changeQuantity(id, size, delta) {
    const items = Cart.read();
    const item = items.find((i) => i.id === id && i.size === size);
    if (!item) return;
    item.quantity += delta;
    Cart.write(item.quantity <= 0 ? items.filter((i) => i !== item) : items);
  },

  remove(id, size) {
    Cart.write(Cart.read().filter((i) => !(i.id === id && i.size === size)));
  },

  clear() {
    localStorage.removeItem(CART_KEY);
    updateCartBadge();
    document.dispatchEvent(new CustomEvent("cart:change"));
  },

  /** Total number of units in the cart. */
  count() {
    return Cart.read().reduce((sum, i) => sum + i.quantity, 0);
  },

  /** Subtotal, shipping and grand total for the current cart. */
  totals() {
    const items = Cart.read();
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FLAT;
    return { subtotal, shipping, total: subtotal + shipping, units: Cart.count() };
  },
};

/* ---------------- shared UI helpers ---------------- */

/** Sync every cart badge in the navbar. */
function updateCartBadge() {
  const count = Cart.count();
  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    el.textContent = count;
  });
}

/** Small bottom toast used for add-to-cart feedback. */
let toastTimer;
function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

/** Responsive navigation toggle. */
function initNavToggle() {
  const toggle = document.querySelector(".nav__toggle");
  const links = document.querySelector(".nav__links");
  if (!toggle || !links) return;
  toggle.addEventListener("click", () => links.classList.toggle("open"));
}

/* ---------------- cart.html rendering ---------------- */
function initCartPage() {
  const list = document.getElementById("cartItems");
  if (!list) return;

  const summary = document.getElementById("cartSummary");
  const checkoutBtn = document.getElementById("checkoutBtn");

  function render() {
    const items = Cart.read();
    const { subtotal, shipping, total, units } = Cart.totals();

    if (!items.length) {
      list.innerHTML = `
        <div class="empty">
          <h3>Your cart is empty</h3>
          <p>Looks like you haven't picked a pair yet.</p>
          <p style="margin-top:16px"><a class="btn btn--primary" href="products.html">Shop sneakers</a></p>
        </div>`;
    } else {
      list.innerHTML = items
        .map(
          (i) => `
        <article class="line-item">
          <img src="${i.image}" alt="${i.name}" />
          <div>
            <h3>${i.name}</h3>
            <p class="meta">${i.brand} · Size UK ${i.size} · ${money(i.price)} each</p>
            <div class="qty">
              <button type="button" data-dec data-id="${i.id}" data-size="${i.size}" aria-label="Decrease quantity">−</button>
              <span>${i.quantity}</span>
              <button type="button" data-inc data-id="${i.id}" data-size="${i.size}" aria-label="Increase quantity">+</button>
            </div>
          </div>
          <div class="line-item__end">
            <strong>${money(i.price * i.quantity)}</strong>
            <button type="button" class="remove" data-remove data-id="${i.id}" data-size="${i.size}">Remove</button>
          </div>
        </article>`
        )
        .join("");
    }

    if (summary) {
      summary.innerHTML = `
        <h3>Order Summary</h3>
        <div class="row"><span>Items</span><span>${units}</span></div>
        <div class="row"><span>Subtotal</span><span>${money(subtotal)}</span></div>
        <div class="row"><span>Shipping</span><span>${shipping === 0 ? "FREE" : money(shipping)}</span></div>
        <div class="row row--total"><span>Total</span><span>${money(total)}</span></div>
        <p class="note">${
          subtotal === 0
            ? "Add items to see shipping."
            : shipping === 0
            ? "Free shipping unlocked 🎉"
            : `Spend ${money(FREE_SHIPPING_OVER - subtotal)} more for free shipping.`
        }</p>`;
    }

    if (checkoutBtn) {
      checkoutBtn.disabled = items.length === 0;
      checkoutBtn.textContent = items.length ? "Proceed to Payment" : "Cart is empty";
    }
  }

  // Quantity / remove actions (event delegation).
  list.addEventListener("click", (event) => {
    const btn = event.target.closest("button[data-id]");
    if (!btn) return;
    const id = Number(btn.dataset.id);
    const size = Number(btn.dataset.size);
    if (btn.hasAttribute("data-inc")) Cart.changeQuantity(id, size, 1);
    else if (btn.hasAttribute("data-dec")) Cart.changeQuantity(id, size, -1);
    else if (btn.hasAttribute("data-remove")) Cart.remove(id, size);
  });

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (Cart.count() > 0) window.location.href = "payment.html";
    });
  }

  document.addEventListener("cart:change", render);
  render();
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  initNavToggle();
  initCartPage();
});
