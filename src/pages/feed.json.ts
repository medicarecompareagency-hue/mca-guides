import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';

// JSON Feed 1.1 - https://www.jsonfeed.org/version/1.1/
// Same articles as rss.xml, in JSON, for importers that would rather not
// parse XML. `content_html` includes the required TPMO disclaimer; it must
// not be stripped on import.
//
// Extra non-standard fields under `_mca` carry the SEO metadata an importing
// CMS will want: the target keyword and the canonical URL.

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

export const GET: APIRoute = async ({ site }) => {
  const articles = (await getCollection('articles', ({ data }) => !data.draft))
    .sort((a, b) => +new Date(b.data.publishDate) - +new Date(a.data.publishDate));

  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const origin = site!.origin;

  const container = await AstroContainer.create();

  const items = await Promise.all(
    articles.map(async (article) => {
      const { Content } = await article.render();
      const html = await container.renderToString(Content);
      const url = `${origin}${base}/${article.slug}`;

      return {
        id: url,
        url,
        title: article.data.title,
        summary: article.data.description,
        content_html: html + DISCLAIMER_HTML,
        date_published: new Date(article.data.publishDate).toISOString(),
        date_modified: new Date(
          article.data.updatedDate ?? article.data.publishDate
        ).toISOString(),
        authors: [{ name: article.data.author }],
        language: 'en-US',
        _mca: {
          slug: article.slug,
          canonical_url: url,
          meta_description: article.data.description,
          target_keyword: article.data.targetKeyword,
          disclaimer_required: true,
        },
      };
    })
  );

  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: 'Medicare Compare Agency Guides',
    home_page_url: `${origin}${base}`,
    feed_url: `${origin}${base}/feed.json`,
    description:
      'Educational guides on Medicare enrollment, coverage, and costs from Medicare Compare Agency.',
    language: 'en-US',
    items,
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: {
      'Content-Type': 'application/feed+json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    },
  });
};
