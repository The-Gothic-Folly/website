# The Gothic Folly — website

Source for [thegothicfolly.com](https://thegothicfolly.com), the site of
**The Gothic Folly**, a large open-air Gothic-cathedral-inspired art
installation built for Burning Man 2026.

Follow along on Instagram: [@thegothicfolly](https://instagram.com/thegothicfolly)

## How it deploys

This is a plain static site: no framework and nothing for Vercel to build. The
pages are plain HTML committed to the repo. Vercel is connected to this repository.

- **A push to `main` is live on thegothicfolly.com within about a minute.**
- Every other branch and every pull request gets its own preview URL, posted
  by the Vercel bot on the PR.
- To undo a bad change, `git revert` the commit and push, or open the Vercel
  project and promote an earlier deployment.

## Layout

| Path | What it is |
|---|---|
| `index.html`, `about.html`, `builds.html`, `folly-mix.html`, `press.html`, `gallery.html`, `contact.html`, `support.html` | the pages (generated, see below) |
| `files/The-Gothic-Folly-EPK.pdf` | the press kit, downloadable from the Contact page |
| `src/pages/` | the content of each page: edit these |
| `src/build.py` | wraps each page in the shared head, nav and footer |
| `assets/site.css` | all styling: colour and type tokens at the top, light mode at the bottom |
| `assets/site.js` | menu, light/dark toggle, lightbox, press filters, contact form, Instagram section |
| `img/` | images used by the pages (`img/mix/` Folly Mix screens, `img/aura/` page backgrounds) |
| `video/` | the home page loop and the Folly Mix walkthrough |
| `shows/` | the LED shows subpage, unchanged (uses the older `style.css`) |
| `images/`, `style.css`, `script.js` | assets from the previous single-page site, kept for `shows/` and for reference |
| `favicon*`, `apple-touch-icon.png` | icons |

## Editing a page

Change the page body in `src/pages/<page>.html`, or the shared header, nav and
footer in `src/build.py`, then run `python3 src/build.py` from the repo root.
It rewrites the top-level `.html` files; commit both. Page backgrounds in
`img/aura/` come from `src/aura.py` (run once; no need to rerun).

## Parts written by automation (do not hand-edit)

- The credits list between `<!-- credits:start -->` and `<!-- credits:end -->`
  in `about.html` (and its source, `src/pages/about.html`) is rewritten from the crew sign-up form after Hunter
  verifies names.
- `instagram.json` and `images/instagram/` are written daily from the
  @thegothicfolly feed. The Instagram section on `gallery.html` stays hidden until they exist.

Edits to those blocks will be overwritten on the next run.

## Working on it

1. Edit `src/pages/` and run `python3 src/build.py`. Open `index.html` in a browser, or run
   `python3 -m http.server 8899` in this folder and visit
   http://localhost:8899.
2. Check the page at desktop width and at about 400 px wide.
3. Commit and push to `main`. Done. For anything you want someone to look at
   first, push a branch and open a pull request to get a preview URL.

Keep secrets, tokens and private notes out of this repository: it is public,
and every committed file is also reachable by URL on the live site.
