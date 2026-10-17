// Cloudflare Pages Function: /api/views

function isBot(request) {
  // 1. Cloudflare verified bot header
  if (request.headers.get('cf-verified-bot') === 'true') {
    return true;
  }

  const userAgent = (request.headers.get('user-agent') || '').toLowerCase();
  if (!userAgent) return true; // legitimate human browsers send User-Agent

  // 2. Automated crawlers, scrapers, and headless browser keywords
  const botKeywords = [
    'bot', 'crawler', 'spider', 'slurp', 'mediapartners',
    'googlebot', 'bingbot', 'bingpreview', 'yandex', 'baidu', 'duckduckbot',
    'facebookexternalhit', 'linkedinbot', 'twitterbot', 'pinterest',
    'semrushbot', 'ahrefsbot', 'mj12bot', 'dotbot', 'petalbot',
    'bytespider', 'sogou', 'exabot', 'screaming frog',
    'headlesschrome', 'phantomjs', 'selenium', 'puppeteer', 'playwright',
    'curl', 'wget', 'python', 'urllib', 'requests', 'axios', 'got',
    'go-http-client', 'postman', 'httpie', 'ruby', 'java', 'apache-httpclient',
    'lighthouse', 'page speed', 'gtmetrix', 'uptimerobot', 'pingdom',
    'archive.org_bot', 'ia_archiver', 'discordbot', 'slackbot', 'telegrambot'
  ];

  return botKeywords.some(keyword => userAgent.includes(keyword));
}

function normalizeDate(raw) {
  if (!raw) return new Date().toISOString();
  if (!raw.includes('T')) return raw.replace(' ', 'T') + 'Z';
  if (!raw.endsWith('Z') && !raw.includes('+')) return raw + 'Z';
  return raw;
}

function dedupeReads(recentReads, limit = 20) {
  const seen = new Set();
  return (recentReads || []).filter((r) => {
    if (seen.has(r.post_slug)) return false;
    seen.add(r.post_slug);
    return true;
  }).slice(0, limit).map((r) => ({
    ...r,
    created_at: normalizeDate(r.created_at),
  }));
}

export async function onRequestGet({ request, env }) {
  try {
    const url = new URL(request.url);
    const slug = url.searchParams.get('slug');
    const limitParam = parseInt(url.searchParams.get('limit') || '20', 10);
    const limit = isNaN(limitParam) ? 20 : Math.min(Math.max(limitParam, 1), 50);

    let viewsCount = 0;
    if (slug) {
      const viewRes = await env.DB.prepare(
        `SELECT views_count FROM page_views WHERE post_slug = ?`
      ).bind(slug).first();
      viewsCount = viewRes?.views_count || 0;
    }

    const { results: recentReads } = await env.DB.prepare(
      `SELECT lr.post_slug, lr.post_title, lr.created_at, COALESCE(pv.views_count, 1) as views_count 
       FROM live_reads lr
       LEFT JOIN page_views pv ON lr.post_slug = pv.post_slug
       ORDER BY lr.created_at DESC 
       LIMIT 100`
    ).all();

    return new Response(JSON.stringify({
      success: true,
      views: viewsCount,
      recentReads: dedupeReads(recentReads, limit),
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();
    const { slug, title } = body;

    if (!slug) {
      return new Response(JSON.stringify({ error: 'Slug is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Bot Filtering: If user-agent or Cloudflare indicates bot, don't increment views
    const botDetected = isBot(request);

    if (!botDetected) {
      // Upsert view count for humans
      await env.DB.prepare(
        `INSERT INTO page_views (post_slug, views_count, last_read_at)
         VALUES (?, 1, datetime('now'))
         ON CONFLICT(post_slug) DO UPDATE SET
           views_count = views_count + 1,
           last_read_at = datetime('now')`
      ).bind(slug).run();

      // Record live read event for humans
      if (title) {
        await env.DB.prepare(
          `INSERT INTO live_reads (post_slug, post_title, created_at)
           VALUES (?, ?, datetime('now'))`
        ).bind(slug, title).run();
      }
    }

    const viewRes = await env.DB.prepare(
      `SELECT views_count FROM page_views WHERE post_slug = ?`
    ).bind(slug).first();

    const { results: recentReads } = await env.DB.prepare(
      `SELECT lr.post_slug, lr.post_title, lr.created_at, COALESCE(pv.views_count, 1) as views_count 
       FROM live_reads lr
       LEFT JOIN page_views pv ON lr.post_slug = pv.post_slug
       ORDER BY lr.created_at DESC 
       LIMIT 50`
    ).all();

    return new Response(JSON.stringify({
      success: true,
      views: viewRes?.views_count || 1,
      recentReads: dedupeReads(recentReads),
      bot: botDetected,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
