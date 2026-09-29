# Syndication log

Articles reposted to Medium, and when.

The Medium task reads this to avoid syndicating the same piece twice.
Don't delete rows.

---

## How the two weekly tasks fit together

| | When | What it does |
|---|---|---|
| **weekly-medicare-article** | Mon 8am | Writes a NEW article, publishes to Dale's site |
| **weekly-medicare-article-medium** | Mon 10am | Reposts an article from ~1 week ago to Medium |

The gap between them is deliberate. Dale's site publishes first and gets
indexed. Medium gets the copy a week later, with a canonical link pointing
back to the original.

**Why the canonical matters.** Medium is one of the highest-authority
domains on the web. Dale's guides site is new. Put near-identical content
on both with no canonical and Medium's version outranks his — he'd be
handing his own material to a platform he doesn't own so it can beat him
for his own topics. The canonical tells Google which one is the source.

This is also why Medium's **import** tool matters rather than pasting into
the normal editor. Import sets `rel=canonical` automatically. A manually
pasted story can't, and the best you get is a text line saying "originally
published at" — which is a courtesy to readers, not a signal to Google.

---

## Domain change — RESOLVED 2026-08-12

**The production domain is now serving the guides directly.** As of
2026-08-12, `https://www.medicarecompareagency.com/guides/<slug>` returns the
article on the production domain with no redirect to Vercel. The index at
`/guides` lists all published articles. Canonical URLs from this run forward
use the production domain.

**Backfill still owed.** The one post syndicated before the switch
(`should-i-switch-medicare-plans`, 2026-08-03) has a canonical pointing at
`mca-guides.vercel.app`. Fix it in Medium: open the story, three-dot menu →
Story settings → Advanced settings → change the canonical link to
`https://www.medicarecompareagency.com/guides/should-i-switch-medicare-plans`.

---

## Log

| Article slug | Syndicated | Medium URL |
|---|---|---|
| should-i-switch-medicare-plans | 2026-08-03 | _pending — Dale to fill in after publishing_ |
| compare-medicare-advantage-plans | 2026-08-12 | _pending — Dale to fill in after publishing_ |
| medicare-open-enrollment-2027 | 2026-08-17 | _pending — Dale to fill in after publishing_ |
| medicare-enrollment-periods-2026 | 2026-08-27 | _pending — Dale to fill in after publishing_ |
| extra-help-and-savings-programs-2026 | 2026-08-31 | _pending — Dale to fill in after publishing_ |
| four-parts-of-medicare-2026 | 2026-09-08 | _pending — Dale to fill in after publishing_ |
| medicare-changes-2026 | 2026-09-14 | _pending — Dale to fill in after publishing_ |
| medicare-working-past-65 | 2026-09-21 | _pending — Dale to fill in after publishing_ |

**Canonical used (2026-08-03 run):** `https://mca-guides.vercel.app/guides/should-i-switch-medicare-plans`
— Vercel, because production wasn't serving yet. **Needs updating in Medium**
to the production URL. See "Domain change — RESOLVED" above.

**Canonical used (2026-08-12 run):** `https://www.medicarecompareagency.com/guides/compare-medicare-advantage-plans`
— production domain, verified serving directly with no redirect. This is the
correct end state; no follow-up needed for this post.

**Canonical used (2026-08-17 run):** `https://www.medicarecompareagency.com/guides/medicare-open-enrollment-2027`
— production domain, verified serving directly with no redirect (checked via
the apex host; site links resolve there). No follow-up needed.

**Canonical used (2026-08-27 run):** `https://medicarecompareagency.com/guides/medicare-enrollment-periods-2026`
— production domain, verified live by fetching the page and the `/guides` index.
Note the **apex host, no `www`** — the site's own internal links all
self-reference the apex, so the canonical now matches that form. Earlier log
entries wrote `www`; both resolve, but apex is the site's canonical form.

**Canonical used (2026-08-31 run):** `https://medicarecompareagency.com/guides/extra-help-and-savings-programs-2026`
— production domain, apex host, verified live by fetching the page directly.
No follow-up needed.

**Canonical used (2026-09-08 run):** `https://medicarecompareagency.com/guides/four-parts-of-medicare-2026`
— production domain, apex host, verified live by fetching the page directly.
No follow-up needed.

**Canonical used (2026-09-14 run):** `https://medicarecompareagency.com/guides/medicare-changes-2026`
— production domain, apex host, verified live by fetching the page directly.
No follow-up needed.

**Canonical used (2026-09-21 run):** `https://medicarecompareagency.com/guides/medicare-working-past-65`
— production domain, apex host, verified live by fetching the page directly.
No follow-up needed.

---

## BLOCKER — two newest articles are not live on the site (found 2026-08-27, STILL OPEN 2026-08-31)

The `/guides` index at `https://medicarecompareagency.com/guides` lists only
**8** articles. These two exist in `src/content/articles/` but are **not
published on the live site**:

| Slug | publishDate | Status |
|---|---|---|
| `annual-notice-of-change-medicare` | 2026-08-12 | not on live site |
| `medicare-plan-discontinued` | 2026-08-17 | not on live site |

Both are 7+ days old and would otherwise have been this run's pick.
**They were skipped deliberately.** Syndicating them now would mean pointing a
canonical at a URL that 404s — or worse, publishing to Medium with no working
original, which hands Medium the only indexable copy. That is the exact
outcome this whole workflow exists to prevent.

**Action for Dale:** these need to go live on medicarecompareagency.com before
they can be syndicated. Likely a webmaster (Gallerez) publish step that hasn't
run. Once they're serving, they become the next two picks.

---

**Re-checked 2026-08-31:** the `/guides` index still lists only **8** articles.
`annual-notice-of-change-medicare` and `medicare-plan-discontinued` are still
not live. Skipped again for the same reason. This is now the second run in a
row they've been passed over, and ANOC content is at peak seasonal relevance
right now (letters land by Sept 30) — the window on that piece is closing.

**Next eligible articles** (all live on the site, all unsyndicated, all from
the 2026-07-20 batch):

- `four-parts-of-medicare-2026`
- `medicare-changes-2026`
- `medicare-working-past-65`

Plus `annual-notice-of-change-medicare` and `medicare-plan-discontinued` once
they are actually published to the live site — those should jump the queue,
since they're newer and seasonally timely (ANOC letters land in September).

**Tie-break note (2026-08-27):** the four remaining 07-20 articles all share
one publishDate, so "most recent" doesn't decide it. Picked
`medicare-enrollment-periods-2026` this run for seasonal relevance — AEP opens
October 15 and enrollment-window content is what people search in the fall.

**Tie-break note (2026-08-31):** same situation, three 07-20 articles left tied
on publishDate. Picked `extra-help-and-savings-programs-2026` — drug-cost and
Extra Help eligibility searches spike ahead of AEP, LIS enrollees have monthly
SEPs so the content is actionable year-round, and it's the meatiest piece in
the remaining pool. The four HTML card grids were converted to three markdown
tables for Medium (the per-state grids were consolidated into one comparison
table). No figures changed.

---

**Re-checked 2026-09-08:** `/guides` index still lists only **8** articles.
Now **four** unsyndicated articles exist in the repo but are not live on the
site (direct URLs return a server error, not the article):

| Slug | publishDate |
|---|---|
| `annual-notice-of-change-medicare` | 2026-08-12 |
| `medicare-plan-discontinued` | 2026-08-17 |
| `is-my-doctor-in-my-medicare-network` | 2026-08-27 |
| `missed-medicare-deadline` | 2026-08-31 |

All four skipped for the same reason as before. The backlog of unpublished
articles is growing by one a week — the Monday 8am task is writing them but
they are not reaching the live site. **Dale: the publish step to
medicarecompareagency.com needs fixing.** Nothing written since 2026-08-03
has gone live.

**Tie-break note (2026-09-08):** two 07-20 articles left tied on
publishDate. Picked `four-parts-of-medicare-2026` — broadest search term,
evergreen, the natural entry point for people turning 65 ahead of AEP. The
original is ~330 words (well under the 700-word floor) but adding depth
would mean adding content that wasn't compliance-reviewed, so it went as-is
plus a summary table built only from the article's own figures. No figures
changed.

**Remaining live + unsyndicated:** `medicare-changes-2026`,
`medicare-working-past-65`. After those, the queue is empty until the four
unpublished articles reach the live site.

---

**Re-checked 2026-09-14:** `/guides` index still lists only **8** articles.
Now **five** unsyndicated articles exist in the repo but are not live:

| Slug | publishDate |
|---|---|
| `annual-notice-of-change-medicare` | 2026-08-12 |
| `medicare-plan-discontinued` | 2026-08-17 |
| `is-my-doctor-in-my-medicare-network` | 2026-08-27 |
| `missed-medicare-deadline` | 2026-08-31 |
| `medicare-advantage-vs-original-medicare` | 2026-09-08 |

(`does-medicare-cover-dental-vision-hearing`, 2026-09-14, is `draft: true`
and too new anyway.) Nothing written since 2026-08-03 has reached the live
site. **Dale: the publish step to medicarecompareagency.com is still broken.**

**Tie-break note (2026-09-14):** picked `medicare-changes-2026` over
`medicare-working-past-65` — 2026 premium/deductible figures are what people
search ahead of AEP. ~330 words; sent as-is plus an at-a-glance table built
only from the article's own figures. No figures changed.

**Remaining live + unsyndicated:** `medicare-working-past-65` only. Next
Monday (09-21) is the last run with anything to send unless the five
unpublished articles go live.

---

**Re-checked 2026-09-21:** `/guides` index still lists only **8** articles.
Same five unsyndicated articles in the repo are still not live
(`annual-notice-of-change-medicare`, `medicare-plan-discontinued`,
`is-my-doctor-in-my-medicare-network`, `missed-medicare-deadline`,
`medicare-advantage-vs-original-medicare`). `does-medicare-cover-dental-vision-hearing`
is still `draft: true`. Nothing written since 2026-08-03 has reached the live
site. **Dale: the publish step to medicarecompareagency.com is still broken.**

Sent `medicare-working-past-65` — the last live, unsyndicated article. ~700
words, no HTML grids; sent as-is plus an at-a-glance table built only from
the article's own figures. No figures changed.

**QUEUE IS NOW EMPTY.** Next Monday (09-28) has nothing to syndicate unless
the five unpublished articles go live on the site.

---

**Re-checked 2026-09-29:** `/guides` index still lists only **8** articles, all already syndicated. Six unsyndicated articles in the repo are not live (direct URLs return HTTP 500): `annual-notice-of-change-medicare`, `medicare-plan-discontinued`, `is-my-doctor-in-my-medicare-network`, `missed-medicare-deadline`, `medicare-advantage-vs-original-medicare`, `does-medicare-cover-dental-vision-hearing` (09-21, now 8 days old). Nothing syndicated this run. **Dale: the publish step to medicarecompareagency.com is still broken.**
