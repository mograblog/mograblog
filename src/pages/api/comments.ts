export const prerender = false;

import type { APIRoute } from 'astro';
import { sendCommentNotification } from '../../lib/notify';

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

    // Access Cloudflare D1 binding via locals.runtime.env.DB
    const env = (locals as any).runtime?.env || (globalThis as any).__env__ || {};
    const db = env.DB;

    if (!db) {
      // Fallback response if running without D1 binding
      return new Response(JSON.stringify({ success: true, comments: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { results } = await db.prepare(
      `SELECT id, disqus_id, post_slug, author_name, author_avatar, author_id, content, parent_id, target_paragraph, target_text, created_at 
       FROM comments 
       WHERE post_slug = ? 
       ORDER BY created_at ASC`
    ).bind(slug).all();

    return new Response(JSON.stringify({ success: true, comments: results || [] }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=10',
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
    const {
      slug,
      authorName,
      authorAvatar,
      authorId,
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

    const cleanAuthor = (authorName || 'Anonymous User').trim();
    const cleanContent = content.trim();

    const env = (locals as any).runtime?.env || (globalThis as any).__env__ || {};
    const db = env.DB;

    if (!db) {
      return new Response(JSON.stringify({
        success: true,
        comment: {
          id: Date.now(),
          post_slug: slug,
          author_name: cleanAuthor,
          content: cleanContent,
          target_paragraph: targetParagraph,
          created_at: new Date().toISOString(),
        },
      }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const insertResult = await db.prepare(
      `INSERT INTO comments (post_slug, author_name, author_avatar, author_id, content, parent_id, target_paragraph, target_text, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`
    ).bind(
      slug,
      cleanAuthor,
      authorAvatar || null,
      authorId || null,
      cleanContent,
      parentId,
      targetParagraph,
      targetText
    ).run();

    const newCommentId = insertResult.meta?.last_row_id;

    // Send email notification to admin asynchronously (non-blocking)
    sendCommentNotification(env, {
      slug,
      authorName: cleanAuthor,
      authorAvatar: authorAvatar || null,
      content: cleanContent,
      targetText: targetText || null,
      parentId: parentId || null,
    }).catch((err) => console.warn('Notification error:', err));

    return new Response(JSON.stringify({
      success: true,
      comment: {
        id: newCommentId,
        post_slug: slug,
        author_name: cleanAuthor,
        author_avatar: authorAvatar,
        content: cleanContent,
        parent_id: parentId,
        target_paragraph: targetParagraph,
        created_at: new Date().toISOString(),
      },
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

function decodeBase64Url(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return atob(base64);
}

async function getAuthenticatedUser(request: Request, env: any) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) return null;

  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7).trim() : authHeader.trim();
  if (!token) return null;

  const clerkKey = env?.CLERK_SECRET_KEY || process?.env?.CLERK_SECRET_KEY;
  if (clerkKey) {
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payloadJson = decodeBase64Url(parts[1]);
        const payload = JSON.parse(payloadJson);
        const userId = payload.sub;

        if (userId) {
          const res = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
            headers: { Authorization: `Bearer ${clerkKey}` },
          });

          if (res.ok) {
            const userData = await res.json();
            const email = (userData.email_addresses?.[0]?.email_address || '').toLowerCase();
            const name = userData.first_name || userData.username || email.split('@')[0] || 'User';
            const avatar = userData.image_url || null;
            const allEmails = (userData.email_addresses || []).map((e: any) => (e.email_address || '').toLowerCase());
            const adminEmail = (env?.ADMIN_EMAIL || process?.env?.ADMIN_EMAIL || '').toLowerCase();
            const isAdmin = Boolean(adminEmail && allEmails.includes(adminEmail));

            return {
              userId,
              name,
              email,
              avatar,
              isAdmin,
            };
          }
        }
      }
    } catch (err) {
      console.warn('Clerk user auth error:', err);
    }
  }

  return null;
}

export const PUT: APIRoute = async ({ request, locals }) => {
  try {
    const env = (locals as any).runtime?.env || (globalThis as any).__env__ || {};
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

    const db = env.DB;
    if (db) {
      if (authUser.isAdmin) {
        await db.prepare(`UPDATE comments SET content = ? WHERE id = ?`).bind(content.trim(), id).run();
      } else {
        const existing = await db.prepare(`SELECT author_id FROM comments WHERE id = ?`).bind(id).first();
        if (!existing || existing.author_id !== authUser.userId) {
          return new Response(JSON.stringify({ error: 'Forbidden: You can only edit your own comments' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        await db.prepare(
          `UPDATE comments SET content = ? WHERE id = ? AND author_id = ?`
        ).bind(content.trim(), id, authUser.userId).run();
      }
    }

    return new Response(JSON.stringify({ success: true, id, content: content.trim() }), {
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

export const DELETE: APIRoute = async ({ request, locals }) => {
  try {
    const env = (locals as any).runtime?.env || (globalThis as any).__env__ || {};
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

    const db = env.DB;
    if (db) {
      if (authUser.isAdmin) {
        await db.prepare(`DELETE FROM comments WHERE id = ? OR parent_id = ?`).bind(id, id).run();
      } else {
        const existing = await db.prepare(`SELECT author_id FROM comments WHERE id = ?`).bind(id).first();
        if (!existing || existing.author_id !== authUser.userId) {
          return new Response(JSON.stringify({ error: 'Forbidden: You can only delete your own comments' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        await db.prepare(
          `DELETE FROM comments WHERE id = ? AND author_id = ?`
        ).bind(id, authUser.userId).run();
      }
    }

    return new Response(JSON.stringify({ success: true, id }), {
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
