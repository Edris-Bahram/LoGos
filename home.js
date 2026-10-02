/* ==========================================================
   صفحهٔ اصلی: چرخش جملات، اسلایدر مقالات، گالری فیلسوفان
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- چرخش جملات فیلسوفان (هر ۵ ثانیه) ---------- */
  const box = $("#quote");
  const textEl = $("#quote-text");
  const byEl = $("#quote-by");
  let qi = Math.floor(Math.random() * QUOTES.length);

  function showQuote() {
    textEl.textContent = "«" + QUOTES[qi].text + "»";
    byEl.textContent = QUOTES[qi].by;
  }
  showQuote();

  if (QUOTES.length > 1) {
    setInterval(() => {
      box.classList.add("is-out");
      setTimeout(() => {
        qi = (qi + 1) % QUOTES.length;
        showQuote();
        box.classList.remove("is-out");
      }, 600);
    }, 5000);
  }

  /* ---------- آخرین مقالات ---------- */
  const track = $("#latest-track");
  const latest = sortedArticles().slice(0, 4);
  if (latest.length === 0) {
    track.outerHTML = `<p class="empty">هنوز مقاله‌ای منتشر نشده است.</p>`;
    $(".slider-controls").hidden = true;
  } else {
    track.innerHTML = latest.map(cardHTML).join("");
    const step = () => {
      const card = track.querySelector(".card");
      return card ? card.getBoundingClientRect().width + 20 : 300;
    };
    // در حالت راست‌به‌چپ، جهت اسکرول معکوس است
    const dir = () => (getComputedStyle(track).direction === "rtl" ? -1 : 1);
    $("#slide-next").addEventListener("click", () => track.scrollBy({ left: dir() * step(), behavior: "smooth" }));
    $("#slide-prev").addEventListener("click", () => track.scrollBy({ left: -dir() * step(), behavior: "smooth" }));
  }

  /* ---------- گالری فیلسوفان ---------- */
  $("#gallery").innerHTML = PHILOSOPHERS.map((p) => {
    const inner = p.image
      ? `<img src="${p.image}" alt="${p.name}" loading="lazy">`
      : `<span class="phil-initial" aria-hidden="true">${p.name.charAt(0)}</span>`;
    return `<div class="phil" tabindex="0" role="img" aria-label="${p.name}">${inner}<span class="name">${p.name}</span></div>`;
  }).join("");
});
