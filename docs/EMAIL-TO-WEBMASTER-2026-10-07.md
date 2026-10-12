Subject: Re: /guides — new articles returning 500 on medicarecompareagency.com

Hi,

The Vercel origin is healthy. https://mca-guides.vercel.app/guides lists 17
articles and every one loads (HTTP 200).

But on our domain, https://medicarecompareagency.com/guides still lists only
the original 8 articles, and any newer article (for example
/guides/missed-medicare-deadline) returns HTTP 500. So the /guides path is
not passing requests through to Vercel live. It looks like it serves a
fixed copy of the first 8.

Please check how /guides is wired:
1. It should be a true reverse proxy to https://mca-guides.vercel.app/guides/
   (proxy_pass / ProxyPass), not a copy, import, or cache of specific pages.
2. If anything is cached, clear it, and keep the cache short (5 minutes)
   or off for /guides/*.
3. Test with: /guides/missed-medicare-deadline and
   /guides/annual-notice-of-change-medicare. Both should return 200.

New articles are added every Monday, so this has to pick them up with no
manual step on your end.

Thanks,
Dale Buir
Medicare Compare Agency
