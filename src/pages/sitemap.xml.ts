import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const siteUrl = 'https://www.mograblog.com';
  const posts = await getCollection('posts', ({ data }) => !data.draft);

  // Collect unique tags
  const tagsSet = new Set<string>();
  posts.forEach((p) => {
    if (p.data.keywords) {
      p.data.keywords.split(',').map((k) => k.trim()).filter(Boolean).forEach((k) => tagsSet.add(k));
    }
  });

  // Sort posts by date descending
  const sortedPosts = posts.sort((a, b) => {
    const dateA = a.data.published ? new Date(a.data.published).getTime() : 0;
    const dateB = b.data.published ? new Date(b.data.published).getTime() : 0;
    return dateB - dateA;
  });

  const staticPages = [
    { url: `${siteUrl}/`, changefreq: 'daily', priority: '1.0' },
    { url: `${siteUrl}/about/`, changefreq: 'monthly', priority: '0.7' },
    { url: `${siteUrl}/tags/`, changefreq: 'weekly', priority: '0.8' },
  ];

  const tagPages = Array.from(tagsSet).map((tag) => ({
    url: `${siteUrl}/tags/${encodeURIComponent(tag.toLowerCase())}/`,
    changefreq: 'weekly',
    priority: '0.6',
  }));

  const postPages = sortedPosts.map((post) => {
    const slug = post.id.replace(/\.md$/, '');
    const pubDate = post.data.published ? new Date(post.data.published).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    return {
      url: `${siteUrl}/${slug}/`,
      lastmod: pubDate,
      changefreq: 'monthly',
      priority: '0.9',
    };
  });

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
  .map(
    (p) => `  <url>
    <loc>${p.url}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  )
  .join('\n')}
${postPages
  .map(
    (p) => `  <url>
    <loc>${p.url}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  )
  .join('\n')}
${tagPages
  .map(
    (p) => `  <url>
    <loc>${p.url}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemapXml.trim(), {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
