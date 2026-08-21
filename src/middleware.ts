import { clerkMiddleware } from '@clerk/astro/server'
import { defineMiddleware, sequence } from 'astro:middleware'
import { CUSTOM_DOMAIN } from './server-constants'
import { buildCsp, SECURITY_HEADERS_BASE } from '../security-headers.mjs'

// Clerk's Frontend API is reachable at clerk.<CUSTOM_DOMAIN> in production (CNAME)
// and at a *.clerk.accounts.dev subdomain in dev/preview. Both are allowed since
// this middleware runs against both environments.
// https://clerk.com/docs/security/clerk-csp
const csp = buildCsp(CUSTOM_DOMAIN)

const securityHeaders = defineMiddleware(async (_context, next) => {
  const response = await next()

  // Shared with server.mjs's static-route wrapper so SSR and prerendered
  // routes carry an identical header set (see security-headers.mjs).
  for (const [name, value] of Object.entries(SECURITY_HEADERS_BASE)) {
    response.headers.set(name, value)
  }
  // Enforcing per docs/prd/0001-seo-remediation.md Decision 5 follow-up:
  // every external domain the app actually loads (scripts, iframes,
  // stylesheets, fonts) was audited against this policy before the flip.
  response.headers.set('Content-Security-Policy', csp)

  // SSR responses omit charset by default; without it, some crawler/extraction
  // pipelines fall back to Latin-1 and mangle Kriolu diacritics (á, é, ã, ê, ó).
  const contentType = response.headers.get('Content-Type')
  if (
    contentType?.startsWith('text/html') &&
    !contentType.includes('charset')
  ) {
    response.headers.set('Content-Type', `${contentType}; charset=utf-8`)
  }

  return response
})

export const onRequest = sequence(clerkMiddleware(), securityHeaders)
