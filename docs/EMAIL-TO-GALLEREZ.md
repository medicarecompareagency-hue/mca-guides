# Email to webmaster

Copy everything below the line. Attach `GALLEREZ-BRIEF.md` from this same
folder — it has the exact server config.

---

**Subject:** Website work — new guides section, redirects, and title tags

Hi,

I've built out an educational guides section for the Medicare site. Five
articles are up now and I'll be adding one a week. It's already built and
hosted, so you can see exactly what we're working with here:

https://mca-guides.vercel.app/guides

I've attached a document with the exact configuration for everything below.
Here's what I need done.

---

**1. Serve the guides section from our domain**

I want these live at:

https://www.medicarecompareagency.com/guides/

Set up a reverse proxy so that anything under `/guides/` on our domain
passes through to the address above. It's a static site — nothing new needs
to run on our server, it just forwards the request and returns the
response. The attached document has the nginx and Apache config; it's a few
lines either way.

If our hosting genuinely can't do a reverse proxy, tell me and we'll use a
subdomain instead — `blog.medicarecompareagency.com`, which needs one CNAME
record from you. That's in the attached doc too. I'd prefer the `/guides/`
version because keeping it on the one domain is better for our search
rankings, so please only fall back to the subdomain if the proxy isn't
possible.

**2. Set up 301 redirects from the current /news page**

Once `/guides/` is live, redirect the old `/news` page and its articles to
the new URLs. The exact mapping is in the attached document.

These need to be **301** redirects, not 302. A 301 passes the existing
search ranking to the new pages; a 302 tells Google the move is temporary
and leaves the value on the old page.

Please don't remove the old articles until the redirects are in place and
confirmed working. Once they are, take the old copies down so we don't have
the same content live at two addresses.

**3. Add "Guides" to the main navigation**

**4. Fix the duplicate title tags**

Every page on our site currently has the same title tag — "Medicare
Providers Birmingham Alabama, Medicare Compare Agency." The homepage,
`/news`, `/about`, all of them.

That title is one of the strongest signals Google uses to decide what a
page is about. Right now our news articles are effectively competing with
the homepage instead of ranking for their own topics. Each page needs its
own title and its own meta description.

I'd like this fixed across the site, not just on `/news`. Treat it as a
separate job if that's easier.

**5. While you're in there**

- The footer still has a Google+ icon. Google+ shut down in 2019.
- The Twitter icon points at twitter.com rather than a profile.
- The homepage has a `meta name="keyword"` tag. Google has ignored the
  keywords meta tag since 2009 — it can come out.

---

Let me know your timeline for items 1 through 3, and a quote for item 4 if
it's outside our normal arrangement. Items 1 and 2 are the priority — I've
got articles publishing weekly and I want them landing on our domain rather
than sitting on a temporary address.

Thanks,

Dale Buir
Medicare Compare Agency
2201 Providence Park, #150
Birmingham, AL 35242
888-777-7986
