import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';

// RSS 2.0 feed. This exists so another site can import these articles
// programmatically instead of anyone copying and pasting them.
//
// Two things any importer needs to know:
//   1. <content:encoded> carries the FULL article HTML, including the
//      required TPMO disclaimer. The disclaimer is not optional and must
//      not be stripped on import.
//   2. Every item carries a <guid isPermaLink="true"> pointing at the
//      canonical URL on this site. If the article is republished
//      elsewhere, that page needs rel="canonical" back to this URL or the
//      two copies compete with each other in search.

const DISCLAIMER_HTML = `
<hr />
<p><small>We do not offer every plan available in your area. Any information
we provide is limited to those plans we do offer in your area. Please contact
Medicare.gov or 1-800-MEDICARE to get information on all of your
options.</small></p>
<p><small>This content is for general educational purposes and is not a
complete description of benefits. Contact the plan for more information.
Medicare Compare Agency, 2201 Providence Park, #150, Birmingham, Alabama
35242.</small></p>`;

const esc = (s: string) =>
  s.replace(/&/g, '&amp;')
   .replace(/</g, '&lt;')
   .replace(/>/g, '&gt;')
   .replace(/"/g, '&quot;');

// CDATA can't contain the sequence "]]>", so split it if it ever appears.
const cdata = (s: string) => `<![CDATA[${s.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`;

export const GET: APIRoute = async ({ site }) => {
  const articles = (await getCollection('articles', ({ data }) => !data.draft))
    .sort((a, b) => +new Date(b.data.publishDate) - +new Date(a.data.publishDate));

  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const origin = site!.origin;
  const feedUrl = `${origin}${base}/rss.xml`;

  const container = await AstroContainer.create();

  const items = await Promise.all(
    articles.map(async (article) => {
      const { Content } = await article.render();
      const html = await container.renderToString(Content);
      const url = `${origin}${base}/${article.slug}`;

      return `  <item>
    <title>${esc(article.data.title)}</title>
    <link>${url}</link>
    <guid isPermaLink="true">${url}</guid>
    <pubDate>${new Date(article.data.publishDate).toUTCString()}</pubDate>
    <dc:creator>${esc(article.data.author)}</dc:creator>
    <description>${esc(article.data.description)}</description>
    <content:encoded>${cdata(html + DISCLAIMER_HTML)}</content:encoded>
  </item>`;
    })
  );

  const lastBuild = articles.length
    ? new Date(articles[0].data.publishDate).toUTCString()
    : new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Medicare Compare Agency Guides</title>
  <link>${origin}${base}</link>
  <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
  <description>Educational guides on Medicare enrollment, coverage, and costs from Medicare Compare Agency.</description>
  <language>en-us</language>
  <lastBuildDate>${lastBuild}</lastBuildDate>
${items.join('\n')}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    },
  });
};
