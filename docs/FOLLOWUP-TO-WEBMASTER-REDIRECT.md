# Follow-up to webmaster — redirect is going the wrong way

Context: as of 2026-08-03, `https://www.medicarecompareagency.com/guides`
301-redirects to `https://mca-guides.vercel.app/guides`. That is not the
reverse proxy requested in the original email — it produces the opposite
SEO outcome. Send this as a reply on the existing thread.

---

**Subject:** Re: Website work — /guides is redirecting, not proxying

Hi,

Thanks for getting to this. One thing needs correcting before we go further.

Right now `https://www.medicarecompareagency.com/guides` sends the visitor
onward to `https://mca-guides.vercel.app/guides` — a 301 redirect. What I
asked for in item 1 was a **reverse proxy**, which is a different thing, and
the difference is the entire reason for the request.

**Redirect (what's live now):** the visitor's browser is handed a new
address and goes there. The address bar ends up showing
`mca-guides.vercel.app`. Google treats the Vercel address as the real home
of the content, and the search value builds up on a domain we don't own.

**Reverse proxy (what I need):** our server takes the request for
`/guides/...`, fetches the content from Vercel internally, and returns it.
The visitor never leaves our domain — the address bar stays on
`www.medicarecompareagency.com/guides/...`. One copy of each article, and
the search value accrues to our domain.

Same content either way. Completely different outcome for our rankings, which
is the only reason we're doing this.

I suspect the 301 may have come from item 2 of my earlier email — I did ask
for 301 redirects there, but those were for the **old `/news` pages**
pointing to the new guide URLs. Item 1, the `/guides/` path itself, needs
the proxy.

The nginx and Apache config for the proxy is in the `GALLEREZ-BRIEF.md`
document I attached previously — it's a few lines either way.

Two related notes:

1. **If the proxy genuinely isn't possible on our hosting, tell me now**
   rather than leaving the redirect in place. The redirect is worse than
   doing nothing, because it actively pushes our own material onto someone
   else's domain. The subdomain fallback
   (`blog.medicarecompareagency.com`, one CNAME) would be better than what
   we have now.

2. **Internal links are currently rendering with the Vercel address** on the
   live pages. Once the proxy is in, those should resolve to
   `www.medicarecompareagency.com/guides/...`. Worth a check after the
   change.

Could you confirm which way you're going — proxy or subdomain — and a rough
timeline? I'm publishing weekly and each article that goes out under the
current setup is one more we'll have to clean up later.

Thanks,

Dale Buir
Medicare Compare Agency
2201 Providence Park, #150
Birmingham, AL 35242
888-777-7986
