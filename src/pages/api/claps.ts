export const prerender = false;

import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const url = new URL(request.url);
    const slug = url.searchParams.get('slug');

    if (!slug) {
      return new Response(JSON.stringify({ error: 'Missing slug parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const env = (locals as any).runtime?.env || (globalThis as any).__env__ || {};
    const db = env.DB;

    if (!db) {
      return new Response(JSON.stringify({ success: true, claps: 0 }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const row = await db.prepare(
      `SELECT claps_count FROM post_claps WHERE post_slug = ?`
    ).bind(slug).first();

    return new Response(JSON.stringify({
      success: true,
      claps: row ? Number(row.claps_count) || 0 : 0,
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=5',
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const { slug, count = 1 } = body;

    if (!slug) {
      return new Response(JSON.stringify({ error: 'Slug is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Clamp increment between 1 and 50 per batch
    const increment = Math.max(1, Math.min(50, Math.floor(Number(count) || 1)));

    const env = (locals as any).runtime?.env || (globalThis as any).__env__ || {};
    const db = env.DB;

    if (!db) {
      return new Response(JSON.stringify({ success: true, claps: increment }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await db.prepare(
      `INSERT INTO post_claps (post_slug, claps_count, updated_at) 
       VALUES (?, ?, datetime('now'))
       ON CONFLICT(post_slug) DO UPDATE SET 
         claps_count = claps_count + ?,
         updated_at = datetime('now')`
    ).bind(slug, increment, increment).run();

    const row = await db.prepare(
      `SELECT claps_count FROM post_claps WHERE post_slug = ?`
    ).bind(slug).first();

    return new Response(JSON.stringify({
      success: true,
      claps: row ? Number(row.claps_count) || increment : increment,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
