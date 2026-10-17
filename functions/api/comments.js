// Cloudflare Pages Function: /api/comments
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

    // Query all comments for the given post slug
    const { results } = await env.DB.prepare(
      `SELECT id, disqus_id, post_slug, author_name, author_avatar, author_id, content, parent_id, target_paragraph, target_text, created_at 
       FROM comments 
       WHERE post_slug = ? 
       ORDER BY created_at ASC`
    ).bind(slug).all();

    return new Response(JSON.stringify({ success: true, comments: results || [] }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

import { getAuthenticatedUser } from './_clerkAuth.js';

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();
    const {
      slug,
      authorName,
      authorAvatar,
      content,
      parentId = null,
      targetParagraph = null,
      targetText = null,
    } = body;

    if (!slug || !content || !content.trim()) {
      return new Response(JSON.stringify({ error: 'Slug and content are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Verify authenticated user identity if token is present
    const authUser = await getAuthenticatedUser(request, env);
    const cleanAuthor = (authUser ? authUser.name : (authorName || 'Anonymous User')).trim();
    const finalAvatar = authUser ? authUser.avatar : (authorAvatar || null);
    const finalAuthorId = authUser ? authUser.userId : null;
    const cleanContent = content.trim();

    const insertResult = await env.DB.prepare(
      `INSERT INTO comments (post_slug, author_name, author_avatar, author_id, content, parent_id, target_paragraph, target_text, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`
    ).bind(
      slug,
      cleanAuthor,
      finalAvatar,
      finalAuthorId,
      cleanContent,
      parentId,
      targetParagraph,
      targetText
    ).run();

    return new Response(JSON.stringify({
      success: true,
      comment: {
        id: insertResult.meta?.last_row_id,
        post_slug: slug,
        author_name: cleanAuthor,
        author_avatar: finalAvatar,
        author_id: finalAuthorId,
        content: cleanContent,
        parent_id: parentId,
        target_paragraph: targetParagraph,
        created_at: new Date().toISOString(),
      },
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function onRequestPut({ request, env }) {
  try {
    const authUser = await getAuthenticatedUser(request, env);
    if (!authUser) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Authentication required to edit comments' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();
    const { id, content } = body;

    if (!id || !content || !content.trim()) {
      return new Response(JSON.stringify({ error: 'Comment ID and content are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (authUser.isAdmin) {
      await env.DB.prepare(`UPDATE comments SET content = ? WHERE id = ?`).bind(content.trim(), id).run();
    } else {
      const existing = await env.DB.prepare(`SELECT author_id FROM comments WHERE id = ?`).bind(id).first();
      if (!existing || existing.author_id !== authUser.userId) {
        return new Response(JSON.stringify({ error: 'Forbidden: You can only edit your own comments' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      await env.DB.prepare(
        `UPDATE comments SET content = ? WHERE id = ? AND author_id = ?`
      ).bind(content.trim(), id, authUser.userId).run();
    }

    return new Response(JSON.stringify({ success: true, id, content: content.trim() }), {
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
    const authUser = await getAuthenticatedUser(request, env);
    if (!authUser) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Authentication required to delete comments' }), {
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

    if (authUser.isAdmin) {
      await env.DB.prepare(`DELETE FROM comments WHERE id = ? OR parent_id = ?`).bind(id, id).run();
    } else {
      const existing = await env.DB.prepare(`SELECT author_id FROM comments WHERE id = ?`).bind(id).first();
      if (!existing || existing.author_id !== authUser.userId) {
        return new Response(JSON.stringify({ error: 'Forbidden: You can only delete your own comments' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      await env.DB.prepare(
        `DELETE FROM comments WHERE id = ? AND author_id = ?`
      ).bind(id, authUser.userId).run();
    }

    return new Response(JSON.stringify({ success: true, id }), {
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

