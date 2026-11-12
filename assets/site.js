/* The Gothic Folly: shared behaviour (menu, lightbox, press filters, copy, Folly Mix demo) */
(function () {
  "use strict";

  /* Mobile menu: a class on <html> opens it; CSS hides it by default on phones */
  var menuBtn = document.querySelector(".menu-btn");
  var root = document.documentElement;
  if (menuBtn) {
    var mq = window.matchMedia("(max-width: 920px)");
    function setOpen(open) {
      root.classList.toggle("menu-open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.setAttribute("aria-label", open ? "Close menu" : "Menu");
    }
    menuBtn.addEventListener("click", function () { setOpen(!root.classList.contains("menu-open")); });
    document.getElementById("nav-links").addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && root.classList.contains("menu-open")) { setOpen(false); menuBtn.focus(); } });
    function onChange() { if (!mq.matches) setOpen(false); }
    if (mq.addEventListener) mq.addEventListener("change", onChange); else if (mq.addListener) mq.addListener(onChange);
    window.addEventListener("pageshow", function () { setOpen(false); });
  }

  /* Light / dark toggle: dark is the default; the choice is remembered on this device */
  var modeBtn = document.querySelector(".mode-btn");
  if (modeBtn) {
    function syncMode() {
      var light = root.getAttribute("data-mode") === "light";
      modeBtn.setAttribute("aria-label", light ? "Switch to dark mode" : "Switch to light mode");
      var tc = document.querySelector('meta[name="theme-color"]'); if (tc) tc.setAttribute("content", light ? "#F4F2EE" : "#0A0B12");
    }
    modeBtn.addEventListener("click", function () {
      var light = root.getAttribute("data-mode") !== "light";
      if (light) root.setAttribute("data-mode", "light"); else root.removeAttribute("data-mode");
      try { localStorage.setItem("tgf-mode", light ? "light" : "dark"); } catch (e) {}
      syncMode();
    });
    syncMode();
  }

  /* Lightbox for [data-lightbox] galleries */
  var items = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox] button"));
  if (items.length) {
    var lb = document.createElement("div");
    lb.className = "lightbox"; lb.hidden = true; lb.setAttribute("role", "dialog"); lb.setAttribute("aria-modal", "true"); lb.setAttribute("aria-label", "Photo viewer");
    lb.innerHTML = '<button class="lb-close" type="button" aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
      '<button class="lb-nav lb-prev" type="button" aria-label="Previous photo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg></button>' +
      '<img alt=""><video controls muted loop playsinline hidden></video><p></p>' +
      '<button class="lb-nav lb-next" type="button" aria-label="Next photo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg></button>';
    document.body.appendChild(lb);
    var img = lb.querySelector("img"), vid = lb.querySelector("video"), cap = lb.querySelector("p"), idx = 0, last = null;
    function show(i) {
      idx = (i + items.length) % items.length;
      var b = items[idx], v = b.getAttribute("data-video");
      if (v) {
        img.hidden = true; img.removeAttribute("src");
        vid.hidden = false; vid.src = v; vid.setAttribute("aria-label", b.getAttribute("aria-label").replace(/^Play video: /, ""));
        var pv = b.querySelector("video"); if (pv && pv.poster) vid.poster = pv.poster;
        try { var pr = vid.play(); if (pr && pr.catch) pr.catch(function () {}); } catch (e) {}
      } else {
        vid.pause(); vid.hidden = true; vid.removeAttribute("src");
        var src = b.querySelector("img"); img.hidden = false; img.src = src.getAttribute("src"); img.alt = src.alt;
      }
      var fc = b.closest("figure") && b.closest("figure").querySelector("figcaption");
      cap.textContent = fc ? fc.textContent : "";
    }
    function close() { vid.pause(); lb.hidden = true; document.body.style.overflow = ""; if (last) last.focus(); }
    items.forEach(function (b, i) { b.addEventListener("click", function () { last = b; show(i); lb.hidden = false; document.body.style.overflow = "hidden"; lb.querySelector(".lb-close").focus(); }); });
    lb.querySelector(".lb-close").addEventListener("click", close);
    lb.querySelector(".lb-prev").addEventListener("click", function () { show(idx - 1); });
    lb.querySelector(".lb-next").addEventListener("click", function () { show(idx + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    lb.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") show(idx - 1);
      else if (e.key === "ArrowRight") show(idx + 1);
    });
  }

  /* Press filters */
  var chips = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));
  if (chips.length) {
    var rows = Array.prototype.slice.call(document.querySelectorAll(".press li"));
    var count = document.getElementById("press-count");
    chips.forEach(function (c) {
      c.addEventListener("click", function () {
        var f = c.getAttribute("data-filter"), n = 0;
        chips.forEach(function (o) { o.setAttribute("aria-pressed", String(o === c)); });
        rows.forEach(function (r) { var on = f === "all" || r.getAttribute("data-kind") === f; r.hidden = !on; if (on) n++; });
        if (count) count.textContent = n + (n === 1 ? " item" : " items");
      });
    });
  }

  /* Copy buttons: data-copy="#id" */
  Array.prototype.slice.call(document.querySelectorAll("[data-copy]")).forEach(function (btn) {
    var target = document.querySelector(btn.getAttribute("data-copy"));
    var msg = btn.parentNode.querySelector(".copy-msg");
    btn.addEventListener("click", function () {
      var text = target.textContent.trim();
      function selectIt() {
        var r = document.createRange(); r.selectNodeContents(target);
        var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
        if (msg) msg.textContent = "Selected. Copy it with your keyboard.";
      }
      try {
        navigator.clipboard.writeText(text).then(function () { if (msg) msg.textContent = "Copied to clipboard"; }, selectIt);
      } catch (e) { selectIt(); }
    });
  });

  /* Slides: [data-slides] crossfade with tabs, auto-advance unless reduced motion */
  Array.prototype.slice.call(document.querySelectorAll("[data-slides]")).forEach(function (root) {
    var slides = Array.prototype.slice.call(root.querySelectorAll(".slide"));
    var tabs = Array.prototype.slice.call(root.querySelectorAll(".slides-tabs button"));
    var cap = root.querySelector(".slides-cap"), i = 0, timer = null;
    var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function go(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle("is-on", k === i); });
      tabs.forEach(function (t, k) { t.setAttribute("aria-pressed", String(k === i)); });
      if (cap) cap.textContent = slides[i].getAttribute("data-cap") || "";
    }
    function start() { if (!still && !timer) timer = setInterval(function () { go(i + 1); }, 5000); }
    function stop() { clearInterval(timer); timer = null; }
    slides.forEach(function (s) { s.loading = "eager"; });
    tabs.forEach(function (t, k) { t.addEventListener("click", function () { stop(); go(k); }); });
    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    start();
  });

  /* Contact form: sends through FormSubmit's AJAX relay to the project inbox */
  var form = document.getElementById("contact-form");
  if (form) {
    var status = document.getElementById("cf-status"), send = document.getElementById("cf-send");
    function say(msg, kind) { status.textContent = msg; status.className = "form-status" + (kind ? " " + kind : ""); }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.elements.name, email = form.elements.email, message = form.elements.message, bad = null;
      [name, email, message].forEach(function (f) {
        var ok = f.value.trim() !== "" && (f.type !== "email" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value.trim()));
        f.setAttribute("aria-invalid", ok ? "false" : "true");
        if (!ok && !bad) bad = f;
      });
      if (bad) { say(bad === email && email.value.trim() ? "Check your email address." : "Fill in your name, email and message.", "err"); bad.focus(); return; }
      if (form.elements._honey.value) return;
      send.disabled = true; send.textContent = "Sending\u2026"; say("");
      var payload = {
        name: name.value.trim(), email: email.value.trim(), topic: form.elements.topic.value, message: message.value.trim(),
        _subject: "Gothic Folly website: " + form.elements.topic.value + " from " + name.value.trim(),
        _replyto: email.value.trim(), _template: "table", _captcha: "false"
      };
      fetch(form.getAttribute("data-endpoint"), { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(payload) })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (res) {
          if (res.ok && String(res.j.success) === "true") {
            form.reset(); say("Thanks, your message is on its way. We'll reply by email.", "ok");
          } else {
            say("Your message didn't send. Please email thegothicfolly@gmail.com instead.", "err");
          }
        })
        .catch(function () { say("Your message didn't send. Please email thegothicfolly@gmail.com instead.", "err"); })
        .then(function () { send.disabled = false; send.textContent = "Send message"; });
    });
  }

  /* Hero loop: hold on the first frame for visitors who prefer reduced motion */
  var heroVid = document.querySelector(".hero-video");
  if (heroVid) {
    var rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    function syncMotion() { if (rm.matches) { heroVid.pause(); } else { var pr = heroVid.play(); if (pr && pr.catch) pr.catch(function () {}); } }
    syncMotion();
    if (rm.addEventListener) rm.addEventListener("change", syncMotion);
  }

  /* Instagram feed: instagram.json is rewritten daily by a scheduled job. Section stays hidden if it is missing or empty. */
  var igSection = document.getElementById("instagram");
  if (igSection && window.fetch) {
    fetch("instagram.json", { cache: "no-cache" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (feed) {
        if (!feed || !feed.posts || !feed.posts.length) return;
        var grid = document.getElementById("instagram-grid");
        feed.posts.forEach(function (p) {
          var a = document.createElement("a");
          a.className = "instagram-item"; a.href = p.permalink; a.target = "_blank"; a.rel = "noopener";
          var img = document.createElement("img");
          img.src = p.src; img.alt = p.caption || "The Gothic Folly on Instagram"; img.loading = "lazy";
          a.appendChild(img);
          if (p.type === "VIDEO" || p.type === "CAROUSEL_ALBUM") {
            var badge = document.createElement("span"); badge.className = "instagram-badge"; badge.setAttribute("aria-hidden", "true");
            badge.textContent = p.type === "VIDEO" ? "\u25B6" : "\u2750"; a.appendChild(badge);
          }
          if (p.caption) { var cap = document.createElement("span"); cap.className = "instagram-caption"; cap.textContent = p.caption; a.appendChild(cap); }
          grid.appendChild(a);
        });
        igSection.hidden = false;
      })
      .catch(function () {});
  }

  /* Folly Mix demo: load on demand */
  var launch = document.getElementById("launch-demo");
  if (launch) {
    var stage = document.getElementById("stage"), poster = document.getElementById("poster"), fs = document.getElementById("fs-btn");
    launch.addEventListener("click", function () {
      var f = document.createElement("iframe");
      f.src = "folly-mix-demo.html";
      f.title = "Folly Mix lighting console, demo mode";
      f.setAttribute("allow", "fullscreen");
      poster.replaceWith(f);
      f.focus();
      if (stage.requestFullscreen && fs) {
        fs.hidden = false;
        fs.addEventListener("click", function () {
          try { var p = stage.requestFullscreen(); if (p && p.catch) p.catch(function () { fs.hidden = true; }); } catch (e) { fs.hidden = true; }
        });
      }
    });
    document.addEventListener("fullscreenchange", function () {
      var f = stage.querySelector("iframe");
      if (f) f.style.height = document.fullscreenElement ? "calc(100vh - 62px)" : "";
    });
  }
})();

/* ---------- Units: metric unless the viewer appears to be in the US ----------
   Pages are written in feet; each measurement is wrapped as
   <span class="u" data-metric="18 m">60 ft</span>. Location comes from the
   browser's time zone (no permission prompt), with the language region as a
   fallback. Liberia and Myanmar also use imperial. */
(function () {
  var els = document.querySelectorAll(".u[data-metric]");
  if (!els.length) return;
  var imperial = false;
  try {
    var tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (tz) imperial = /^(America\/(New_York|Detroit|Kentucky|Indiana|Chicago|Menominee|North_Dakota|Denver|Boise|Phoenix|Los_Angeles|Anchorage|Juneau|Sitka|Metlakatla|Yakutat|Nome|Adak|Puerto_Rico)|Pacific\/(Honolulu|Guam|Saipan|Pago_Pago)|US\/|Africa\/Monrovia|Asia\/(Yangon|Rangoon))/.test(tz);
    else imperial = /-US\b/i.test((navigator.languages && navigator.languages[0]) || navigator.language || "");
  } catch (e) { imperial = true; }
  if (imperial) return;
  els.forEach(function (el) { el.textContent = el.getAttribute("data-metric"); });
})();
