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

## Pending domain change

Canonical URLs currently point at `mca-guides.vercel.app` because
`medicarecompareagency.com/guides/` isn't serving yet — waiting on the
webmaster.

Once that's live, **any Medium post made before the switch will have a
canonical pointing at the Vercel address.** Those need updating: open each
story in Medium, three-dot menu → Story settings → Advanced settings →
change the canonical link to the medicarecompareagency.com URL.

The task checks the production domain on every run and will use it as soon
as it resolves, so this only affects posts made in the meantime.

---

## Log

| Article slug | Syndicated | Medium URL |
|---|---|---|
| should-i-switch-medicare-plans | 2026-08-03 | _pending — Dale to fill in after publishing_ |

**Canonical used:** `https://mca-guides.vercel.app/guides/should-i-switch-medicare-plans`
(Vercel, not production — see "Pending domain change" above. Needs updating in
Medium once the domain move lands.)

**Note on the production domain (2026-08-03):** `medicarecompareagency.com/guides`
no longer 404s — it now **301-redirects to `mca-guides.vercel.app`**. So the
"does production serve yet" check is no longer a clean yes/no. The content still
physically lives on Vercel, so the canonical stays Vercel for now. The redirect
is pointing the *wrong way* for the end state Dale wants: production should serve
the content and Vercel should redirect to production, not the reverse. Worth
raising with the webmaster.
