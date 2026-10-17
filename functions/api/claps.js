// Cloudflare Pages Function: /api/claps
export async function onRequestGet({ request, env }) {
  try {
    const url = new URL(request.url);
    const slug = url.searchParams.get('slug');

    if (!slug) {
      return new Response(JSON.stringify({ error: 'Missing slug parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!env.DB) {
      return new Response(JSON.stringify({ success: true, claps: 0 }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const row = await env.DB.prepare(
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
    const { slug, count = 1 } = body;

    if (!slug) {
      return new Response(JSON.stringify({ error: 'Slug is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const increment = Math.max(1, Math.min(50, Math.floor(Number(count) || 1)));

    if (!env.DB) {
      return new Response(JSON.stringify({ success: true, claps: increment }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await env.DB.prepare(
      `INSERT INTO post_claps (post_slug, claps_count, updated_at) 
       VALUES (?, ?, datetime('now'))
       ON CONFLICT(post_slug) DO UPDATE SET 
         claps_count = claps_count + ?,
         updated_at = datetime('now')`
    ).bind(slug, increment, increment).run();

    const row = await env.DB.prepare(
      `SELECT claps_count FROM post_claps WHERE post_slug = ?`
    ).bind(slug).first();

    return new Response(JSON.stringify({
      success: true,
      claps: row ? Number(row.claps_count) || increment : increment,
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
