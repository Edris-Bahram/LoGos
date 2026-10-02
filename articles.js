/* ==========================================================
   سیستم جستجوی مقالات
   جستجو بر اساس عنوان، دسته‌بندی، کلمات کلیدی و خلاصه
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const input = $("#q");
  const chipsEl = $("#chips");
  const results = $("#results");
  const count = $("#count");
  const params = new URLSearchParams(location.search);

  let activeCat = params.get("cat") || "";
  input.value = params.get("q") || "";

  /* دکمه‌های دسته‌بندی */
  const cats = ["", ...CATEGORIES.map((c) => c.name)];
  chipsEl.innerHTML = cats
    .map((c) => `<button class="chip" type="button" data-cat="${c}" aria-pressed="${c === activeCat}">${c || "همه"}</button>`)
    .join("");

  chipsEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    activeCat = btn.dataset.cat;
    $$(".chip", chipsEl).forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
    render();
  });

  input.addEventListener("input", render);

  function matches(a, q) {
    if (!q) return true;
    const hay = normalize([a.title, a.category, (a.keywords || []).join(" "), a.summary].join(" "));
    return q.split(/\s+/).every((word) => hay.includes(word));
  }

  function render() {
    const q = normalize(input.value.trim());
    const list = sortedArticles().filter((a) => (!activeCat || a.category === activeCat) && matches(a, q));

    if (list.length === 0) {
      results.innerHTML = "";
      count.textContent = ARTICLES.length
        ? "مقاله‌ای پیدا نشد. عبارت دیگری را امتحان کن یا فیلتر دسته‌بندی را بردار."
        : "هنوز مقاله‌ای منتشر نشده است.";
      return;
    }
    count.textContent = list.length.toLocaleString("fa-IR") + " مقاله";
    results.innerHTML = list.map(cardHTML).join("");
  }

  render();

  /* لینک «جستجو» در منو: مستقیم روی کادر جستجو می‌رود */
  if (location.hash === "#search") input.focus();
});
