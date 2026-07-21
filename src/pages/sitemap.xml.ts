import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ site }) => {
  const articles = await getCollection('articles', ({ data }) => !data.draft);
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const origin = site!.origin;

  const urls = [
    { loc: `${origin}${base}`, lastmod: new Date() },
    ...articles.map((a) => ({
      loc: `${origin}${base}/${a.slug}`,
      lastmod: a.data.updatedDate ?? a.data.publishDate,
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${new Date(u.lastmod).toISOString().split('T')[0]}</lastmod>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
