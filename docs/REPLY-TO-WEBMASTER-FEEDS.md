# Reply to webmaster — feed URLs

Copy everything below the line. Sent in answer to the programmer's request
for "RSS feed url or JSON API Url or XML feed API."

Position: the reverse proxy is still what we want. The feeds exist and are
handed over, but as the fallback, not the first choice. Reason is in the
email — importing creates a second copy of every article on the same domain.

---

**Subject:** Re: Feed URLs for the guides section

Hi,

Feeds are live. Three URLs, all publicly accessible, no key needed:

| Format | URL |
|---|---|
| RSS 2.0 | https://mca-guides.vercel.app/guides/rss.xml |
| JSON Feed 1.1 | https://mca-guides.vercel.app/guides/feed.json |
| XML sitemap | https://mca-guides.vercel.app/guides/sitemap.xml |

The RSS feed puts the full article HTML in `<content:encoded>`, so there's
enough there to render complete pages, not just excerpts. The JSON feed has
the same content in `content_html`, plus an `_mca` object on each item
carrying the slug, meta description, and target keyword if those are useful
to the import. Both update automatically — a new article goes out every
Monday and appears in the feed within a few minutes of publishing.

**Before you build the import, though, I want to flag something, because I
think there may be a simpler path that's also better for our search
rankings.**

If we import these articles into the main site, the same article exists in
two places: the guides site where it's published, and the copy inside
medicarecompareagency.com. Google has to pick one to rank, and when it has
to pick, the two copies compete with each other instead of adding up. It's
solvable with canonical tags, but it's ongoing maintenance — every time I
correct a figure in an article, the correction has to make it through the
import again, and if that ever silently fails, the site is showing outdated
Medicare numbers. These articles carry specific dollar amounts and
enrollment deadlines, so stale copies are a real problem for us, not a
cosmetic one.

The alternative is what I asked about in my earlier note: a **reverse proxy**,
so that anything requested under `/guides/` on our domain is served from the
guides site behind the scenes. Visitors and Google both see
`https://www.medicarecompareagency.com/guides/...` — it's our domain, our
URL, and it counts toward our site's authority. But there's only ever one
copy of each article, and updates are live the moment I publish. Nothing to
import, nothing to keep in sync.

Everything on our end is already configured for that: the articles' internal
links, canonical tags, and sitemap all already point at
`www.medicarecompareagency.com/guides/`. That's why the URLs inside the feed
show our domain rather than the Vercel address.

So my questions:

1. **Is a reverse proxy possible on our current hosting?** If it is, I'd
   rather go that route and skip the import entirely. The config details are
   in the document I sent previously.
2. **If it's not possible**, then let's do the feed import — and in that case
   tell me what URL path the imported articles will live at (for example
   `/medicare-guides/article-name/`). I'll update the canonical tags on my
   side to point there so the two copies don't compete.

One thing that has to hold either way: each article ends with a required
compliance disclaimer — the "we do not offer every plan available in your
area" paragraph plus our address. That's a CMS requirement for Medicare
marketing, not boilerplate we can trim for layout reasons. It's included in
the feed content, and it needs to survive the import and stay visible on the
page.

Happy to get on a call with your programmer if that's faster than email.

Thanks,
Dale
