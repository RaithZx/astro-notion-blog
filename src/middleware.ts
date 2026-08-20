import { clerkMiddleware } from '@clerk/astro/server'
import { defineMiddleware, sequence } from 'astro:middleware'
import { CUSTOM_DOMAIN } from './server-constants'

// Clerk's Frontend API is reachable at clerk.<CUSTOM_DOMAIN> in production (CNAME)
// and at a *.clerk.accounts.dev subdomain in dev/preview. Both are allowed since
// this middleware runs against both environments.
// https://clerk.com/docs/security/clerk-csp
const clerkOrigins = CUSTOM_DOMAIN ? [`https://clerk.${CUSTOM_DOMAIN}`] : []

const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline' https://*.clerk.accounts.dev https://challenges.cloudflare.com https://*.protect.clerk.com https://clerk-telemetry.com https://*.clerk-telemetry.com https://www.googletagmanager.com https://pagead2.googlesyndication.com https://*.googlesyndication.com https://googleads.g.doubleclick.net https://www.googleadservices.com https://stats.ligadu.com https://platform.twitter.com https://www.instagram.com https://www.tiktok.com https://cpwebassets.codepen.io https://assets.pinterest.com ${clerkOrigins.join(' ')}`,
  `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
  `font-src 'self' https://fonts.gstatic.com data:`,
  // Bookmark previews (metascraper) and link favicons pull images from
  // arbitrary third-party sites, so img-src is intentionally broad.
  `img-src 'self' data: https: https://img.clerk.com https://www.google.com`,
  `connect-src 'self' https://*.clerk.accounts.dev https://*.protect.clerk.com https://clerk-telemetry.com https://*.clerk-telemetry.com https://stats.ligadu.com https://www.google-analytics.com ${clerkOrigins.join(' ')}`,
  `frame-src 'self' https://challenges.cloudflare.com https://*.protect.clerk.com https://www.youtube.com https://platform.twitter.com https://www.tiktok.com https://www.instagram.com https://assets.pinterest.com https://www.pinterest.com https://cpwebassets.codepen.io https://codepen.io https://googleads.g.doubleclick.net https://tpc.googlesyndication.com ${clerkOrigins.join(' ')}`,
  `worker-src 'self' blob:`,
  `base-uri 'self'`,
]
  .map((directive) => directive.trim())
  .join('; ')

const securityHeaders = defineMiddleware(async (_context, next) => {
  const response = await next()

  response.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  )
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  // Report-only: collects violation data without blocking anything, per
  // docs/prd/0001-seo-remediation.md Decision 5. Flip to enforcing in a
  // follow-up PR once a monitoring window shows no unexpected reports.
  response.headers.set('Content-Security-Policy-Report-Only', csp)

  return response
})

export const onRequest = sequence(clerkMiddleware(), securityHeaders)
