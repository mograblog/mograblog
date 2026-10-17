import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

function getMimeType(url: string): string {
  const ext = url.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    case 'gif':
      return 'image/gif';
    case 'svg':
      return 'image/svg+xml';
    case 'jpg':
    case 'jpeg':
    default:
      return 'image/jpeg';
  }
}

export async function GET(context: APIContext) {
  const siteUrl = (context.site?.toString() || 'https://www.mograblog.com').replace(/\/$/, '');
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  
  const sortedPosts = posts.sort((a, b) => {
    const dateA = a.data.published ? new Date(a.data.published).getTime() : 0;
    const dateB = b.data.published ? new Date(b.data.published).getTime() : 0;
    return dateB - dateA;
  });

  return rss({
    title: 'Mograblog',
    description: "Guy Mograbi's Tech Blog - Let's make it work!",
    site: siteUrl,
    xmlns: {
      media: 'http://search.yahoo.com/mrss/',
      atom: 'http://www.w3.org/2005/Atom',
      dc: 'http://purl.org/dc/elements/1.1/',
    },
    items: sortedPosts.map((post) => {
      const cover = post.data.cover;
      const coverUrl = cover ? new URL(cover, siteUrl).href : null;
      const mimeType = coverUrl ? getMimeType(coverUrl) : null;
      const cleanSlug = post.id.replace(/\.md$/, '').replace(/^\//, '');
      const postUrl = `${siteUrl}/${cleanSlug}/`;
      const tags = post.data.keywords
        ? post.data.keywords.split(',').map((k) => k.trim()).filter(Boolean)
        : [];

      // Build clean custom XML for the item
      let itemCustomData = `<dc:creator>Guy Mograbi</dc:creator><comments>${postUrl}#comments-section</comments>`;
      if (coverUrl && mimeType) {
        itemCustomData += `<media:content url="${coverUrl}" medium="image" type="${mimeType}" /><media:thumbnail url="${coverUrl}" />`;
      }

      return {
        title: post.data.title,
        pubDate: post.data.published || new Date(),
        description: post.data.description,
        link: `/${cleanSlug}/`,
        commentsUrl: `${postUrl}#comments-section`,
        categories: tags,
        customData: itemCustomData,
        ...(coverUrl && mimeType
          ? {
              enclosure: {
                url: coverUrl,
                length: 0,
                type: mimeType,
              },
            }
          : {}),
      };
    }),
    customData: `<language>en-us</language><atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" /><image><url>${siteUrl}/favicon-32x32.png</url><title>Mograblog</title><link>${siteUrl}</link></image>`,
  });
}
