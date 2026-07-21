# MCA Guides

Medicare Compare Agency's guides section. Markdown in, published pages out,
deployed on push.

Built with Astro. Same Vercel + GitHub setup as mapd-plan-finder, so nothing
new to learn.

---

## Writing an article

Create a `.md` file in `src/content/articles/`. The filename becomes the
URL — `medicare-changes-2026.md` becomes `/guides/medicare-changes-2026`.

```markdown
---
title: "Medicare Changes for 2026: What You Need to Know"
description: "Medicare's 2026 premiums and deductibles have changed. Here are the Part A and Part B figures."
publishDate: 2026-07-20
targetKeyword: "medicare changes 2026"
reviewedForCompliance: true
complianceReviewedBy: "Dale Buir"
---

Article body in markdown.
```

Set `draft: true` to keep something out of the build while you work on it.

You don't write the disclaimer — the layout adds it to every article
automatically, so it can't be forgotten on an individual post.

---

## Publishing

```powershell
git add -A
git commit -m "Add: article about X"
git push
```

That's it. Vercel builds and deploys on push. Live in about a minute.

**Before it deploys**, GitHub Actions runs the compliance check. If an
article fails, the deploy is blocked and you get an email. Nothing broken
reaches the site.

To check locally before pushing:

```powershell
npm run check    # compliance + SEO gate
npm run dev      # preview at localhost:4321/guides
```

---

## What the compliance check catches

Blocking (deploy fails):

- `reviewedForCompliance` not set to `true`
- Missing title, description, targetKeyword, or publishDate
- Superlatives about plans — "best", "top", "#1", "cheapest"
- Urgency language — "act now", "limited time", "don't miss out"
- Anything implying Medicare or CMS endorsement
- Prohibited inducements — "free gift", "free meal"
- Leftover TODOs or template placeholders

Warnings (won't block, but worth fixing):

- Title over 65 characters — Google truncates around there
- Description outside the 70–165 character range

The banned-phrase list is in `scripts/compliance-check.mjs`. Add to it as
your compliance contact flags things.

**This check is a safety net, not a compliance review.** It catches
mechanical mistakes. It cannot tell you whether an article's substance is
compliant — that's still a human call.

---

## Why this is set up the way it is

**Every article gets its own URL.** This is the main thing the old `/news`
page got wrong: all five articles shared one URL and one title tag, which
was itself a copy of the homepage's. Google can only rank a page, so five
articles sharing a page means none of them rank for their own topic.

**Every page gets its own title and meta description.** Generated from the
frontmatter, verified at build time.

**Schema.org Article markup** on each page, including your business address
and phone, which helps with local search.

**Sitemap** generated at `/guides/sitemap.xml`. Submit it in Google Search
Console once you're live.

---

## Where it deploys

`astro.config.mjs` is currently set for the **subdirectory** setup:

```js
site: 'https://www.medicarecompareagency.com',
base: '/guides',
```

This is the better option for SEO — authority stays on one domain — but it
needs Gallerez to configure a reverse proxy. See `docs/GALLEREZ-BRIEF.md`.

If the proxy isn't possible, swap in the subdomain config that's commented
out at the bottom of that file, and add one DNS record. The articles don't
change either way.

---

## Migrated content

All five articles from the old `/news` page are in
`src/content/articles/`, reformatted with real slugs, titles, and meta
descriptions.

Two things I changed while migrating:

- **Removed the duplicated disclaimers** from individual article bodies.
  They're in the layout now, so every article gets them without you
  remembering.
- **Dropped a broken image** from the Extra Help article. It pointed at
  `/uploads/testimonials/1784577210.png`, which looks like it was pulled
  from the testimonials folder by mistake. Add a real one if you want it.

Don't delete the old `/news` articles until the 301 redirects are in place —
otherwise you lose whatever ranking they've built.
