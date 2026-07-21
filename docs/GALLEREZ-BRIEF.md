# Brief for Gallerez

Two asks. The first is the important one.

---

## Ask 1: Can you reverse-proxy `/guides/` to an external host?

We're building a guides section as a static site, deployed on Vercel, and
we'd like it served from the main domain at:

```
https://www.medicarecompareagency.com/guides/
https://www.medicarecompareagency.com/guides/medicare-changes-2026
```

**The site is already built and live** at
`https://mca-guides.vercel.app/guides` — you can look at it right now. It's
a static site on Vercel; nothing needs to run on your server.

**The question:** can the server in front of medicarecompareagency.com
proxy that path to an external origin?

If it's nginx, the rule is roughly:

```nginx
location /guides/ {
    proxy_pass https://mca-guides.vercel.app/guides/;
    proxy_set_header Host mca-guides.vercel.app;
    proxy_ssl_server_name on;
}
```

If it's Apache with `mod_proxy`:

```apache
ProxyPreserveHost Off
SSLProxyEngine On
ProxyPass        /guides/ https://mca-guides.vercel.app/guides/
ProxyPassReverse /guides/ https://mca-guides.vercel.app/guides/
```

**Why it matters:** serving from the main domain keeps all the search
authority on medicarecompareagency.com. A subdomain splits it. If this
proxy is possible, it's worth doing.

**If it isn't possible** (shared hosting, no server config access), just say
so — we'll use `blog.medicarecompareagency.com` instead and you'd only need
to add one DNS record:

```
Type: CNAME
Name: blog
Value: cname.vercel-dns.com
```

---

## Ask 2: Fix the `/news` page, then redirect it

Right now every article on `/news` lives on that single URL, and the page's
title tag is `Medicare Providers Birmingham Alabama, Medicare Compare
Agency` — identical to the homepage. That means none of the five articles
can rank for their own topics, because Google only has one page to work
with and it isn't described as being about any of them.

Once `/guides/` is live, please set up **301 redirects** from the old page
to the new articles:

| From | To |
|---|---|
| `/news` | `/guides` |

And if any individual article was ever linked directly (e.g. from an email
or a social post), point it at the matching new URL:

| Article | New URL |
|---|---|
| Medicare changes for 2026 | `/guides/medicare-changes-2026` |
| Medicare Enrollment Periods Explained | `/guides/medicare-enrollment-periods-2026` |
| Understanding the Four Parts of Medicare | `/guides/four-parts-of-medicare-2026` |
| Medicare and Working Past 65 | `/guides/medicare-working-past-65` |
| How to Lower Your Medicare Drug Costs | `/guides/extra-help-and-savings-programs-2026` |

**301, not 302.** A 301 passes the ranking signal to the new URL; a 302
tells Google the move is temporary and holds the value at the old address.

Please also **remove the five articles from `/news`** once redirects are in
place, so the same content isn't live at two URLs.

---

## Ask 3 (small, while you're in there)

- Add a link to `/guides` in the main navigation.
- The footer still has a **Google+ icon**. Google+ shut down in 2019 — worth
  removing.
- The Twitter icon links to `twitter.com` rather than a profile.
- Homepage `<meta name="keyword">` can be deleted. Google has ignored the
  keywords meta tag since 2009; it does nothing.
