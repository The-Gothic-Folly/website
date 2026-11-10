# The Gothic Folly — website

Source for [thegothicfolly.com](https://thegothicfolly.com), the site of
**The Gothic Folly**, a large open-air Gothic-cathedral-inspired art
installation built for Burning Man 2026.

Follow along on Instagram: [@thegothicfolly](https://instagram.com/thegothicfolly)

## How it deploys

This is a plain static site: no framework, no build step. Vercel is connected
to this repository.

- **A push to `main` is live on thegothicfolly.com within about a minute.**
- Every other branch and every pull request gets its own preview URL, posted
  by the Vercel bot on the PR.
- To undo a bad change, `git revert` the commit and push, or open the Vercel
  project and promote an earlier deployment.

## Layout

| Path | What it is |
|---|---|
| `index.html` | the main page |
| `style.css` | all styling (fonts, palette, layout, responsive rules) |
| `script.js` | forms, lightbox, modal, Instagram section |
| `images/` | every image the site uses (commit new ones here) |
| `shows/` | the LED shows subpage with its own `images/` and `videos/` |
| `favicon*`, `apple-touch-icon.png` | icons |

## Parts written by automation (do not hand-edit)

- The credits list between `<!-- credits:start -->` and `<!-- credits:end -->`
  in `index.html` is rewritten from the crew sign-up form after Hunter
  verifies names.
- `instagram.json` and `images/instagram/` are written daily from the
  @thegothicfolly feed. The Instagram section stays hidden until they exist.

Edits to those blocks will be overwritten on the next run.

## Working on it

1. Edit the files. Open `index.html` in a browser, or run
   `python3 -m http.server 8899` in this folder and visit
   http://localhost:8899.
2. Check the page at desktop width and at about 400 px wide.
3. Commit and push to `main`. Done. For anything you want someone to look at
   first, push a branch and open a pull request to get a preview URL.

Keep secrets, tokens and private notes out of this repository: it is public,
and every committed file is also reachable by URL on the live site.
