import { getAuthenticatedUser } from '../_clerkAuth.js';

async function isAuthorized(request, env) {
  const user = await getAuthenticatedUser(request, env);
  return Boolean(user && user.isAdmin);
}

export async function onRequestGet({ request, env }) {
  try {
    if (!await isAuthorized(request, env)) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Access restricted to authorized admin' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { results } = await env.DB.prepare(
      `SELECT id, disqus_id, post_slug, author_name, author_avatar, author_id, content, parent_id, target_paragraph, target_text, created_at 
       FROM comments 
       ORDER BY created_at DESC 
       LIMIT 300`
    ).all();

    let feedbacks = [];
    try {
      const fbRes = await env.DB.prepare(
        `SELECT id, post_slug, post_title, quick_feedback, custom_message, name, email, created_at
         FROM feedback
         ORDER BY created_at DESC
         LIMIT 100`
      ).all();
      feedbacks = fbRes.results || [];
    } catch (e) {}

    return new Response(JSON.stringify({ success: true, comments: results || [], feedbacks }), {
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

export async function onRequestDelete({ request, env }) {
  try {
    if (!await isAuthorized(request, env)) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Access restricted to authorized admin' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: 'Comment ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await env.DB.prepare(`DELETE FROM comments WHERE id = ? OR parent_id = ?`).bind(id, id).run();

    return new Response(JSON.stringify({ success: true, deletedId: id }), {
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
