/* ==========================================================
   LoGoS — کدهای مشترک همهٔ صفحه‌ها
   (تم تاریک/روشن، نوار ناوبری، فوتر، ستاره‌ها، کارت مقاله)
   ========================================================== */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* ---------- ابزارها ---------- */
function normalize(s) {
  return (s || "")
    .toString()
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[\u064B-\u065F\u200c]/g, "")
    .toLowerCase();
}

function fmtDate(d) {
  const date = new Date(d);
  if (isNaN(date)) return "";
  return date.toLocaleDateString("fa-IR", { year: "numeric", month: "long", day: "numeric" });
}

function catColor(name) {
  const c = CATEGORIES.find((x) => x.name === name);
  return c ? c.color : "#D4AF37";
}

function sortedArticles() {
  return [...ARTICLES].sort((a, b) => new Date(b.date) - new Date(a.date));
}

function articleUrl(a) {
  return "article.html?id=" + encodeURIComponent(a.id);
}

/* ---------- لوگو و فروهر ---------- */
const FARVAHAR = (() => {
  const wing = `
    <path d="M120 50 C142 44 164 38 192 26"/>
    <path d="M120 56 C144 52 164 47 186 38"/>
    <path d="M120 62 C142 60 160 57 178 50"/>
    <path d="M120 68 C138 67 152 65 166 61"/>
    <path d="M140 46 l2 -8 M152 43 l2 -9 M165 38 l3 -9 M178 31 l3 -8" stroke-width="1.2"/>`;
  return `<svg viewBox="0 0 200 130" fill="none" stroke="currentColor" stroke-width="2"
    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <circle cx="100" cy="52" r="17"/><circle cx="100" cy="52" r="11" stroke-width="1.2"/>
    <circle cx="100" cy="30" r="6"/><path d="M100 36 V41"/>
    <g>${wing}</g><g transform="translate(200 0) scale(-1 1)">${wing}</g>
    <path d="M100 69 V76 M100 76 L82 108 M100 76 V112 M100 76 L118 108"/>
    <path d="M92 66 C78 78 70 84 60 98 M108 66 C122 78 130 84 140 98"/>
  </svg>`;
})();

function logoHTML() {
  return `<span class="logo-wrap"><img class="logo-img" src="assets/logo.png" alt="لوگوی LoGoS"></span>`;
}

function fillLogos(root = document) {
  $$("[data-logo]", root).forEach((el) => (el.innerHTML = logoHTML()));
  $$("img.logo-img", root).forEach((img) => {
    const fallback = () => {
      const span = document.createElement("span");
      span.className = "logo-fallback";
      span.innerHTML = FARVAHAR;
      img.replaceWith(span);
    };
    img.addEventListener("error", fallback, { once: true });
    if (img.complete && img.naturalWidth === 0) fallback();
  });
}

/* ---------- کارت مقاله ---------- */
function cardHTML(a) {
  const color = catColor(a.category);
  const media = a.image
    ? `<img src="${a.image}" alt="" loading="lazy">`
    : `<span class="card-glyph en" aria-hidden="true">Λ</span>`;
  return `
    <article class="card" style="--cat:${color}">
      <a class="card-link" href="${articleUrl(a)}">
        <div class="card-media">${media}</div>
        <div class="card-body">
          <span class="tag"><i class="dot"></i>${a.category}</span>
          <h3>${a.title}</h3>
          <p>${a.summary || ""}</p>
          <time datetime="${a.date}">${fmtDate(a.date)}</time>
        </div>
      </a>
    </article>`;
}

/* ---------- تم تاریک/روشن ---------- */
function setTheme(mode) {
  document.documentElement.dataset.theme = mode;
  localStorage.setItem("logos-theme", mode);
  const icon = $("#theme-toggle i");
  if (icon) icon.className = mode === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
  const btn = $("#theme-toggle");
  if (btn) btn.setAttribute("aria-label", mode === "dark" ? "تغییر به حالت روشن" : "تغییر به حالت تاریک");
}

/* ---------- نوار ناوبری ---------- */
function renderNav() {
  const host = $("#site-nav");
  if (!host) return;
  const page = document.body.dataset.page;
  const items = [
    { key: "home", label: "خانه", href: "index.html" },
    { key: "articles", label: "مقالات", href: "articles.html" },
    { key: "about", label: "درباره", href: "about.html" },
    { key: "search", label: "جستجو", href: "articles.html#search" },
  ];
  const links = items
    .map((i) => `<a href="${i.href}" ${i.key === page ? 'aria-current="page"' : ""}>${i.label}</a>`)
    .join("");
  host.innerHTML = `
    <header class="nav">
      <div class="nav-inner">
        <a class="brand" href="index.html" aria-label="LoGoS — صفحهٔ اصلی">
          <span class="brand-logo" data-logo></span><span class="en">LoGoS</span>
        </a>
        <nav id="nav-links" aria-label="منوی اصلی">${links}</nav>
        <div class="nav-tools">
          <button id="theme-toggle" class="icon-btn" type="button"><i class="fa-solid fa-sun"></i></button>
          <button id="nav-toggle" class="icon-btn nav-toggle" type="button" aria-expanded="false" aria-controls="nav-links" aria-label="باز کردن منو">
            <i class="fa-solid fa-bars"></i>
          </button>
        </div>
      </div>
    </header>`;

  $("#theme-toggle").addEventListener("click", () => {
    setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
  });
  const toggle = $("#nav-toggle");
  toggle.addEventListener("click", () => {
    const open = $("#nav-links").classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  setTheme(document.documentElement.dataset.theme || "dark");
}

/* ---------- فوتر ---------- */
function renderFooter() {
  const host = $("#site-footer");
  if (!host) return;
  const socials = SITE.socials
    .map((s) => {
      const url = s.url || (s.label === "Email" ? "mailto:" + SITE.email : "#");
      return `<a href="${url}" aria-label="${s.label}" target="_blank" rel="noopener"><i class="${s.icon}"></i></a>`;
    })
    .join("");
  const links = SITE.footerLinks.map((l) => `<a href="${l.url}">${l.label}</a>`).join("");
  host.innerHTML = `
    <footer class="footer">
      <div class="footer-farvahar" aria-hidden="true">${FARVAHAR}</div>
      <div class="footer-inner">
        <div class="footer-brand"><span class="brand-logo" data-logo></span><span class="en">LoGoS</span></div>
        <nav class="footer-links" aria-label="پیوندهای فوتر">${links}</nav>
        <div class="socials">${socials}</div>
        <p class="copy en" dir="ltr">Created by Edris © 2026</p>
      </div>
    </footer>`;
}

/* ---------- ستاره‌های پس‌زمینه ---------- */
function initStars() {
  const canvas = document.createElement("canvas");
  canvas.id = "stars";
  canvas.setAttribute("aria-hidden", "true");
  document.body.prepend(canvas);
  const ctx = canvas.getContext("2d");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let w, h, stars;

  function build() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.width = innerWidth * dpr;
    h = canvas.height = innerHeight * dpr;
    const count = Math.round((innerWidth * innerHeight) / 9000);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: (Math.random() * 1.1 + 0.3) * dpr,
      a: Math.random() * 0.6 + 0.25,
      s: Math.random() * 1.6 + 0.4,
      p: Math.random() * 6.28,
      gold: Math.random() < 0.18,
    }));
  }

  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    if (document.documentElement.dataset.theme !== "light") {
      for (const st of stars) {
        const tw = reduce ? 1 : 0.65 + 0.35 * Math.sin(t / 1000 * st.s + st.p);
        ctx.globalAlpha = st.a * tw;
        ctx.fillStyle = st.gold ? "#D4AF37" : "#F5F5F5";
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.r, 0, 6.283);
        ctx.fill();
      }
    }
    if (!reduce) requestAnimationFrame(draw);
  }

  build();
  draw(0);
  addEventListener("resize", () => { build(); if (reduce) draw(0); });
  if (reduce) new MutationObserver(() => draw(0)).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
}

/* ---------- شروع ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderNav();
  renderFooter();
  fillLogos();
  initStars();
});
