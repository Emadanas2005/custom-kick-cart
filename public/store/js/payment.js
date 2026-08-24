/* ============================================================
   payment.js
   - Order summary rendering on payment.html
   - Full client-side checkout validation
   - Success confirmation + cart clearing
   ============================================================ */

/* ---------------- validation rules ---------------- */
const RULES = {
  fullName: {
    test: (v) => /^[A-Za-z][A-Za-z .'-]{2,49}$/.test(v.trim()),
    message: "Enter your full name (letters only, min 3 characters).",
  },
  email: {
    test: (v) => /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(v.trim()),
    message: "Enter a valid email address, e.g. you@example.com.",
  },
  phone: {
    test: (v) => /^[6-9]\d{9}$/.test(v.replace(/\D/g, "")),
    message: "Enter a valid 10-digit mobile number.",
  },
  address: {
    test: (v) => v.trim().length >= 8,
    message: "Enter your house / street address (min 8 characters).",
  },
  city: {
    test: (v) => /^[A-Za-z][A-Za-z .'-]{1,39}$/.test(v.trim()),
    message: "Enter a valid city name.",
  },
  state: {
    test: (v) => /^[A-Za-z][A-Za-z .'-]{1,39}$/.test(v.trim()),
    message: "Enter a valid state name.",
  },
  zip: {
    test: (v) => /^\d{6}$/.test(v.trim()),
    message: "Enter a valid 6-digit PIN code.",
  },
  cardName: {
    test: (v) => /^[A-Za-z][A-Za-z .'-]{2,49}$/.test(v.trim()),
    message: "Enter the name printed on your card.",
  },
  cardNumber: {
    test: (v) => {
      const digits = v.replace(/\s|-/g, "");
      return /^\d{16}$/.test(digits) && luhnValid(digits);
    },
    message: "Enter a valid 16-digit card number.",
  },
  expiry: {
    test: (v) => {
      const match = v.trim().match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
      if (!match) return false;
      const month = Number(match[1]);
      const year = 2000 + Number(match[2]);
      const now = new Date();
      const endOfMonth = new Date(year, month, 0, 23, 59, 59);
      return endOfMonth >= now;
    },
    message: "Use MM/YY and a date that has not expired.",
  },
  cvv: {
    test: (v) => /^\d{3,4}$/.test(v.trim()),
    message: "CVV must be 3 or 4 digits.",
  },
};

/** Luhn checksum – catches mistyped card numbers. */
function luhnValid(digits) {
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = Number(digits[i]);
    if (double) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    double = !double;
  }
  return sum % 10 === 0;
}

/** Show or clear the error message for one field. */
function setFieldError(input, message) {
  const holder = document.querySelector(`[data-error-for="${input.id}"]`);
  if (holder) holder.textContent = message || "";
  input.classList.toggle("invalid", Boolean(message));
}

/** Validate a single input against its rule. Returns true when valid. */
function validateField(input) {
  const rule = RULES[input.name];
  if (!rule) return true;
  if (!input.value.trim()) {
    setFieldError(input, "This field is required.");
    return false;
  }
  const ok = rule.test(input.value);
  setFieldError(input, ok ? "" : rule.message);
  return ok;
}

/* ---------------- page setup ---------------- */
function initPaymentPage() {
  const form = document.getElementById("checkoutForm");
  if (!form) return;

  const summaryItems = document.getElementById("summaryItems");
  const summaryTotals = document.getElementById("summaryTotals");
  const overlay = document.getElementById("successOverlay");
  const orderRef = document.getElementById("orderRef");

  /** Render read-only order summary from the stored cart. */
  function renderSummary() {
    const items = Cart.read();
    const { subtotal, shipping, total, units } = Cart.totals();

    if (summaryItems) {
      summaryItems.innerHTML = items.length
        ? items
            .map(
              (i) => `
          <div class="mini-item">
            <img src="${i.image}" alt="${i.name}" />
            <div class="grow">
              <div style="font-weight:700">${i.name}</div>
              <small>Size UK ${i.size} · Qty ${i.quantity}</small>
            </div>
            <strong>${money(i.price * i.quantity)}</strong>
          </div>`
            )
            .join("")
        : `<p class="meta">Your cart is empty. <a href="products.html" style="color:var(--brand);font-weight:700">Add sneakers</a> before checking out.</p>`;
    }

    if (summaryTotals) {
      summaryTotals.innerHTML = `
        <div class="row"><span>Items</span><span>${units}</span></div>
        <div class="row"><span>Subtotal</span><span>${money(subtotal)}</span></div>
        <div class="row"><span>Shipping</span><span>${shipping === 0 ? "FREE" : money(shipping)}</span></div>
        <div class="row row--total"><span>Amount payable</span><span>${money(total)}</span></div>`;
    }
  }

  // Live formatting helpers for card fields.
  const cardNumber = form.elements.cardNumber;
  cardNumber.addEventListener("input", () => {
    const digits = cardNumber.value.replace(/\D/g, "").slice(0, 16);
    cardNumber.value = digits.replace(/(.{4})/g, "$1 ").trim();
  });

  const expiry = form.elements.expiry;
  expiry.addEventListener("input", () => {
    const digits = expiry.value.replace(/\D/g, "").slice(0, 4);
    expiry.value = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  });

  form.elements.cvv.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\D/g, "").slice(0, 4);
  });
  form.elements.phone.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
  });
  form.elements.zip.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\D/g, "").slice(0, 6);
  });

  // Validate on blur, and clear errors while typing after a failed attempt.
  form.querySelectorAll("input").forEach((input) => {
    input.addEventListener("blur", () => validateField(input));
    input.addEventListener("input", () => {
      if (input.classList.contains("invalid")) validateField(input);
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const inputs = [...form.querySelectorAll("input")];
    const invalid = inputs.filter((input) => !validateField(input));

    if (invalid.length) {
      invalid[0].focus();
      invalid[0].scrollIntoView({ behavior: "smooth", block: "center" });
      showToast("Please fix the highlighted fields.");
      return;
    }

    if (Cart.count() === 0) {
      showToast("Your cart is empty.");
      return;
    }

    // Success: show confirmation, then clear the stored cart.
    if (orderRef) {
      orderRef.textContent = "SV-" + Date.now().toString().slice(-8);
    }
    if (overlay) overlay.classList.add("open");
    Cart.clear();
    form.reset();
    renderSummary();
  });

  renderSummary();
}

document.addEventListener("DOMContentLoaded", initPaymentPage);
