import { Resend } from 'resend'
import {
  RESEND_API_KEY,
  RESEND_AUDIENCE_ID,
  RESEND_FROM_EMAIL,
  CUSTOM_DOMAIN,
} from '../../server-constants'

interface Post {
  title: string
  slug: string
  excerpt: string
}

function buildHtml(post: Post, siteUrl: string): string {
  const postUrl = `${siteUrl}/posts/${post.slug}`
  const resubscribeUrl = `${siteUrl}/api/resubscribe?email={{unsubscribe_email}}`

  return `<!DOCTYPE html>
<html lang="kea">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${post.title}</title>
</head>
<body style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#111;">
  <p style="font-size:13px;color:#888;margin-bottom:32px;">Ligadu</p>
  <h1 style="font-size:24px;line-height:1.3;margin-bottom:16px;">${post.title}</h1>
  <p style="font-size:16px;line-height:1.6;color:#444;margin-bottom:32px;">${post.excerpt}</p>
  <a href="${postUrl}" style="display:inline-block;padding:12px 24px;background:#111;color:#fff;text-decoration:none;border-radius:6px;font-size:15px;">Lê artigu</a>
  <hr style="margin:48px 0;border:none;border-top:1px solid #eee;" />
  <p style="font-size:12px;color:#aaa;">
    Bu sta a risibê es email pamodi bu ten konta na Ligadu.<br />
    <a href="${resubscribeUrl}" style="color:#aaa;">Torná subskribê</a> · <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#aaa;">Kansela subskrisiun</a>
  </p>
</body>
</html>`
}

function buildText(post: Post, siteUrl: string): string {
  return `${post.title}\n\n${post.excerpt}\n\nLê artigu: ${siteUrl}/posts/${post.slug}\n\n---\nKansela subskrisiun: {{{RESEND_UNSUBSCRIBE_URL}}}`
}

export async function notifySubscribers(post: Post): Promise<void> {
  if (!RESEND_API_KEY || !RESEND_AUDIENCE_ID || !RESEND_FROM_EMAIL) {
    throw new Error('Missing RESEND_API_KEY, RESEND_AUDIENCE_ID, or RESEND_FROM_EMAIL')
  }

  const siteUrl = CUSTOM_DOMAIN ? `https://${CUSTOM_DOMAIN}` : 'https://ligadu.com'
  const resend = new Resend(RESEND_API_KEY)

  const { data: broadcast, error: createError } = await resend.broadcasts.create({
    audienceId: RESEND_AUDIENCE_ID,
    from: RESEND_FROM_EMAIL,
    name: post.title,
    subject: post.title,
    html: buildHtml(post, siteUrl),
    text: buildText(post, siteUrl),
  })

  if (createError || !broadcast) {
    throw new Error(`Failed to create broadcast: ${createError?.message}`)
  }

  const { error: sendError } = await resend.broadcasts.send(broadcast.id)

  if (sendError) {
    throw new Error(`Failed to send broadcast: ${sendError.message}`)
  }
}
