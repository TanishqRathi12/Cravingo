/* =====================================================
   CRAVINGO — Site Script
   Sections:
   1. Data (products)
   2. State + persistence (localStorage)
   3. Utilities (toast, currency)
   4. Loader / Theme / Navbar / Mobile menu / Search
   5. Scroll reveal (AOS-lite) + counters + nutrition rings
   6. Products render + filter + quick view
   7. Wishlist
   8. Cart (drawer, qty, totals, checkout)
   9. Auth (login/register) + Rewards progress
   10. Testimonial slider
   11. Newsletter / Contact forms
   12. Terms & Privacy modal
   13. Checkout invoice (PDF + CSV)
   14. Init
===================================================== */

(() => {
  "use strict";

  /* ---------------------------------------------------
     1. PRODUCT DATA
  --------------------------------------------------- */
  const PRODUCTS = [
    {
      id: "p1",
      name: "Masala Makhana",
      category: "makhana",
      tag: "Bestseller",
      desc: "Roasted lotus seeds tossed in a bold, tangy masala blend.",
      price: 199,
      oldPrice: 249,
      rating: 4.8,
      reviews: 312,
      img: "Image1.jpeg",
      weight: "100g pack"
    },
    {
      id: "p2",
      name: "Pudina Mint Makhana",
      category: "makhana",
      tag: "New",
      desc: "Cool minty roast for a refreshing, light snack break.",
      price: 199,
      oldPrice: 249,
      rating: 4.6,
      reviews: 184,
      img: "Image3.jpeg",
      weight: "100g pack"
    },
    {
      id: "p3",
      name: "NutriBite Protein Bar",
      category: "protein",
      tag: "High Protein",
      desc: "20g protein bar to refuel after a workout or a long day.",
      price: 89,
      oldPrice: 109,
      rating: 4.7,
      reviews: 256,
      img: "Image2.jpeg",
      weight: "Single bar, 60g"
    },
    {
      id: "p5",
      name: "Energy Mix",
      category: "fitness",
      tag: "Pre-Workout",
      desc: "Nuts, seeds and dried fruit for sustained energy.",
      price: 259,
      oldPrice: 299,
      rating: 4.7,
      reviews: 121,
      img: "Image6.jpeg",
      weight: "200g pack"
    },
    {
      id: "p6",
      name: "Oats Mix",
      category: "weight",
      tag: "Low Cal",
      desc: "Light, airy veggie puffs at under 90 kcal a serving.",
      price: 169,
      oldPrice: 199,
      rating: 4.3,
      reviews: 76,
      img: "Image9.jpeg",
      weight: "80g pack"
    },
    {
      id: "p10",
      name: "Atta Biscuits",
      category: "protein",
      tag: "High Protein",
      desc: "Premium whole wheat flour for soft, nutritious, and wholesome daily meals.",
      price: 229,
      oldPrice: 269,
      rating: 4.8,
      reviews: 203,
      img: "Image10.jpeg",
      weight: "6 pack box"
    },
    {
      id: "p13",
      name: "Turmeric Powder",
      category: "protein",
      tag: "High Protein",
      desc: "Pure turmeric powder packed with natural flavor, color, and wellness benefits.",
      price: 229,
      oldPrice: 269,
      rating: 4.8,
      reviews: 203,
      img: "Image13.jpeg",
      weight: "6 pack box"
    },
    {
      id: "p12",
      name: "Soya Powder",
      category: "weight",
      tag: "High Protein",
      desc: "Protein-rich soy milk powder for a nutritious and dairy-free beverage.",
      price: 229,
      oldPrice: 269,
      rating: 4.8,
      reviews: 203,
      img: "Image12.jpeg",
      weight: "6 pack box"
    },
    {
      id: "p11",
      name: "Multi Grain Biscuit",
      category: "protein",
      tag: "High Protein",
      desc: "Crunchy biscuits made with multiple grains for a tasty and healthy snack.",
      price: 229,
      oldPrice: 269,
      rating: 4.8,
      reviews: 203,
      img: "Image11.jpeg",
      weight: "6 pack box"
    }
  ];

  /* ---------------------------------------------------
     2. STATE + PERSISTENCE
  --------------------------------------------------- */
  const STORAGE_KEYS = {
    cart: "cravingo_cart",
    wishlist: "cravingo_wishlist",
    user: "cravingo_user",
    users: "cravingo_users",
    theme: "cravingo_theme"
  };

  const loadJSON = (key, fallback) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  };
  const saveJSON = (key, val) => {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch {
      /* storage unavailable — fail silently */
    }
  };

  const state = {
    cart: loadJSON(STORAGE_KEYS.cart, []), // [{id, qty}]
    wishlist: loadJSON(STORAGE_KEYS.wishlist, []), // [id]
    user: loadJSON(STORAGE_KEYS.user, null), // {name, email, orders}
    users: loadJSON(STORAGE_KEYS.users, []), // [{name,email,password,orders}]
    currentFilter: "all"
  };

  const findProduct = (id) => PRODUCTS.find((p) => p.id === id);

  /* ---------------------------------------------------
     3. UTILITIES
  --------------------------------------------------- */
  const fmt = (n) => "₹" + Number(n).toLocaleString("en-IN");

  let toastTimer = null;
  function showToast(msg) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
  }

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------------------------------------------------
     4. LOADER / THEME / NAVBAR / MOBILE MENU / SEARCH
  --------------------------------------------------- */
  function initLoader() {
    window.addEventListener("load", () => {
      const loader = document.getElementById("loader");
      if (loader) setTimeout(() => loader.classList.add("loaded"), 350);
    });
    // Fallback in case 'load' already fired
    setTimeout(() => {
      const loader = document.getElementById("loader");
      if (loader) loader.classList.add("loaded");
    }, 2500);
  }

  function initTheme() {
    const saved = localStorage.getItem(STORAGE_KEYS.theme);
    const themeBtn = document.getElementById("themeToggle");
    const icon = themeBtn ? themeBtn.querySelector("i") : null;

    const apply = (theme) => {
      if (theme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
        if (icon) {
          icon.classList.remove("fa-moon");
          icon.classList.add("fa-sun");
        }
      } else {
        document.documentElement.removeAttribute("data-theme");
        if (icon) {
          icon.classList.remove("fa-sun");
          icon.classList.add("fa-moon");
        }
      }
    };

    apply(saved === "dark" ? "dark" : "light");

    themeBtn?.addEventListener("click", () => {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      const next = isDark ? "light" : "dark";
      apply(next);
      localStorage.setItem(STORAGE_KEYS.theme, next);
    });
  }

  function initNavbar() {
    const navbar = document.getElementById("navbar");
    const onScroll = () => {
      if (window.scrollY > 30) navbar?.classList.add("scrolled");
      else navbar?.classList.remove("scrolled");

      const scrollTopBtn = document.getElementById("scrollTop");
      if (window.scrollY > 500) scrollTopBtn?.classList.add("show");
      else scrollTopBtn?.classList.remove("show");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    document.getElementById("scrollTop")?.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function initMobileMenu() {
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");
    menuToggle?.addEventListener("click", () => navLinks?.classList.toggle("open"));

    $$(".nav-links a").forEach((a) =>
      a.addEventListener("click", () => navLinks?.classList.remove("open"))
    );
  }

  function initSearch() {
    const wrap = $(".search-wrap");
    const toggle = document.getElementById("searchToggle");
    const input = document.getElementById("searchInput");

    toggle?.addEventListener("click", () => {
      wrap?.classList.toggle("open");
      if (wrap?.classList.contains("open")) input?.focus();
    });

    input?.addEventListener("input", () => {
      renderProducts(state.currentFilter, input.value.trim().toLowerCase());
    });

    document.addEventListener("click", (e) => {
      if (wrap && !wrap.contains(e.target)) wrap.classList.remove("open");
    });
  }

  /* ---------------------------------------------------
     5. SCROLL REVEAL + COUNTERS + NUTRITION RINGS
  --------------------------------------------------- */
  function initScrollReveal() {
    const targets = $$("[data-aos]");
    if (!("IntersectionObserver" in window) || targets.length === 0) {
      targets.forEach((t) => t.classList.add("aos-active"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("aos-active");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    targets.forEach((t) => observer.observe(t));
  }

  function initCounters() {
    const counters = $$(".counter");
    if (counters.length === 0) return;

    const animateCounter = (el) => {
      const decimalTarget = el.dataset.decimal;
      const target = decimalTarget ? parseFloat(decimalTarget) : parseInt(el.dataset.target, 10);
      const isDecimal = !!decimalTarget;
      const duration = 1400;
      const start = performance.now();

      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = target * eased;
        el.textContent = isDecimal
          ? current.toFixed(1)
          : Math.round(current).toLocaleString("en-IN");
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = isDecimal ? target.toFixed(1) : target.toLocaleString("en-IN");
      };
      requestAnimationFrame(step);
    };

    if (!("IntersectionObserver" in window)) {
      counters.forEach(animateCounter);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((c) => observer.observe(c));
  }

  function initNutritionRings() {
    const circles = $$(".nutri-circle");
    if (circles.length === 0) return;

    const RADIUS = 52;
    const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

    const animate = (el) => {
      const percent = parseFloat(el.dataset.percent || "0");
      const color = el.dataset.color;
      const ring = el.querySelector(".ring-fill");
      if (!ring) return;
      ring.style.stroke = color || "var(--green)";
      ring.style.strokeDasharray = `${CIRCUMFERENCE}`;
      const offset = CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE;
      requestAnimationFrame(() => {
        ring.style.strokeDashoffset = `${offset}`;
      });
    };

    if (!("IntersectionObserver" in window)) {
      circles.forEach(animate);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    circles.forEach((c) => observer.observe(c));
  }

  /* ---------------------------------------------------
     6. PRODUCTS RENDER + FILTER + QUICK VIEW
  --------------------------------------------------- */
  function starRating(rating) {
    const full = Math.round(rating);
    return "★★★★★".slice(0, full) + "☆☆☆☆☆".slice(0, 5 - full);
  }

  function productCardHTML(p) {
    const inWishlist = state.wishlist.includes(p.id);
    const qty = state.cart.find((c) => c.id === p.id)?.qty || 0;

    return `
    <article class="product-card" data-id="${p.id}">
      <div class="product-img-wrap">
        <span class="product-tag">${p.tag}</span>
        <button class="wish-toggle ${inWishlist ? "active" : ""}" data-id="${p.id}" aria-label="Toggle wishlist">
          <i class="fa-${inWishlist ? "solid" : "regular"} fa-heart"></i>
        </button>
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        <button class="quick-view-btn" data-id="${p.id}">Quick View</button>
      </div>
      <div class="product-body">
        <h4>${p.name}</h4>
        <p class="desc">${p.desc}</p>
        <div class="product-rating">${starRating(p.rating)}<span>(${p.reviews})</span></div>
        <div class="product-price-row">
          <span class="price">${fmt(p.price)}</span>
          <span class="price-old">${fmt(p.oldPrice)}</span>
        </div>
        <div class="qty-row">
          ${qty > 0
        ? `<div class="qty-control" data-id="${p.id}">
                  <button class="qty-dec">−</button>
                  <span class="qty-val">${qty}</span>
                  <button class="qty-inc">+</button>
                </div>
                <button class="btn btn-ghost btn-small add-cart-btn" data-id="${p.id}" disabled>In Cart</button>`
        : `<button class="btn btn-primary btn-small add-cart-btn full" data-id="${p.id}">Add to Cart</button>`
      }
        </div>
      </div>
    </article>`;
  }

  function renderProducts(filter = "all", search = "") {
    const grid = document.getElementById("productsGrid");
    if (!grid) return;

    let list = filter === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter);
    if (search) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.desc.toLowerCase().includes(search) ||
          p.category.toLowerCase().includes(search)
      );
    }

    grid.innerHTML = list.length
      ? list.map(productCardHTML).join("")
      : `<p class="empty-msg" style="grid-column:1/-1;">No snacks match your search. Try another keyword.</p>`;

    $$("[data-aos]", grid).forEach((el) => el.classList.add("aos-active"));
  }

  function initFilters() {
    $$(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        $$(".filter-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        state.currentFilter = btn.dataset.filter;
        const searchVal = document.getElementById("searchInput")?.value.trim().toLowerCase() || "";
        renderProducts(state.currentFilter, searchVal);
      });
    });

    $$(".explore-cat").forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.dataset.filter;
        state.currentFilter = filter;
        $$(".filter-btn").forEach((b) => b.classList.toggle("active", b.dataset.filter === filter));
        renderProducts(filter);
        document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
      });
    });
  }

  function quickViewHTML(p) {
    const inWishlist = state.wishlist.includes(p.id);
    return `
      <img src="${p.img}" alt="${p.name}">
      <span class="product-tag" style="position:static;display:inline-block;margin-bottom:10px;">${p.tag}</span>
      <h3>${p.name}</h3>
      <p style="color:var(--ink-soft);margin:10px 0;">${p.desc}</p>
      <p style="color:var(--ink-soft);font-size:.85rem;margin-bottom:10px;">${p.weight}</p>
      <div class="product-rating" style="margin-bottom:14px;">${starRating(p.rating)}<span>(${p.reviews} reviews)</span></div>
      <div class="product-price-row" style="margin-bottom:20px;">
        <span class="price" style="font-size:1.5rem;">${fmt(p.price)}</span>
        <span class="price-old">${fmt(p.oldPrice)}</span>
      </div>
      <div style="display:flex;gap:12px;">
        <button class="btn btn-primary qv-add-cart" data-id="${p.id}">Add to Cart</button>
        <button class="btn btn-ghost qv-wishlist" data-id="${p.id}">
          <i class="fa-${inWishlist ? "solid" : "regular"} fa-heart"></i> ${inWishlist ? "Saved" : "Save"}
        </button>
      </div>`;
  }

  function openQuickView(id) {
    const p = findProduct(id);
    if (!p) return;
    document.getElementById("quickViewContent").innerHTML = quickViewHTML(p);
    document.getElementById("quickViewOverlay").classList.add("show");
  }

  function initQuickView() {
    document.getElementById("productsGrid")?.addEventListener("click", (e) => {
      const btn = e.target.closest(".quick-view-btn");
      if (btn) openQuickView(btn.dataset.id);
    });

    document.getElementById("closeQuickView")?.addEventListener("click", () => {
      document.getElementById("quickViewOverlay").classList.remove("show");
    });
    document.getElementById("quickViewOverlay")?.addEventListener("click", (e) => {
      if (e.target.id === "quickViewOverlay") e.currentTarget.classList.remove("show");
    });

    document.getElementById("quickViewContent")?.addEventListener("click", (e) => {
      const addBtn = e.target.closest(".qv-add-cart");
      const wishBtn = e.target.closest(".qv-wishlist");
      if (addBtn) {
        addToCart(addBtn.dataset.id);
        document.getElementById("quickViewOverlay").classList.remove("show");
      }
      if (wishBtn) {
        toggleWishlist(wishBtn.dataset.id);
        openQuickView(wishBtn.dataset.id); // refresh modal state
      }
    });
  }

  /* ---------------------------------------------------
     7. WISHLIST
  --------------------------------------------------- */
  function toggleWishlist(id) {
    const idx = state.wishlist.indexOf(id);
    if (idx > -1) {
      state.wishlist.splice(idx, 1);
      showToast("Removed from wishlist");
    } else {
      state.wishlist.push(id);
      showToast("Added to wishlist");
    }
    saveJSON(STORAGE_KEYS.wishlist, state.wishlist);
    updateWishlistUI();
    renderProducts(state.currentFilter, document.getElementById("searchInput")?.value.trim().toLowerCase() || "");
  }

  function updateWishlistUI() {
    const countEl = document.getElementById("wishlistCount");
    if (countEl) countEl.textContent = state.wishlist.length;

    const container = document.getElementById("wishlistItems");
    if (!container) return;

    if (state.wishlist.length === 0) {
      container.innerHTML = `<p class="empty-msg">Your wishlist is empty. Tap the heart on any snack to save it here.</p>`;
      return;
    }

    container.innerHTML = state.wishlist
      .map((id) => {
        const p = findProduct(id);
        if (!p) return "";
        return `
        <div class="cart-item" data-id="${p.id}">
          <img src="${p.img}" alt="${p.name}">
          <div class="cart-item-info">
            <h5>${p.name}</h5>
            <span class="price">${fmt(p.price)}</span>
          </div>
          <div class="cart-item-actions">
            <button class="btn btn-small btn-primary wl-add-cart" data-id="${p.id}">Add</button>
            <button class="remove-item wl-remove" data-id="${p.id}"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>`;
      })
      .join("");
  }

  function initWishlistDrawer() {
    const drawer = document.getElementById("wishlistDrawer");
    const overlay = document.getElementById("drawerOverlay");

    document.getElementById("wishlistBtn")?.addEventListener("click", () => {
      drawer?.classList.add("open");
      overlay?.classList.add("show");
    });
    document.getElementById("closeWishlist")?.addEventListener("click", closeDrawers);
    overlay?.addEventListener("click", closeDrawers);

    document.getElementById("wishlistItems")?.addEventListener("click", (e) => {
      const addBtn = e.target.closest(".wl-add-cart");
      const removeBtn = e.target.closest(".wl-remove");
      if (addBtn) addToCart(addBtn.dataset.id);
      if (removeBtn) toggleWishlist(removeBtn.dataset.id);
    });

    document.getElementById("productsGrid")?.addEventListener("click", (e) => {
      const btn = e.target.closest(".wish-toggle");
      if (btn) toggleWishlist(btn.dataset.id);
    });
  }

  function closeDrawers() {
    document.getElementById("cartDrawer")?.classList.remove("open");
    document.getElementById("wishlistDrawer")?.classList.remove("open");
    document.getElementById("drawerOverlay")?.classList.remove("show");
  }

  /* ---------------------------------------------------
     8. CART (drawer, qty, totals, checkout)
  --------------------------------------------------- */
  function addToCart(id) {
    const item = state.cart.find((c) => c.id === id);
    if (item) item.qty += 1;
    else state.cart.push({ id, qty: 1 });
    saveJSON(STORAGE_KEYS.cart, state.cart);
    showToast("Added to cart");
    updateCartUI();
    renderProducts(state.currentFilter, document.getElementById("searchInput")?.value.trim().toLowerCase() || "");
  }

  function changeQty(id, delta) {
    const item = state.cart.find((c) => c.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) state.cart = state.cart.filter((c) => c.id !== id);
    saveJSON(STORAGE_KEYS.cart, state.cart);
    updateCartUI();
    renderProducts(state.currentFilter, document.getElementById("searchInput")?.value.trim().toLowerCase() || "");
  }

  function removeFromCart(id) {
    state.cart = state.cart.filter((c) => c.id !== id);
    saveJSON(STORAGE_KEYS.cart, state.cart);
    showToast("Removed from cart");
    updateCartUI();
    renderProducts(state.currentFilter, document.getElementById("searchInput")?.value.trim().toLowerCase() || "");
  }

  function cartTotals() {
    const items = state.cart
      .map((c) => ({ ...c, product: findProduct(c.id) }))
      .filter((c) => c.product);

    const subtotal = items.reduce((sum, c) => sum + c.product.price * c.qty, 0);

    // "Buy 2 Get 1 Free" — applies per makhana category: every 3rd unit free
    const makhanaUnits = items
      .filter((c) => c.product.category === "makhana")
      .reduce((sum, c) => sum + c.qty, 0);
    const freeMakhanaCount = Math.floor(makhanaUnits / 3);
    const cheapestMakhanaPrice = items
      .filter((c) => c.product.category === "makhana")
      .reduce((min, c) => Math.min(min, c.product.price), Infinity);
    const bulkDiscount =
      freeMakhanaCount > 0 && cheapestMakhanaPrice !== Infinity
        ? freeMakhanaCount * cheapestMakhanaPrice
        : 0;

    // Reward discount — 15% if user has unlocked it (every 6th order)
    const rewardEligible = !!(state.user && state.user.orders > 0 && state.user.orders % 6 === 5);
    const afterBulk = subtotal - bulkDiscount;
    const rewardDiscount = rewardEligible ? Math.round(afterBulk * 0.15) : 0;

    const total = Math.max(afterBulk - rewardDiscount, 0);

    return { items, subtotal, bulkDiscount, rewardDiscount, total, rewardEligible };
  }

  function cartItemHTML(c) {
    return `
    <div class="cart-item" data-id="${c.id}">
      <img src="${c.product.img}" alt="${c.product.name}">
      <div class="cart-item-info">
        <h5>${c.product.name}</h5>
        <span class="price">${fmt(c.product.price)}</span>
      </div>
      <div class="cart-item-actions">
        <div class="qty-control">
          <button class="cart-qty-dec" data-id="${c.id}">−</button>
          <span class="qty-val">${c.qty}</span>
          <button class="cart-qty-inc" data-id="${c.id}">+</button>
        </div>
        <button class="remove-item cart-remove" data-id="${c.id}"><i class="fa-solid fa-trash"></i></button>
      </div>
    </div>`;
  }

  function updateCartUI() {
    const countEl = document.getElementById("cartCount");
    const totalQty = state.cart.reduce((sum, c) => sum + c.qty, 0);
    if (countEl) countEl.textContent = totalQty;

    const container = document.getElementById("cartItems");
    const { items, subtotal, bulkDiscount, rewardDiscount, total, rewardEligible } = cartTotals();

    if (container) {
      container.innerHTML = items.length
        ? items.map(cartItemHTML).join("")
        : `<p class="empty-msg">Your cart is empty. Add a few snacks to get started!</p>`;
    }

    const subtotalVal = document.getElementById("subtotalVal");
    if (subtotalVal) subtotalVal.textContent = fmt(subtotal);

    const bulkRow = document.getElementById("bulkDiscountRow");
    const bulkVal = document.getElementById("bulkDiscountVal");
    if (bulkRow && bulkVal) {
      bulkRow.style.display = bulkDiscount > 0 ? "flex" : "none";
      bulkVal.textContent = "-" + fmt(bulkDiscount);
    }

    const rewardRow = document.getElementById("rewardDiscountRow");
    const rewardVal = document.getElementById("rewardDiscountVal");
    if (rewardRow && rewardVal) {
      rewardRow.style.display = rewardEligible && rewardDiscount > 0 ? "flex" : "none";
      rewardVal.textContent = "-" + fmt(rewardDiscount);
    }

    const totalVal = document.getElementById("totalVal");
    if (totalVal) totalVal.textContent = fmt(total);

    const checkoutBtn = document.getElementById("checkoutBtn");
    if (checkoutBtn) checkoutBtn.disabled = items.length === 0;
  }

  function initCartDrawer() {
    const drawer = document.getElementById("cartDrawer");
    const overlay = document.getElementById("drawerOverlay");

    document.getElementById("cartBtn")?.addEventListener("click", () => {
      drawer?.classList.add("open");
      overlay?.classList.add("show");
    });
    document.getElementById("closeCart")?.addEventListener("click", closeDrawers);
    overlay?.addEventListener("click", closeDrawers);

    document.getElementById("cartItems")?.addEventListener("click", (e) => {
      const dec = e.target.closest(".cart-qty-dec");
      const inc = e.target.closest(".cart-qty-inc");
      const remove = e.target.closest(".cart-remove");
      if (dec) changeQty(dec.dataset.id, -1);
      if (inc) changeQty(inc.dataset.id, 1);
      if (remove) removeFromCart(remove.dataset.id);
    });

    document.getElementById("productsGrid")?.addEventListener("click", (e) => {
      const addBtn = e.target.closest(".add-cart-btn:not([disabled])");
      const incBtn = e.target.closest(".qty-inc");
      const decBtn = e.target.closest(".qty-dec");
      if (addBtn) addToCart(addBtn.dataset.id);
      if (incBtn) changeQty(incBtn.closest(".qty-control").dataset.id, 1);
      if (decBtn) changeQty(decBtn.closest(".qty-control").dataset.id, -1);
    });

    document.getElementById("checkoutBtn")?.addEventListener("click", handleCheckout);
  }

  /* ---------------------------------------------------
     9. AUTH (login/register) + REWARDS PROGRESS
  --------------------------------------------------- */
  function initAuthTabs() {
    $$(".auth-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        $$(".auth-tab").forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        $$(".auth-form").forEach((f) => f.classList.remove("active"));
        document.getElementById(tab.dataset.tab + "Form")?.classList.add("active");
      });
    });
  }

  function simpleHash(str) {
    // Lightweight non-cryptographic hash for demo-only local storage.
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return String(hash);
  }

  function initAuthForms() {
    document.getElementById("registerForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("regName").value.trim();
      const email = document.getElementById("regEmail").value.trim().toLowerCase();
      const password = document.getElementById("regPassword").value;

      if (state.users.some((u) => u.email === email)) {
        showToast("An account with this email already exists");
        return;
      }

      const newUser = { name, email, passwordHash: simpleHash(password), orders: 0 };
      state.users.push(newUser);
      saveJSON(STORAGE_KEYS.users, state.users);

      state.user = { name, email, orders: 0 };
      saveJSON(STORAGE_KEYS.user, state.user);

      showToast(`Welcome to Cravingo, ${name.split(" ")[0]}!`);
      updateAuthUI();
      e.target.reset();
    });

    document.getElementById("loginForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value.trim().toLowerCase();
      const password = document.getElementById("loginPassword").value;

      const match = state.users.find(
        (u) => u.email === email && u.passwordHash === simpleHash(password)
      );

      if (!match) {
        showToast("Invalid email or password");
        return;
      }

      state.user = { name: match.name, email: match.email, orders: match.orders || 0 };
      saveJSON(STORAGE_KEYS.user, state.user);
      showToast(`Welcome back, ${match.name.split(" ")[0]}!`);
      updateAuthUI();
      e.target.reset();
    });

    document.getElementById("logoutBtn")?.addEventListener("click", () => {
      state.user = null;
      localStorage.removeItem(STORAGE_KEYS.user);
      showToast("Logged out");
      updateAuthUI();
    });
  }

  function updateAuthUI() {
    const loggedOut = document.getElementById("loggedOutView");
    const loggedIn = document.getElementById("loggedInView");
    if (!loggedOut || !loggedIn) return;

    if (state.user) {
      loggedOut.classList.add("hidden");
      loggedIn.classList.remove("hidden");

      document.getElementById("avatarInitial").textContent = state.user.name.charAt(0).toUpperCase();
      document.getElementById("welcomeName").textContent = `Welcome back, ${state.user.name.split(" ")[0]}!`;
      document.getElementById("welcomeEmail").textContent = state.user.email;

      const ordersInCycle = state.user.orders % 6;
      const progressText = document.getElementById("orderProgressText");
      const progressFill = document.getElementById("orderProgressFill");
      const note = document.getElementById("rewardNote");

      if (progressText) progressText.textContent = `${ordersInCycle} / 6`;
      if (progressFill) progressFill.style.width = `${(ordersInCycle / 6) * 100}%`;
      if (note) {
        note.textContent =
          ordersInCycle === 5
            ? "Your next order unlocks a 15% reward discount automatically!"
            : `Place ${6 - ordersInCycle} more order${6 - ordersInCycle === 1 ? "" : "s"} to unlock 15% off.`;
      }
    } else {
      loggedOut.classList.remove("hidden");
      loggedIn.classList.add("hidden");
    }
  }

  function recordOrder() {
    if (!state.user) return;
    state.user.orders += 1;
    saveJSON(STORAGE_KEYS.user, state.user);

    const idx = state.users.findIndex((u) => u.email === state.user.email);
    if (idx > -1) {
      state.users[idx].orders = state.user.orders;
      saveJSON(STORAGE_KEYS.users, state.users);
    }
    updateAuthUI();
  }

  /* ---------------------------------------------------
     10. TESTIMONIAL SLIDER
  --------------------------------------------------- */
  function initTestimonialSlider() {
    const track = document.getElementById("testimonialTrack");
    const prevBtn = document.getElementById("testPrev");
    const nextBtn = document.getElementById("testNext");
    if (!track) return;

    const slides = $$(".testimonial-card", track);
    let index = 0;

    const update = () => {
      track.style.transform = `translateX(-${index * 100}%)`;
    };

    nextBtn?.addEventListener("click", () => {
      index = (index + 1) % slides.length;
      update();
    });
    prevBtn?.addEventListener("click", () => {
      index = (index - 1 + slides.length) % slides.length;
      update();
    });

    let autoTimer = setInterval(() => {
      index = (index + 1) % slides.length;
      update();
    }, 5500);

    track.closest(".testimonial-slider")?.addEventListener("mouseenter", () => clearInterval(autoTimer));
    track.closest(".testimonial-slider")?.addEventListener("mouseleave", () => {
      autoTimer = setInterval(() => {
        index = (index + 1) % slides.length;
        update();
      }, 5500);
    });
  }

  /* ---------------------------------------------------
     11. NEWSLETTER / CONTACT FORMS
  --------------------------------------------------- */
  function initMiscForms() {
    document.getElementById("newsletterForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      showToast("Subscribed! Check your inbox for 10% off.");
      e.target.reset();
    });

    document.getElementById("contactForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      showToast("Message sent — we'll get back to you soon!");
      e.target.reset();
    });
  }

  /* ---------------------------------------------------
     12. TERMS & PRIVACY MODAL
  --------------------------------------------------- */
  const INFO_CONTENT = {
    privacy: {
      title: "Privacy Policy",
      body: `
        <p>Cravingo collects only the information needed to process your orders and improve your snacking experience: name, email, delivery address, and order history.</p>
        <p>We never sell your personal data to third parties. Information is used solely for order fulfilment, customer support, and — if you opt in — newsletter updates.</p>
        <p>You can request access to or deletion of your data at any time by contacting hello@cravingo.in.</p>`
    },
    terms: {
      title: "Terms & Conditions",
      body: `
        <p>By placing an order with Cravingo, you agree to provide accurate delivery details and to use our products as intended.</p>
        <p>Promotional offers such as "Buy 2 Get 1 Free" and reward discounts cannot be combined unless explicitly stated, and Cravingo reserves the right to modify or end promotions at any time.</p>
        <p>All product images are for illustration. Actual packaging may vary slightly.</p>`
    }
  };

  function initInfoModal() {
    const openModal = (key) => {
      const data = INFO_CONTENT[key];
      if (!data) return;
      document.getElementById("infoTitle").textContent = data.title;
      document.getElementById("infoBody").innerHTML = data.body;
      document.getElementById("infoOverlay").classList.add("show");
    };

    document.getElementById("privacyLink")?.addEventListener("click", (e) => {
      e.preventDefault();
      openModal("privacy");
    });
    document.getElementById("termsLink")?.addEventListener("click", (e) => {
      e.preventDefault();
      openModal("terms");
    });
    document.getElementById("closeInfo")?.addEventListener("click", () => {
      document.getElementById("infoOverlay").classList.remove("show");
    });
    document.getElementById("infoOverlay")?.addEventListener("click", (e) => {
      if (e.target.id === "infoOverlay") e.currentTarget.classList.remove("show");
    });
  }

  /* ---------------------------------------------------
     13. CHECKOUT INVOICE (PDF + CSV)
  --------------------------------------------------- */
  let lastInvoice = null; // {items, subtotal, bulkDiscount, rewardDiscount, total, date, customer}

  function invoiceRowsHTML(invoice) {
    const rows = invoice.items
      .map(
        (c) => `<tr><td>${c.product.name} × ${c.qty}</td><td style="text-align:right;">${fmt(
          c.product.price * c.qty
        )}</td></tr>`
      )
      .join("");

    return `
      <table>
        ${rows}
        <tr><td>Subtotal</td><td style="text-align:right;">${fmt(invoice.subtotal)}</td></tr>
        ${invoice.bulkDiscount > 0
        ? `<tr><td>Buy 2 Get 1 Free</td><td style="text-align:right;">-${fmt(invoice.bulkDiscount)}</td></tr>`
        : ""
      }
        ${invoice.rewardDiscount > 0
        ? `<tr><td>Reward Discount (15%)</td><td style="text-align:right;">-${fmt(invoice.rewardDiscount)}</td></tr>`
        : ""
      }
        <tr><td><strong>Total</strong></td><td style="text-align:right;"><strong>${fmt(invoice.total)}</strong></td></tr>
      </table>
      <p style="margin-top:12px;color:var(--ink-soft);font-size:.8rem;">Order date: ${invoice.date}</p>`;
  }

  function handleCheckout() {
    const totals = cartTotals();
    if (totals.items.length === 0) {
      showToast("Your cart is empty");
      return;
    }

    lastInvoice = {
      ...totals,
      date: new Date().toLocaleString("en-IN"),
      customer: state.user ? state.user.name : "Guest"
    };

    document.getElementById("checkoutCustomerName").textContent = state.user
      ? `, ${state.user.name.split(" ")[0]}`
      : "";
    document.getElementById("invoiceSummary").innerHTML = invoiceRowsHTML(lastInvoice);
    document.getElementById("checkoutOverlay").classList.add("show");

    closeDrawers();
    recordOrder();

    state.cart = [];
    saveJSON(STORAGE_KEYS.cart, state.cart);
    updateCartUI();
    renderProducts(state.currentFilter, document.getElementById("searchInput")?.value.trim().toLowerCase() || "");
  }

  function downloadFile(filename, content, mime) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function buildInvoiceCSV(invoice) {
    const lines = [["Item", "Qty", "Unit Price", "Line Total"]];
    invoice.items.forEach((c) => {
      lines.push([c.product.name, c.qty, c.product.price, c.product.price * c.qty]);
    });
    lines.push([]);
    lines.push(["Subtotal", "", "", invoice.subtotal]);
    if (invoice.bulkDiscount > 0) lines.push(["Buy 2 Get 1 Free", "", "", -invoice.bulkDiscount]);
    if (invoice.rewardDiscount > 0) lines.push(["Reward Discount (15%)", "", "", -invoice.rewardDiscount]);
    lines.push(["Total", "", "", invoice.total]);
    lines.push([]);
    lines.push(["Customer", invoice.customer]);
    lines.push(["Date", invoice.date]);

    return lines.map((row) => row.join(",")).join("\n");
  }

  function buildInvoiceTextPDF(invoice) {
    // Minimal, dependency-free single-page PDF via raw PDF syntax.
    const lines = [];
    lines.push("CRAVINGO — Order Invoice");
    lines.push(`Customer: ${invoice.customer}`);
    lines.push(`Date: ${invoice.date}`);
    lines.push("");
    invoice.items.forEach((c) => {
      lines.push(`${c.product.name} x${c.qty}  —  ${fmt(c.product.price * c.qty)}`);
    });
    lines.push("");
    lines.push(`Subtotal: ${fmt(invoice.subtotal)}`);
    if (invoice.bulkDiscount > 0) lines.push(`Buy 2 Get 1 Free: -${fmt(invoice.bulkDiscount)}`);
    if (invoice.rewardDiscount > 0) lines.push(`Reward Discount (15%): -${fmt(invoice.rewardDiscount)}`);
    lines.push(`Total: ${fmt(invoice.total)}`);
    lines.push("");
    lines.push("Thank you for shopping with Cravingo!");

    const escapeText = (t) => t.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
    const contentLines = lines
      .map((line, i) => `BT /F1 ${i === 0 ? 16 : 11} Tf 50 ${780 - i * 22} Td (${escapeText(line)}) Tj ET`)
      .join("\n");

    const streamContent = contentLines;
    const streamLength = streamContent.length;

    const pdf = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
5 0 obj
<< /Length ${streamLength} >>
stream
${streamContent}
endstream
endobj
xref
0 6
0000000000 65535 f 
trailer
<< /Size 6 /Root 1 0 R >>
%%EOF`;

    return pdf;
  }

  function initInvoiceDownloads() {
    document.getElementById("downloadPdf")?.addEventListener("click", () => {
      if (!lastInvoice) return;
      const pdfContent = buildInvoiceTextPDF(lastInvoice);
      downloadFile(`cravingo-invoice-${Date.now()}.pdf`, pdfContent, "application/pdf");
    });

    document.getElementById("downloadCsv")?.addEventListener("click", () => {
      if (!lastInvoice) return;
      const csvContent = buildInvoiceCSV(lastInvoice);
      downloadFile(`cravingo-invoice-${Date.now()}.csv`, csvContent, "text/csv");
    });

    document.getElementById("closeCheckout")?.addEventListener("click", () => {
      document.getElementById("checkoutOverlay").classList.remove("show");
    });
    document.getElementById("checkoutOverlay")?.addEventListener("click", (e) => {
      if (e.target.id === "checkoutOverlay") e.currentTarget.classList.remove("show");
    });
  }

  /* ---------------------------------------------------
     14. INIT
  --------------------------------------------------- */
  function init() {
    document.getElementById("year") && (document.getElementById("year").textContent = new Date().getFullYear());

    initLoader();
    initTheme();
    initNavbar();
    initMobileMenu();
    initSearch();
    initScrollReveal();
    initCounters();
    initNutritionRings();

    renderProducts();
    initFilters();
    initQuickView();

    initWishlistDrawer();
    updateWishlistUI();

    initCartDrawer();
    updateCartUI();

    initAuthTabs();
    initAuthForms();
    updateAuthUI();

    initTestimonialSlider();
    initMiscForms();
    initInfoModal();
    initInvoiceDownloads();

    // Escape key closes any open overlay/drawer/modal
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      closeDrawers();
      $$(".modal-overlay.show").forEach((m) => m.classList.remove("show"));
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();


/* ==========================
   CRAVINGO INTEREST LEADS
========================== */

emailjs.init({
  publicKey: "0gHZSObUfMbp6ehhJ"
});

const interestBtn =
  document.getElementById("interestBtn");

if (interestBtn) {

  interestBtn.addEventListener("click", () => {

    const email =
      document.getElementById("interestEmail").value.trim();

    const message =
      document.getElementById("interestMessage");

    if (!email) {
      message.innerHTML =
        "❌ Please enter your email";
      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      message.innerHTML =
        "❌ Please enter a valid email";
      return;
    }

    interestBtn.disabled = true;
    interestBtn.innerText = "Submitting...";

    emailjs.send(
      "service_r7d8o77",
      "template_nkf0mki",
      {
        customer_email: email,
        brand_name: "Cravingo",
        submission_time:
          new Date().toLocaleString()
      }
    )
    console.log("EmailJS submission sent for:", email)
      .then(() => {

        message.innerHTML =
          "✅ Thank you! We'll notify you when Cravingo launches.";

        document.getElementById(
          "interestEmail"
        ).value = "";

        interestBtn.disabled = false;
        interestBtn.innerText =
          "I'm Interested";
      })
      .catch((error) => {

        console.error(error);

        message.innerHTML =
          "❌ Something went wrong. Please try again.";

        interestBtn.disabled = false;
        interestBtn.innerText =
          "I'm Interested";
      });

  });

}