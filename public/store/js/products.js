/* ============================================================
   products.js
   - Shared product catalogue
   - Card rendering, search + filters (products.html)
   - Featured / popular rendering (index.html)
   ============================================================ */

const PRODUCTS = [
  { id: 1,  name: "Velocity Runner 2.0", brand: "Nike",     category: "Running",    price: 7499,  oldPrice: 9999,  rating: 4.6, reviews: 214, image: "images/sneakers/s1.jpg", sizes: [7, 8, 9, 10, 11], tag: "Bestseller" },
  { id: 2,  name: "Court Legend High",   brand: "Jordan",   category: "Basketball", price: 12999, oldPrice: 15999, rating: 4.8, reviews: 341, image: "images/sneakers/s2.jpg", sizes: [8, 9, 10, 11],     tag: "Hot" },
  { id: 3,  name: "Bulk Rider Chunk",    brand: "Puma",     category: "Lifestyle",  price: 5999,  oldPrice: 7999,  rating: 4.3, reviews: 129, image: "images/sneakers/s3.jpg", sizes: [6, 7, 8, 9, 10],   tag: null },
  { id: 4,  name: "Retro Suede Classic", brand: "Adidas",   category: "Lifestyle",  price: 6499,  oldPrice: null,  rating: 4.5, reviews: 187, image: "images/sneakers/s4.jpg", sizes: [7, 8, 9, 10],      tag: "New" },
  { id: 5,  name: "Knit Flow Trainer",   brand: "Adidas",   category: "Running",    price: 8299,  oldPrice: 10499, rating: 4.7, reviews: 263, image: "images/sneakers/s5.jpg", sizes: [7, 8, 9, 10, 11],  tag: "Hot" },
  { id: 6,  name: "Trail Blaze GTX",     brand: "New Balance", category: "Outdoor", price: 9899,  oldPrice: 11999, rating: 4.4, reviews: 96,  image: "images/sneakers/s6.jpg", sizes: [8, 9, 10, 11, 12], tag: null },
  { id: 7,  name: "Air Pulse Lite",      brand: "Nike",     category: "Running",    price: 6899,  oldPrice: 8499,  rating: 4.2, reviews: 74,  image: "images/sneakers/s1.jpg", sizes: [6, 7, 8, 9],       tag: null },
  { id: 8,  name: "Dunk Fire Mid",       brand: "Jordan",   category: "Basketball", price: 11499, oldPrice: null,  rating: 4.9, reviews: 402, image: "images/sneakers/s2.jpg", sizes: [8, 9, 10, 11],     tag: "Limited" },
  { id: 9,  name: "Street Shadow Blk",   brand: "Puma",     category: "Lifestyle",  price: 5499,  oldPrice: 6999,  rating: 4.1, reviews: 61,  image: "images/sneakers/s3.jpg", sizes: [7, 8, 9, 10, 11],  tag: null },
  { id: 10, name: "Sandstone Low",       brand: "New Balance", category: "Lifestyle", price: 7099, oldPrice: 8999, rating: 4.6, reviews: 152, image: "images/sneakers/s4.jpg", sizes: [6, 7, 8, 9, 10],   tag: "Bestseller" },
  { id: 11, name: "Electric Knit Pro",   brand: "Nike",     category: "Running",    price: 10999, oldPrice: 13999, rating: 4.8, reviews: 298, image: "images/sneakers/s5.jpg", sizes: [8, 9, 10, 11, 12], tag: "New" },
  { id: 12, name: "Ridge Runner XT",     brand: "Adidas",   category: "Outdoor",    price: 8799,  oldPrice: 9999,  rating: 4.3, reviews: 88,  image: "images/sneakers/s6.jpg", sizes: [7, 8, 9, 10, 11],  tag: null },
];

/** Format a number as Indian Rupees. */
function money(value) {
  return "₹" + Number(value).toLocaleString("en-IN");
}

/** Build a star string for a rating out of 5. */
function stars(rating) {
  const full = Math.round(rating);
  return "★".repeat(full) + "☆".repeat(5 - full);
}

/** Percentage discount, or 0 when there is no old price. */
function discountPercent(product) {
  if (!product.oldPrice) return 0;
  return Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
}

/** Build the HTML for a single product card. */
function productCard(product) {
  const off = discountPercent(product);
  return `
    <article class="card" data-id="${product.id}">
      <div class="card__media">
        ${product.tag ? `<span class="card__tag">${product.tag}</span>` : ""}
        <img src="${product.image}" alt="${product.name} sneaker by ${product.brand}" loading="lazy" />
      </div>
      <div class="card__body">
        <span class="card__brand">${product.brand} · ${product.category}</span>
        <h3 class="card__name">${product.name}</h3>
        <div class="rating"><span class="stars">${stars(product.rating)}</span> ${product.rating} (${product.reviews})</div>
        <div class="price">
          <strong>${money(product.price)}</strong>
          ${product.oldPrice ? `<s>${money(product.oldPrice)}</s><span class="off">${off}% off</span>` : ""}
        </div>
        <div class="sizes" data-sizes>
          ${product.sizes
            .map((s, i) => `<button type="button" class="size ${i === 0 ? "selected" : ""}" data-size="${s}">UK ${s}</button>`)
            .join("")}
        </div>
        <button class="btn btn--dark btn--block" data-add="${product.id}" style="margin-top:auto">Add to Cart</button>
      </div>
    </article>`;
}

/** Render a list of products into a container element. */
function renderProducts(container, list) {
  if (!container) return;
  container.innerHTML = list.length
    ? list.map(productCard).join("")
    : `<div class="empty" style="grid-column:1/-1">
         <h3>No sneakers found</h3>
         <p>Try a different search term or clear the filters.</p>
       </div>`;
}

/** Wire size selection + add-to-cart clicks for any grid (event delegation). */
function attachGridEvents(container) {
  if (!container) return;
  container.addEventListener("click", (event) => {
    const sizeBtn = event.target.closest(".size");
    if (sizeBtn) {
      sizeBtn.parentElement.querySelectorAll(".size").forEach((b) => b.classList.remove("selected"));
      sizeBtn.classList.add("selected");
      return;
    }

    const addBtn = event.target.closest("[data-add]");
    if (!addBtn) return;
    const card = addBtn.closest(".card");
    const product = PRODUCTS.find((p) => p.id === Number(addBtn.dataset.add));
    const selected = card.querySelector(".size.selected");
    Cart.add(product, selected ? Number(selected.dataset.size) : product.sizes[0]);
    showToast(`${product.name} added to cart`);
  });
}

/* ---------------- products.html: search + filters ---------------- */
function initProductsPage() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  const searchInput = document.getElementById("searchInput");
  const brandChips = document.getElementById("brandChips");
  const categorySelect = document.getElementById("categorySelect");
  const resultCount = document.getElementById("resultCount");

  const state = { query: "", brand: "All", category: "All" };

  function applyFilters() {
    const query = state.query.trim().toLowerCase();
    const list = PRODUCTS.filter((p) => {
      const matchesQuery =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query);
      const matchesBrand = state.brand === "All" || p.brand === state.brand;
      const matchesCategory = state.category === "All" || p.category === state.category;
      return matchesQuery && matchesBrand && matchesCategory;
    });

    renderProducts(grid, list);
    if (resultCount) {
      resultCount.textContent = `${list.length} product${list.length === 1 ? "" : "s"}`;
    }
  }

  // Brand chips are built from the catalogue so they never fall out of sync.
  if (brandChips) {
    const brands = ["All", ...new Set(PRODUCTS.map((p) => p.brand))];
    brandChips.innerHTML = brands
      .map((b) => `<button type="button" class="chip ${b === "All" ? "active" : ""}" data-brand="${b}">${b}</button>`)
      .join("");
    brandChips.addEventListener("click", (event) => {
      const chip = event.target.closest(".chip");
      if (!chip) return;
      brandChips.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      state.brand = chip.dataset.brand;
      applyFilters();
    });
  }

  if (categorySelect) {
    const categories = ["All", ...new Set(PRODUCTS.map((p) => p.category))];
    categorySelect.innerHTML = categories.map((c) => `<option value="${c}">${c === "All" ? "All categories" : c}</option>`).join("");
    categorySelect.addEventListener("change", () => {
      state.category = categorySelect.value;
      applyFilters();
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      state.query = searchInput.value;
      applyFilters();
    });
    // Support ?q= and ?brand= links coming from the landing page.
    const params = new URLSearchParams(location.search);
    if (params.get("q")) {
      searchInput.value = params.get("q");
      state.query = params.get("q");
    }
    if (params.get("category")) {
      state.category = params.get("category");
      if (categorySelect) categorySelect.value = state.category;
    }
    if (params.get("brand") && brandChips) {
      state.brand = params.get("brand");
      brandChips.querySelectorAll(".chip").forEach((c) => {
        c.classList.toggle("active", c.dataset.brand === state.brand);
      });
    }
  }

  attachGridEvents(grid);
  applyFilters();
}

/* ---------------- index.html: featured + popular ---------------- */
function initHomeGrids() {
  const featured = document.getElementById("featuredGrid");
  const popular = document.getElementById("popularGrid");
  if (featured) {
    renderProducts(featured, PRODUCTS.slice(0, 4));
    attachGridEvents(featured);
  }
  if (popular) {
    const top = [...PRODUCTS].sort((a, b) => b.rating - a.rating).slice(0, 4);
    renderProducts(popular, top);
    attachGridEvents(popular);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initProductsPage();
  initHomeGrids();
});
