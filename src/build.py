"""Builds the static site: wraps each src/pages/*.html body in the shared head, nav and footer.
Run:  python3 src/build.py   (from the site folder). Output goes next to src/ as index.html, about.html, ...
"""
import pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES = [
    # file,         nav label,          title,                                  description
    ("index.html",   None,               "The Gothic Folly",                     "A sixty-foot cathedral of scaffolding and light, raised at Burning Man 2026 and played live through Folly Mix."),
    ("about.html",   "About",            "About · The Gothic Folly",             "The idea, the artists and the structure behind the Gothic Folly."),
    ("builds.html",  "Builds",           "Builds & Events · The Gothic Folly",   "Where the Gothic Folly has stood, from Black Rock City to Industry City, and how the sculpture adapts to each site."),
    ("folly-mix.html", "Folly Mix",      "Folly Mix · The Gothic Folly",         "Folly Mix is custom software coded specifically for the Gothic Folly. It plays all 35,900 of its programmable LEDs in time with the music. Try the demo."),
    ("press.html",   "Press",            "Press · The Gothic Folly",             "Coverage of the Gothic Folly and resources for the press."),
    ("gallery.html", "Gallery",          "Gallery · The Gothic Folly",           "Photographs of the Gothic Folly by day and by night."),
    ("contact.html", "Contact",          "Contact · The Gothic Folly",           "Collaborate with the Gothic Folly, download the press kit, or send us a message."),
    ("support.html", "Support",          "Support & Crew · The Gothic Folly",    "Donate to the Gothic Folly or join the crew that builds it."),
]

FONTS = ("https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Inter+Tight:wght@400;500"
         "&family=JetBrains+Mono:wght@400&display=swap")

HEAD = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{title}</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="description" content="{desc}">
<meta name="theme-color" content="#0A0B12">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="https://thegothicfolly.com/img/share.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="The Gothic Folly lit cyan at night, its rose window glowing between the spires">
<meta property="og:type" content="website">
<meta property="og:site_name" content="The Gothic Folly">
<meta property="og:url" content="{url}">
<meta name="twitter:card" content="summary_large_image">
<link rel="canonical" href="{url}">
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="{fonts}">
<script>try{{if(localStorage.getItem("tgf-mode")==="light")document.documentElement.setAttribute("data-mode","light")}}catch(e){{}}</script>
<link rel="stylesheet" href="assets/site.css">
<script>window.va = window.va || function () {{ (window.vaq = window.vaq || []).push(arguments); }};</script>
<script defer src="/_vercel/insights/script.js"></script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="nav">
  <div class="wrap">
    <a class="brand" href="index.html" aria-label="The Gothic Folly, home"><img class="on-dark" src="img/logo-horizontal.png" alt="The Gothic Folly" width="196" height="26"><img class="on-light" src="img/logo-horizontal-ink.png" alt="The Gothic Folly" width="196" height="26"></a>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="nav-links" aria-label="Menu">
      <svg class="i-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg><svg class="i-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
    </button>
    <ul class="nav-links" id="nav-links">
{links}
    </ul>
    <button class="mode-btn" type="button" aria-label="Switch to light mode" title="Light or dark mode">
      <svg class="i-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>
      <svg class="i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
    </button>
  </div>
</header>
<main id="main">
"""

FOOT = """</main>
<footer class="footer">
  <div class="wrap">
    <div class="top">
      <div>
        <div class="brandline"><img class="on-dark" src="img/logo-horizontal.png" alt="The Gothic Folly" width="300" height="41" loading="lazy"><img class="on-light" src="img/logo-horizontal-ink.png" alt="The Gothic Folly" width="300" height="41" loading="lazy"></div>
        <p class="muted small measure">A cathedral risen from the playa, open to all who wander beneath its arches. Est. 2026.</p>
      </div>
      <div>
        <h4>Explore</h4>
        <ul><li><a href="about.html">About</a></li><li><a href="builds.html">Builds &amp; Events</a></li><li><a href="folly-mix.html">Folly Mix</a></li><li><a href="press.html">Press</a></li><li><a href="gallery.html">Gallery</a></li></ul>
      </div>
      <div>
        <h4>Get involved</h4>
        <ul><li><a href="support.html#donate">Donate</a></li><li><a href="support.html#crew">Join the crew</a></li><li><a href="contact.html#collaborate">Collaborate</a></li><li><a href="contact.html#press-kit">Press kit</a></li><li><a href="contact.html">Contact</a></li></ul>
      </div>
      <div>
        <h4>Follow</h4>
        <ul><li><a href="https://www.instagram.com/thegothicfolly/" target="_blank" rel="noopener">Instagram</a></li><li><a href="https://wiki.thegothicfolly.com/" target="_blank" rel="noopener">Build wiki</a></li></ul>
      </div>
    </div>
    <div class="bottom"><span>&copy; 2026 Bread and Buttress LLC</span><span>Black Rock City · Brooklyn</span></div>
  </div>
</footer>
<script src="assets/site.js" defer></script>
</body>
</html>
"""


def nav(current):
    out = []
    for f, label, _, _ in PAGES:
        if not label:
            continue
        cur = ' aria-current="page"' if f == current else ""
        if f == "support.html":
            out.append(f'      <li><a class="btn" href="{f}"{cur}>Support</a></li>')
        else:
            out.append(f'      <li><a href="{f}"{cur}>{label}</a></li>')
    return "\n".join(out)


for f, label, title, desc in PAGES:
    body = (ROOT / "src" / "pages" / f).read_text()
    url = "https://thegothicfolly.com/" + ("" if f == "index.html" else f)
    html = HEAD.format(title=title, desc=desc, url=url, fonts=FONTS.replace("&", "&amp;"), links=nav(f)) + body + FOOT
    (ROOT / f).write_text(html)
    print("built", f, len(html))
