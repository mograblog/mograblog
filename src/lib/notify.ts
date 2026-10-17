export interface CommentNotification {
  slug: string;
  authorName: string;
  authorAvatar?: string | null;
  content: string;
  targetText?: string | null;
  parentId?: number | null;
}

export interface FeedbackNotification {
  slug: string;
  title?: string;
  quickFeedback?: string | null;
  customMessage?: string | null;
  name?: string | null;
  email?: string | null;
}

export async function sendCommentNotification(env: any, comment: CommentNotification) {
  const adminEmail = env?.ADMIN_EMAIL || process?.env?.ADMIN_EMAIL;
  const resendApiKey = env?.RESEND_API_KEY || process?.env?.RESEND_API_KEY;

  if (!resendApiKey || !adminEmail) {
    return;
  }

  const articleUrl = `https://mograblog.com/${comment.slug.replace(/^\//, '')}`;
  const adminUrl = `https://mograblog.com/admin/comments/`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 16px; background-color: #ffffff;">
      <div style="margin-bottom: 20px;">
        <h2 style="margin: 0; font-size: 18px; color: #111827;">💬 New Comment on Mograblog</h2>
      </div>

      <div style="background-color: #f9fafb; padding: 16px; border-radius: 12px; margin-bottom: 20px; border: 1px solid #f3f4f6;">
        <p style="margin: 0 0 6px 0; font-size: 14px; font-weight: 600; color: #111827;">
          ${escapeHtml(comment.authorName)} ${comment.parentId ? `<span style="font-weight: normal; color: #6b7280;">(replying to #${comment.parentId})</span>` : ''}
        </p>
        <p style="margin: 0 0 12px 0; font-size: 12px; color: #6b7280;">
          Article: <a href="${articleUrl}" style="color: #0284c7; text-decoration: none; font-weight: 500;">/${escapeHtml(comment.slug)}</a>
        </p>
        ${comment.targetText ? `<blockquote style="margin: 0 0 12px 0; padding: 8px 12px; border-left: 3px solid #0284c7; background-color: #ffffff; font-size: 12px; color: #4b5563; font-style: italic;">"${escapeHtml(comment.targetText)}"</blockquote>` : ''}
        <div style="font-size: 14px; line-height: 1.6; color: #374151; white-space: pre-line;">
          ${escapeHtml(comment.content)}
        </div>
      </div>

      <div style="margin-top: 24px;">
        <a href="${adminUrl}" style="display: inline-block; background-color: #0284c7; color: #ffffff; padding: 10px 18px; border-radius: 8px; font-size: 13px; font-weight: 600; text-decoration: none; margin-right: 10px;">
          Moderate in Dashboard
        </a>
        <a href="${articleUrl}" style="display: inline-block; background-color: #f3f4f6; color: #374151; padding: 10px 18px; border-radius: 8px; font-size: 13px; font-weight: 600; text-decoration: none;">
          View on Blog
        </a>
      </div>

      <p style="margin-top: 24px; font-size: 11px; color: #9ca3af; text-align: center; border-top: 1px solid #f3f4f6; padding-top: 16px;">
        Sent automatically from Mograblog Comment System
      </p>
    </div>
  `;

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.EMAIL_FROM || 'Mograblog <onboarding@resend.dev>',
        to: [adminEmail],
        subject: `💬 New comment on "${comment.slug}" by ${comment.authorName}`,
        html,
      }),
    });
  } catch (err) {
    console.warn('Failed to send comment notification email:', err);
  }
}

export async function sendFeedbackNotification(env: any, feedback: FeedbackNotification) {
  const adminEmail = env?.ADMIN_EMAIL || process?.env?.ADMIN_EMAIL;
  const resendApiKey = env?.RESEND_API_KEY || process?.env?.RESEND_API_KEY;

  if (!resendApiKey || !adminEmail) {
    return;
  }

  const articleUrl = `https://mograblog.com/${feedback.slug.replace(/^\//, '')}`;
  const adminUrl = `https://mograblog.com/admin/comments/`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 16px; background-color: #ffffff;">
      <div style="margin-bottom: 20px;">
        <h2 style="margin: 0; font-size: 18px; color: #111827;">📝 New Feedback Received</h2>
      </div>

      <div style="background-color: #f9fafb; padding: 16px; border-radius: 12px; margin-bottom: 20px; border: 1px solid #f3f4f6;">
        <p style="margin: 0 0 6px 0; font-size: 14px; font-weight: 600; color: #111827;">
          From: ${escapeHtml(feedback.name || 'Anonymous Reader')} ${feedback.email ? `<span style="font-weight: normal; color: #6b7280;">(${escapeHtml(feedback.email)})</span>` : ''}
        </p>
        <p style="margin: 0 0 12px 0; font-size: 12px; color: #6b7280;">
          Article: <a href="${articleUrl}" style="color: #0284c7; text-decoration: none; font-weight: 500;">${escapeHtml(feedback.title || feedback.slug)}</a>
        </p>
        ${feedback.quickFeedback ? `<p style="margin: 0 0 10px 0; font-size: 13px; color: #047857; font-weight: 500;">Tags: ${escapeHtml(feedback.quickFeedback)}</p>` : ''}
        ${feedback.customMessage ? `<div style="font-size: 14px; line-height: 1.6; color: #374151; white-space: pre-line; background: #ffffff; padding: 10px; border-radius: 8px; border: 1px solid #e5e7eb;">${escapeHtml(feedback.customMessage)}</div>` : ''}
      </div>

      <div style="margin-top: 24px;">
        <a href="${adminUrl}" style="display: inline-block; background-color: #0284c7; color: #ffffff; padding: 10px 18px; border-radius: 8px; font-size: 13px; font-weight: 600; text-decoration: none;">
          View in Feedback Dashboard
        </a>
      </div>
    </div>
  `;

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.EMAIL_FROM || 'Mograblog <onboarding@resend.dev>',
        to: [adminEmail],
        subject: `📝 New feedback on "${feedback.title || feedback.slug}"`,
        html,
      }),
    });
  } catch (err) {
    console.warn('Failed to send feedback notification email:', err);
  }
}

function escapeHtml(str: string): string {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
