# CLAUDE.md — thegothicfolly.com

Guidance for AI agents (and people) editing this repository.

## What this is

The public website of The Gothic Folly, a Burning Man 2026 art installation.
Plain static HTML, CSS and JavaScript. No framework, no package manager, and
nothing for Vercel to build: the pages are committed as plain HTML. They are
generated locally from `src/pages/` by `src/build.py`. The repository is
**public** and Vercel serves it as-is.

## Deployment: push to `main` = live

- Vercel is connected to this repo. A push to `main` deploys to
  thegothicfolly.com in about a minute. There is no deploy command to run.
- Other branches and pull requests get preview URLs (the Vercel bot comments
  the link on the PR). Use a branch when a change should be reviewed first.
- Rollback: `git revert <sha>` and push.
- Always `git pull --rebase` before you commit. Several people and a couple of
  scheduled scripts push to `main`.

## Files

- `index.html`, `about.html`, `builds.html`, `folly-mix.html`, `press.html`,
  `gallery.html`, `contact.html`, `support.html`: the pages. They are generated: edit the
  matching file in `src/pages/` (or the shared head, nav and footer in
  `src/build.py`), then run `python3 src/build.py` and commit both.
- `assets/site.css`: the design system. Fonts: Inter Tight (display), Inter
  (body), JetBrains Mono (labels). Dark night palette by default
  (`--night`, `--bone`, `--ash`, rose-red accent `--rose`), with a light mode
  toggled from the nav (`data-mode="light"`). Sentence-case headings, minimal
  decoration; photography carries the page.
- `assets/site.js`: menu, light/dark toggle, lightbox, press filters, contact
  form (FormSubmit relay to the project inbox), Instagram section.
- `img/`: images the pages use. New images go here and must be committed.
  Prefer JPG for photos, keep files under ~500 KB where possible. `img/aura/`
  holds the per-page background colour fields from `src/aura.py`.
- `files/The-Gothic-Folly-EPK.pdf`: the press kit offered on `contact.html`.
  Replace the file in place (same name) when the EPK changes, and update the
  page count, size and date shown next to the download button.
- `video/`: silent looping MP4s (home hero, Folly Mix walkthrough).
- `shows/`: the LED shows subpage (`shows/index.html`, `shows/images/`,
  `shows/videos/`). It still uses the older `style.css`; keep that file.
- `images/`, `style.css`, `script.js`: from the previous single-page site.
  Kept for `shows/` and reference; do not delete without asking.

## Do not hand-edit these; automation owns them

1. **Credits.** In `about.html` and `src/pages/about.html`, the list between
   `<!-- credits:start -->` and `<!-- credits:end -->` is generated from the crew sign-up form after Hunter
   approves each name. Do not add, remove or reword names there; your change
   would be overwritten and the section is governed by people's consent.
   Keep both marker comments and the `<section id="credits">` structure
   intact.
2. **Instagram.** `instagram.json` and `images/instagram/` are written daily
   by a scheduled job. `assets/site.js` renders the section on `gallery.html`
   from that file and hides it when the file is missing or empty. Do not create or edit these by
   hand.

The scheduled jobs commit directly to `main` as John Keefe, with messages
starting `credits:` or `Gothic Folly Instagram feed`.

## Conventions

- Keep the site accessible: alt text on images, real headings, visible focus.
- Check at desktop width and at ~400 px before pushing. A quick way:
  `python3 -m http.server 8899` in the repo root, then open
  http://localhost:8899 and resize.
- The analytics tag (`/_vercel/insights/script.js`) and the favicon links in
  `<head>` stay as they are.
- Never commit secrets, tokens, email addresses that are not already public,
  or private planning notes. Everything here is public and is also served at
  `thegothicfolly.com/<path>`.
- Never delete other people's content without asking the person who added it.

## Who to ask

John Keefe (`jkeefe`) owns the Vercel project and the domain. Hunter Keene
handles credits and Instagram. Alex Noerpel is the build lead.
