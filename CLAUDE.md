# CLAUDE.md — thegothicfolly.com

Guidance for AI agents (and people) editing this repository.

## What this is

The public website of The Gothic Folly, a Burning Man 2026 art installation.
Plain static HTML, CSS and JavaScript. No framework, no package manager, no
build step. The repository is **public** and Vercel serves it as-is.

## Deployment: push to `main` = live

- Vercel is connected to this repo. A push to `main` deploys to
  thegothicfolly.com in about a minute. There is no deploy command to run.
- Other branches and pull requests get preview URLs (the Vercel bot comments
  the link on the PR). Use a branch when a change should be reviewed first.
- Rollback: `git revert <sha>` and push.
- Always `git pull --rebase` before you commit. Several people and a couple of
  scheduled scripts push to `main`.

## Files

- `index.html` — the single main page. Sections are marked with HTML comments
  (HERO, SUPPORT THE BUILD, EVENTS, ABOUT, GALLERY, INSTAGRAM FEED,
  INTERACTIVITY, DESIGN A SHOW, JOIN, CREDITS, FOOTER).
- `style.css` — the design system. Fonts: Cormorant Garamond (display) and
  Josefin Sans (body). Palette: deep indigo, hot pink, lavender (from the
  official sticker). Not dark-gothic; keep it warm and playful.
- `script.js` — form handling, lightbox, success modal, Instagram section.
- `images/` — all images. New images go here and must be committed (nothing
  under `images/` is gitignored). Prefer JPG for photos, keep files under
  ~500 KB where possible.
- `shows/` — the LED shows subpage (`shows/index.html`, `shows/images/`,
  `shows/videos/`).

## Do not hand-edit these; automation owns them

1. **Credits.** In `index.html`, the list between `<!-- credits:start -->` and
   `<!-- credits:end -->` is generated from the crew sign-up form after Hunter
   approves each name. Do not add, remove or reword names there; your change
   would be overwritten and the section is governed by people's consent.
   Keep both marker comments and the `<section id="credits">` structure
   intact.
2. **Instagram.** `instagram.json` and `images/instagram/` are written daily
   by a scheduled job. `script.js` renders the section from that file and
   hides it when the file is missing or empty. Do not create or edit these by
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
