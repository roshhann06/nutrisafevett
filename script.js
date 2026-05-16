/* ============================================================
   script.js — NutriSafe Vet  (fully revised)
   ============================================================ */

/* ── NAV HAMBURGER ── */
const hamburger = document.getElementById("hamburger");
const navLinks  = document.getElementById("navLinks");

if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
  });
  document.querySelectorAll(".nav-links li a").forEach(n =>
    n.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navLinks.classList.remove("active");
    })
  );
}

/* ── SCROLL ANIMATIONS (reveal-section, fade-up) ── */
document.addEventListener("DOMContentLoaded", () => {

  /* Generic reveal observer */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("active"); });
  }, { threshold: 0.1 });

  document.querySelectorAll(".reveal-section, .reveal").forEach(el => revealObs.observe(el));

  /* Parallax watermark (index only) */
  const watermark = document.querySelector(".bg-watermark");
  if (watermark) {
    window.addEventListener("scroll", () => {
      watermark.style.transform = `translateX(-50%) translateY(${window.pageYOffset * 0.1}px)`;
    });
  }

  /* Parallax hero bg image */
  window.addEventListener("scroll", () => {
    const parallax = document.querySelector(".parallax-img");
    if (parallax) parallax.style.transform = `translateY(${window.pageYOffset * 0.1}px)`;
  });

  /* About-hero reveal */
  const hero = document.querySelector(".about-hero-section");
  if (hero) setTimeout(() => hero.classList.add("reveal-active"), 100);

  /* Contact form */
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fd   = new FormData(form);
      const data = {
        firstName : fd.get("firstName"),
        lastName  : fd.get("lastName"),
        email     : fd.get("email"),
        subject   : fd.get("subject"),
        message   : fd.get("message"),
      };
      try {
        await fetch(
          "https://script.google.com/macros/s/AKfycbxzyarzXfGGFcL69Q-ZjKXWdPUZ-3Y4KO_lHJ-9tczjiddn0mGHAtrvGq41TJRfJsltng/exec",
          { method: "POST", body: JSON.stringify(data) }
        );
        alert("Message sent successfully");
        form.reset();
      } catch {
        alert("Error sending message");
      }
    });
  }

  /* Boot product pages */
  initIndex();
  initDetail();
});

/* ============================================================
   PRODUCT DATA
   Each product has a GLOBALLY UNIQUE id (string).
   Fields: advantages | dosageLiquid | dosagePowder | packing
   Leave a field as "" if it does not apply to that product.
   ============================================================ */

const SHEET_API_URL = "YOUR_GOOGLE_SHEET_API_URL";

const SAMPLE_PRODUCTS = [

  /* ══════════════ POULTRY ══════════════ */

  {
    "id": "P1",
    "name": "NS VIT AD3",
    "category": "Poultry",
    "image": "https://i.postimg.cc/vZdpHC91/10.png",
    "shortDescription": "Multivitamin to optimize animal growth",
    "fullDescription": "Removes stress including heat, vaccination, debeaking, transportation, and production stress.",
    "advantages": "Reduces stress • Supports growth • Improves productivity",
    "dosageLiquid": "Chicks: 5 ml/100 birds | Grower: 7 ml/100 birds | Layer: 10 ml/100 birds",
    "dosagePowder": "",
    "packing": "500 ml | 1 lit"
  },
  {
    "id": "P2",
    "name": "NUTRI GTH ULTRA",
    "category": "Poultry",
    "image": "https://i.postimg.cc/YCfT48fg/11.png",
    "shortDescription": "Vitamins, amino acids & biotin blend",
    "fullDescription": "Supports growth, immunity, and improves FCR, fertility, and hatchability.",
    "advantages": "Improves growth • Boosts immunity • Enhances FCR",
    "dosageLiquid": "Layers: 2 ml/lit for 7–10 days | Broilers: 1 ml/lit for 5–7 days",
    "dosagePowder": "",
    "packing": "1 lit | 5 lit"
  },
  {
    "id": "P3",
    "name": "NUTRI CURCUMIN PLUS",
    "category": "Poultry",
    "image": "https://i.postimg.cc/K8ydvCLv/8.png",
    "shortDescription": "Turmeric-based growth enhancer",
    "fullDescription": "Blend of turmeric, essential oils, and vitamins to improve digestion, detoxification, and growth.",
    "advantages": "Improves digestion • Boosts immunity • Enhances FCR • Reduces stress",
    "dosageLiquid": "",
    "dosagePowder": "Broiler/Layer: 500 gm–1 kg/ton | Winter: 750 gm–1 kg/ton | Breeder: 1 kg/ton",
    "packing": "25 kg drum"
  },
  {
    "id": "P4",
    "name": "NUTRI ACI PLUS",
    "category": "Poultry",
    "image": "https://i.postimg.cc/y8zwY29B/7.png",
    "shortDescription": "Organic acid blend",
    "fullDescription": "Improves gut health and controls harmful pathogens.",
    "advantages": "Controls pathogens • Improves feed quality • Balances pH",
    "dosageLiquid": "",
    "dosagePowder": "1 kg per ton",
    "packing": "1 lit | 5 lit | 25 kg"
  },
  {
    "id": "P5",
    "name": "NS CRD",
    "category": "Poultry",
    "image": "https://i.postimg.cc/Qx72DjBx/6.png",
    "shortDescription": "Respiratory infection support",
    "fullDescription": "Controls infection, speeds recovery, and reduces mortality.",
    "advantages": "Reduces mortality • Improves performance • Faster recovery",
    "dosageLiquid": "10 ml/100 kg body weight (twice daily for control, once for prevention)",
    "dosagePowder": "",
    "packing": "500 ml | 1 lit | 25 kg"
  },
  {
    "id": "P6",
    "name": "NUTRI GUTCARE PLUS",
    "category": "Poultry",
    "image": "https://i.postimg.cc/fyGf5nZ7/19.png",
    "shortDescription": "Gut health enhancer",
    "fullDescription": "Improves digestion and controls harmful gut bacteria.",
    "advantages": "Improves digestion • Boosts immunity • Reduces infections",
    "dosageLiquid": "1–2 ml per litre",
    "dosagePowder": "",
    "packing": "1 lit"
  },
  {
    "id": "P7",
    "name": "NUTRI GUTCARE PLUS (Powder)",
    "category": "Poultry",
    "image": "p7.jpg",
    "shortDescription": "Gut health powder supplement",
    "fullDescription": "Controls bacteria, improves enzyme activity and fat metabolism.",
    "advantages": "Controls bacteria • Improves metabolism • Enhances growth",
    "dosageLiquid": "",
    "dosagePowder": "500 gm–1 kg per ton",
    "packing": "25 kg"
  },
  {
    "id": "P8",
    "name": "NS LIV CARE",
    "category": "Poultry",
    "image": "https://i.postimg.cc/PfCG6WTr/21.png",
    "shortDescription": "Advanced liver tonic",
    "fullDescription": "Supports liver health, detoxification, and improves digestion.",
    "advantages": "Protects liver • Improves digestion • Enhances performance",
    "dosageLiquid": "Broilers: 10 ml/100 birds | Layers: weekly | Breeders: 30 ml/100 birds",
    "dosagePowder": "1–1.5 kg per ton",
    "packing": "1 lit | 5 lit | 30 lit | 25 kg"
  },
  {
    "id": "P9",
    "name": "MINT-C PLUS",
    "category": "Poultry",
    "image": "https://i.postimg.cc/PqX91Z2S/13.png",
    "shortDescription": "Vitamin C supplement",
    "fullDescription": "Improves immunity, reduces stress, and maintains electrolyte balance.",
    "advantages": "Boosts immunity • Reduces stress • Improves livability",
    "dosageLiquid": "50 ml per 1000 birds",
    "dosagePowder": "200–300 gm per ton",
    "packing": "1 lit | 5 lit | 25 kg"
  },
  {
    "id": "P10",
    "name": "NUTRI-GARLIC",
    "category": "Poultry",
    "image": "p10.jpg",
    "shortDescription": "Natural growth promoter",
    "fullDescription": "Improves immunity, feed intake, and production performance.",
    "advantages": "Boosts immunity • Improves weight gain • Enhances egg production",
    "dosageLiquid": "",
    "dosagePowder": "200 gm per ton",
    "packing": "5 kg"
  },
  {
    "id": "P11",
    "name": "NUTRI PREMIX",
    "category": "Poultry",
    "image": "p11.jpg",
    "shortDescription": "Vitamin premix",
    "fullDescription": "Improves growth, immunity, and egg shell quality.",
    "advantages": "Improves feed efficiency • Boosts immunity • Enhances egg quality",
    "dosageLiquid": "",
    "dosagePowder": "250 gm per ton",
    "packing": "25 kg"
  },
  {
    "id": "P12",
    "name": "NUTRIPLEX",
    "category": "Poultry",
    "image": "p12.jpg",
    "shortDescription": "Vitamin B complex with amino acids",
    "fullDescription": "Improves immunity, vitality, and organ protection.",
    "advantages": "Boosts immunity • Enhances performance",
    "dosageLiquid": "",
    "dosagePowder": "",
    "packing": ""
  },
  {
    "id": "P13",
    "name": "NS CAL - P",
    "category": "Poultry",
    "image": "https://i.postimg.cc/rF4BTqD3/4.png",
    "shortDescription": "Calcium-phosphorus supplement",
    "fullDescription": "Supports bone strength and egg shell quality.",
    "advantages": "Improves shell quality • Prevents weakness",
    "dosageLiquid": "Chicks: 15–20 ml | Growers: 20–30 ml | Layers: 40–50 ml per 100 birds",
    "dosagePowder": "",
    "packing": "1 lit | 5 lit"
  },
  {
    "id": "P14",
    "name": "NS CAL GRANULES",
    "category": "Poultry",
    "image": "p14.jpg",
    "shortDescription": "Calcium granules",
    "fullDescription": "Enhances bone formation and prevents egg breakage.",
    "advantages": "Improves bone health • Reduces egg breakage",
    "dosageLiquid": "",
    "dosagePowder": "1 kg per ton",
    "packing": "25 kg"
  },
  {
    "id": "P15",
    "name": "Nutri Secure",
    "category": "Poultry",
    "image": "p15.jpg",
    "shortDescription": "Liquid disinfectant",
    "fullDescription": "Broad-spectrum disinfectant effective in organic matter.",
    "advantages": "Non-toxic • Effective disinfection • Multi-purpose",
    "dosageLiquid": "4–5 ml/lit (hatchers) | 2 ml/3 lit (fogging) | 4 lit/10 lit water",
    "dosagePowder": "",
    "packing": "1 lit | 5 lit"
  },
  {
    "id": "P16",
    "name": "Nutri Secure Powder",
    "category": "Poultry",
    "image": "p16.jpg",
    "shortDescription": "Powder disinfectant",
    "fullDescription": "Effective for surface and water disinfection.",
    "advantages": "Works in outbreaks • Non-toxic • Effective in organic matter",
    "dosageLiquid": "5 gm/lit spray | 50 gm/lit fogging | 1 gm/10 lit tank",
    "dosagePowder": "1 gm per lit (outbreak)",
    "packing": "1 kg | 2.5 kg"
  },

  {
  "id": "P17",
  "name": "Impunity",
  "category": "Poultry",
  "image": "",
  "shortDescription": "Immunity enhancer for poultry",
  "fullDescription": "Enhances immunity and disease resistance, reduces mortality during viral outbreaks, controls inflammation, protects vital organs, and improves vaccine and antibiotic response.",
  "advantages": "Reduces mortality • Boosts immunity • Controls inflammation • Protects vital organs • Improves vaccine response",
  "dosageLiquid": "Chicks: 5–10 ml per 100 birds | Growers: 7.5–15 ml per 100 birds | Layers: 10–20 ml per 100 birds",
  "dosagePowder": "250–500 gm per ton of feed",
  "packing": "25 kg drum"
},

  /* ══════════════ Dog (category "Dog" kept for filter compat) ══════════════ */
  {
    "id": "C1",
    "name": "NS Rumino Plus",
    "category": "Dog",
    "image": "https://i.postimg.cc/wxZCn1j2/2.png",
    "shortDescription": "Rumenotoric for ketosis management",
    "fullDescription": "Helps in ketosis management by controlling fatty acid release, improving energy output, maintaining rumen pH, and providing essential nutrients.",
    "advantages": "Supports ketosis control • Improves energy output • Maintains rumen pH • Provides vitamins & amino acids",
    "dosageLiquid": "",
    "dosagePowder": "Large animals: 2 bolus twice daily",
    "packing": "4 bolus x 30 strips"
  },
  {
    "id": "C2",
    "name": "NS Hepacarex",
    "category": "Dog",
    "image": "https://i.postimg.cc/DyG9h7Sg/3.png",
    "shortDescription": "Liver tonic with yeast extracts",
    "fullDescription": "Supports appetite, digestion, and liver health. Useful in fatty liver syndrome and post-deworming recovery.",
    "advantages": "Improves appetite • Supports liver function • Aids digestion • Promotes growth",
    "dosageLiquid": "Large animals: 40 ml daily for 5 days | Small animals: 20 ml daily",
    "dosagePowder": "",
    "packing": "200 ml | 500 ml"
  },
  {
    "id": "C3",
    "name": "NS Farticare",
    "category": "Dog",
    "image": "",
    "shortDescription": "Mineral deficiency support",
    "fullDescription": "Helps improve fertility, enhances conception rate, and supports uterine recovery.",
    "advantages": "Improves heat cycle • Enhances conception • Supports uterine health",
    "dosageLiquid": "",
    "dosagePowder": "1 bolus daily for 20 days",
    "packing": "4 bolus strip x 5"
  },
  {
    "id": "C4",
    "name": "NS VIT - H",
    "category": "Dog",
    "image": "https://i.postimg.cc/vZdpHC91/10.png",
    "shortDescription": "Stress and productivity support",
    "fullDescription": "Reduces stress, improves immunity, enhances milk production, and supports udder health.",
    "advantages": "Reduces heat stress • Boosts immunity • Improves milk yield • Supports udder health",
    "dosageLiquid": "Large animals: 10 ml daily | Small animals: 5 ml daily",
    "dosagePowder": "",
    "packing": "100 ml | 250 ml | 500 ml | 1 lit"
  },
  {
    "id": "C5",
    "name": "Ns Cal",
    "category": "Dog",
    "image": "https://i.postimg.cc/x1yBkgy6/12.png",
    "shortDescription": "Calcium and mineral supplement",
    "fullDescription": "Highly bioavailable calcium supplement that supports immunity, udder health, and prevents lameness.",
    "advantages": "Improves calcium levels • Enhances immunity • Prevents lameness • Improves milk yield",
    "dosageLiquid": "Cattle: 100 ml daily | Calves: 20 ml daily | Goat: 20 ml daily",
    "dosagePowder": "",
    "packing": "1 lit | 2 lit | 5 lit | 20 lit"
  },
  {
    "id": "C6",
    "name": "Nutri A 2 Z",
    "category": "Dog",
    "image": "https://i.postimg.cc/R0SywfX8/14.png",
    "shortDescription": "Production rejuvenator",
    "fullDescription": "Improves feed intake, enhances mineral absorption, and supports reproductive health in high-yield animals.",
    "advantages": "Boosts feed intake • Improves mineral absorption • Reduces mastitis risk • Supports fertility",
    "dosageLiquid": "",
    "dosagePowder": "Large animals: 30 gm daily mixed in feed",
    "packing": "1 kg | 5 kg | 25 kg"
  },
  {
    "id": "C7",
    "name": "NS Milkplus",
    "category": "Dog",
    "image": "",
    "shortDescription": "Milk production enhancer",
    "fullDescription": "Improves secretion of milk hormones and stimulates udder cells for better milk production and let-down.",
    "advantages": "Improves milk yield • Enhances hormone secretion • Supports udder function",
    "dosageLiquid": "Large animals: 25 ml daily for 10 days",
    "dosagePowder": "",
    "packing": "250 ml | 500 ml"
  },
  {
    "id": "C8",
    "name": "NUTRI COW",
    "category": "Dog",
    "image": "",
    "shortDescription": "Metabolic energy supplement",
    "fullDescription": "Helps manage ketosis and improves recovery and milk production.",
    "advantages": "Boosts energy • Improves recovery • Supports production",
    "dosageLiquid": "100–200 ml daily",
    "dosagePowder": "",
    "packing": "500 ml | 1 lit"
  },
  {
    "id": "C9",
    "name": "Nutri Gutcare Plus",
    "category": "Dog",
    "image": "",
    "shortDescription": "Gut health supplement",
    "fullDescription": "Supports digestion, stabilizes gut microbiota, and reduces GI disorders.",
    "advantages": "Improves digestion • Reduces infections • Supports gut health",
    "dosageLiquid": "",
    "dosagePowder": "50 gm twice daily for 5 days",
    "packing": "250 gm | 1 kg"
  },
  {
    "id": "C10",
    "name": "NS CAL GEL",
    "category": "Dog",
    "image": "",
    "shortDescription": "Calcium gel supplement",
    "fullDescription": "Prevents calcium deficiency and supports recovery and delivery.",
    "advantages": "Supports calcium balance • Improves recovery",
    "dosageLiquid": "300 gm daily",
    "dosagePowder": "",
    "packing": "300 gm"
  },
  {
    "id": "C11",
    "name": "NS CAL GRANULES",
    "category": "Dog",
    "image": "",
    "shortDescription": "Calcium granules supplement",
    "fullDescription": "Improves bone strength, fertility, and prevents metabolic disorders.",
    "advantages": "Strengthens bones • Boosts immunity • Improves fertility",
    "dosageLiquid": "",
    "dosagePowder": "50 gm twice daily for 5–7 days",
    "packing": "500 gm | 1 kg | 5 kg | 25 kg"
  },
  

  /* ══════════════ SWINE ══════════════ */
  {
    "id": "S1",
    "name": "NS Liv Swine",
    "category": "Swine",
    "image": "",
    "shortDescription": "Improves growth, weight gain and FCR",
    "fullDescription": "Special preparation for pigs to stimulate and improve liver function. Helps correct liver disorders, improves feed intake and digestion. Recommended in poor growth and low body weight conditions.",
    "advantages": "Improves liver function • Enhances feed intake & digestion • Supports growth & weight gain • Improves FCR",
    "dosageLiquid": "Piglets: 5–10 ml per animal for 10 days | Adults: 30–50 ml per animal for 10 days",
    "dosagePowder": "1.5–2 kg per ton of feed",
    "packing": "1 lit | 5 lit | 5 kg | 25 kg"
  },
  {
    "id": "S2",
    "name": "NS Gutcare Swine",
    "category": "Swine",
    "image": "https://i.postimg.cc/PfCG6WTr/21.png",
    "shortDescription": "Improves digestion and gut health",
    "fullDescription": "Enhances gut health, improves digestion and absorption, and controls feed passage. Supports immunity and reduces stress in swine.",
    "advantages": "Improves gut health • Enhances growth performance • Boosts immunity • Reduces heat stress • Lowers mortality • Improves FCR",
    "dosageLiquid": "Piglets: 7–10 ml per animal for 10 days | Adults: 40–50 ml per animal for 10 days",
    "dosagePowder": "1.5–2 kg per ton of feed",
    "packing": "5 lit | 25 kg"
  },

  /* ══════════════ AQUA ══════════════ */
  {
    "id": "A1",
    "name": "Nutri Secure Aqua",
    "category": "Aqua",
    "image": "",
    "shortDescription": "Potent disinfectant for aquaculture",
    "fullDescription": "Effective disinfectant for aquaculture systems, works in high organic load and various water sources. Controls vibriosis and common fish diseases without harming plankton.",
    "advantages": "Effective in all water types • Controls vibriosis • Safe for plankton • Reduces fish diseases",
    "dosageLiquid": "500 ml–1 lit per acre per meter water depth | Equipment: 250–500 ml in 50 lit water",
    "dosagePowder": "",
    "packing": "1 lit | 5 lit"
  },
  {
    "id": "A2",
    "name": "Nutri Cal Plus Aqua",
    "category": "Aqua",
    "image": "",
    "shortDescription": "Calcium supplement with high bioavailability",
    "fullDescription": "Provides calcium, phosphorus, magnesium, and manganese to improve bone strength, metabolism, and productivity in aquaculture.",
    "advantages": "Improves mineral absorption • Supports bone formation • Enhances productivity & hatchability",
    "dosageLiquid": "100 ml per kg of feed",
    "dosagePowder": "1 kg per ton of feed",
    "packing": "1 lit | 5 lit | 20 lit | 25 kg"
  },
  {
    "id": "A3",
    "name": "NS Liv Care Aqua",
    "category": "Aqua",
    "image": "",
    "shortDescription": "Liver support and growth enhancer",
    "fullDescription": "Stimulates liver function, improves digestion, boosts immunity, and enhances growth performance in fish.",
    "advantages": "Improves liver function • Enhances digestion • Boosts immunity • Improves growth",
    "dosageLiquid": "10–15 ml per kg of feed",
    "dosagePowder": "500 gm per ton of feed",
    "packing": "5 lit"
  },
  {
    "id": "A4",
    "name": "NS Gutcare Aqua",
    "category": "Aqua",
    "image": "",
    "shortDescription": "Gut microflora stabilizer",
    "fullDescription": "Restores gut balance, improves digestion, enhances immunity, and supports overall health in aquaculture.",
    "advantages": "Improves digestion • Strengthens immunity • Controls pathogens • Enhances gut health • Improves water quality",
    "dosageLiquid": "5–10 ml per kg of feed",
    "dosagePowder": "10–20 gm per kg of feed",
    "packing": "1 lit | 25 kg"
  },
];

/* ============================================================
   FETCH PRODUCTS
   ============================================================ */
async function fetchProducts() {
  if (SHEET_API_URL === "YOUR_GOOGLE_SHEET_API_URL") return SAMPLE_PRODUCTS;
  try {
    const res  = await fetch(SHEET_API_URL);
    if (!res.ok) throw new Error("Network error");
    const data = await res.json();
    return Array.isArray(data) ? data : (data.data || []);
  } catch (err) {
    console.warn("Sheet fetch failed, using sample data.", err);
    return SAMPLE_PRODUCTS;
  }
}

/* ============================================================
   PRODUCT LISTING PAGE  (product.html)
   ============================================================ */
function renderGrid(products) {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  if (!products.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" stroke="#2eac1e" stroke-width="2"/>
          <path d="M20 44L44 20M20 20L44 44" stroke="#2eac1e" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <p>No products found in this category.</p>
      </div>`;
    return;
  }

  grid.innerHTML = products.map((p, i) => `
    <div class="product-card" style="animation-delay:${i * 0.07}s">
      <div class="card-image-wrap">
        <img src="${p.image || 'https://via.placeholder.com/300x300/f9faf8/2eac1e?text=Product'}"
             alt="${p.name}" loading="lazy"
             onerror="this.src='https://via.placeholder.com/300x300/f9faf8/2eac1e?text=No+Image'">
      </div>
      <div class="card-body">
        <div class="card-name">${p.name}</div>
        <div class="card-desc">${p.shortDescription || ''}</div>
      </div>
      <div class="card-footer">
        <a class="btn-view" href="productdetails.html?id=${encodeURIComponent(p.id)}">View Product</a>
      </div>
    </div>
  `).join('');
}

let allProducts    = [];
let activeCategory = "All";

function applyFilter(category) {
  activeCategory = category;
  const filtered = category === "All"
    ? allProducts
    : allProducts.filter(p => p.category && p.category.trim() === category);
  renderGrid(filtered);
  document.querySelectorAll(".filter-btn").forEach(btn =>
    btn.classList.toggle("active", btn.dataset.cat === category)
  );
}

async function initIndex() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  grid.innerHTML = `<div class="loading-state"><div class="spinner"></div><p>Loading products…</p></div>`;
  allProducts = await fetchProducts();

  document.querySelectorAll(".filter-btn").forEach(btn =>
    btn.addEventListener("click", () => applyFilter(btn.dataset.cat))
  );
  applyFilter("All");
}

/* ============================================================
   PRODUCT DETAIL PAGE  (productdetails.html)
   ============================================================ */
async function initDetail() {
  const container = document.getElementById("detailContent");
  if (!container) return;

  const id = new URLSearchParams(window.location.search).get("id");
  if (!id) {
    container.innerHTML = `<p style="text-align:center;color:#e53935;padding:40px">Product ID missing.</p>`;
    return;
  }

  container.innerHTML = `<div class="loading-state"><div class="spinner"></div><p>Loading product…</p></div>`;

  const products = await fetchProducts();
  const product  = products.find(p => String(p.id) === String(id));

  if (!product) {
    container.innerHTML = `<p style="text-align:center;color:#e53935;padding:40px">Product not found.</p>`;
    return;
  }

  /* Advantages — bullet list */
  const advantagesHTML = product.advantages
    ? `<div class="detail-field">
         <div class="detail-label">Advantages</div>
         <ul class="detail-advantages">
           ${product.advantages.split("•").filter(Boolean).map(a => `<li>${a.trim()}</li>`).join("")}
         </ul>
       </div>`
    : "";

  /* Dosage section */
  const dosageHTML = (product.dosageLiquid || product.dosagePowder)
    ? `<div class="detail-field">
         <div class="detail-label"> Dosage</div>
         <div class="dosage-grid">
           ${product.dosageLiquid
              ? `<div class="dosage-block">
                   <span class="dosage-tag liquid">Liquid</span>
                   <p>${product.dosageLiquid}</p>
                 </div>`
              : ""}
           ${product.dosagePowder
              ? `<div class="dosage-block">
                   <span class="dosage-tag powder">Powder</span>
                   <p>${product.dosagePowder}</p>
                 </div>`
              : ""}
         </div>
       </div>`
    : "";

  /* Packing */
  const packingHTML = product.packing
    ? `<div class="detail-field packing-field">
         <div class="detail-label"> Packing</div>
         <div class="packing-tags">
           ${product.packing.split("|").map(pk => `<span class="packing-tag">${pk.trim()}</span>`).join("")}
         </div>
       </div>`
    : "";

  container.innerHTML = `
    <div class="detail-card">

      <div class="detail-image-col">
        <img src="${product.image || 'https://via.placeholder.com/400x400/f9faf8/2eac1e?text=No+Image'}"
             alt="${product.name}"
             onerror="this.src='https://via.placeholder.com/400x400/f9faf8/2eac1e?text=No+Image'">
      </div>

      <div class="detail-info-col">

        <span class="detail-category">${product.category || 'General'}</span>
        <h1 class="detail-name">${product.name}</h1>
        <p class="detail-short">${product.shortDescription || ''}</p>

        <hr class="detail-divider">

        ${product.fullDescription
          ? `<div class="detail-field">
               <div class="detail-label">Description</div>
               <p class="detail-full">${product.fullDescription}</p>
             </div>`
          : ""}

        ${advantagesHTML}

        <hr class="detail-divider">

        ${dosageHTML}
        ${packingHTML}

        <div class="detail-cta">
          <a href="https://wa.me/9064787595?text=Hello%20NutriSafe%2C%20I%20would%20like%20to%20inquire%20about%20${encodeURIComponent(product.name)}."
             class="btn-whatsapp" target="_blank">
            <i class="fa-brands fa-whatsapp"></i> Enquire on WhatsApp
          </a>
        </div>

      </div>
    </div>`;
}