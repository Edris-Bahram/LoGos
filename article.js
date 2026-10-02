/* ==========================================================
   صفحهٔ مقاله: هدر، متن، فرم نظرات، مقالات مرتبط
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const root = $("#article");
  const id = new URLSearchParams(location.search).get("id");
  const a = ARTICLES.find((x) => x.id === id);

  if (!a) {
    root.innerHTML = `
      <h1>مقاله پیدا نشد</h1>
      <p class="empty" style="margin-top:1.5rem">این آدرس به مقاله‌ای وصل نیست. از فهرست مقالات یکی را انتخاب کن.</p>
      <p style="margin-top:1.5rem"><a class="btn" href="articles.html">دیدن همهٔ مقالات</a></p>`;
    document.title = "مقاله پیدا نشد | LoGoS";
    return;
  }

  document.title = a.title + " | LoGoS";

  const authorName = a.author || SITE.author.name;
  const authorImg = a.authorImage || SITE.author.image;
  const words = a.content.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 180)).toLocaleString("fa-IR");
  const color = catColor(a.category);

  root.innerHTML = `
    <header>
      <div class="byline">
        <span class="avatar" id="avatar"><img src="${authorImg}" alt="${authorName}"></span>
        <div>
          <strong>${authorName}</strong>
          <small><time datetime="${a.date}">${fmtDate(a.date)}</time> — ${minutes} دقیقه مطالعه</small>
        </div>
      </div>
      <span class="tag" style="--cat:${color}"><i class="dot"></i>${a.category}</span>
      <h1>${a.title}</h1>
    </header>

    <div class="article-body">${a.content}</div>

    <section class="comments" aria-labelledby="comments-title">
      <h2 id="comments-title">نظر یا پیشنهادت را بنویس</h2>
      <p class="lead">پیام تو مستقیم به ایمیل نویسنده می‌رسد و در سایت نمایش داده نمی‌شود.</p>
      <form id="comment-form" novalidate>
        <input class="honey" type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true">
        <label>نام
          <input type="text" name="name" required autocomplete="name">
        </label>
        <label>ایمیل (اختیاری)
          <input type="email" name="email" autocomplete="email" dir="ltr">
        </label>
        <label>پیام
          <textarea name="message" required></textarea>
        </label>
        <div><button class="btn" type="submit">ارسال پیام</button></div>
      </form>
      <div id="form-msg" role="status"></div>
    </section>`;

  /* اگر عکس نویسنده پیدا نشد، حرف اول نام نمایش داده شود */
  const img = $("#avatar img");
  const fallback = () => ($("#avatar").textContent = authorName.charAt(0));
  img.addEventListener("error", fallback, { once: true });
  if (img.complete && img.naturalWidth === 0) fallback();

  /* ---------- ارسال نظر به ایمیل (بدون نیاز به بک‌اند، با FormSubmit) ---------- */
  const form = $("#comment-form");
  const msg = $("#form-msg");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    if (!data.get("name").trim() || !data.get("message").trim()) {
      msg.innerHTML = `<p class="form-msg err">نام و پیام را پر کن، بعد دوباره بفرست.</p>`;
      return;
    }
    const btn = form.querySelector("button");
    btn.disabled = true;
    try {
      const res = await fetch("https://formsubmit.co/ajax/" + encodeURIComponent(SITE.email), {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: "نظر جدید دربارهٔ مقالهٔ «" + a.title + "»",
          _captcha: "false",
          _honey: data.get("_honey"),
          مقاله: a.title,
          نام: data.get("name"),
          ایمیل: data.get("email"),
          پیام: data.get("message"),
        }),
      });
      if (!res.ok) throw new Error("bad response");
      form.reset();
      msg.innerHTML = `<p class="form-msg ok">پیامت ارسال شد. ممنون که نوشتی.</p>`;
    } catch (err) {
      msg.innerHTML = `<p class="form-msg err">ارسال نشد. اتصال اینترنت را بررسی کن و دوباره بفرست.</p>`;
    } finally {
      btn.disabled = false;
    }
  });

  /* ---------- مقالات مرتبط (همین دسته‌بندی) ---------- */
  const related = sortedArticles().filter((x) => x.id !== a.id && x.category === a.category).slice(0, 3);
  if (related.length) {
    $("#related-grid").innerHTML = related.map(cardHTML).join("");
    $("#related").hidden = false;
  }
});
