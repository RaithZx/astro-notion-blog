// Shared between src/middleware.ts (SSR routes, via Astro) and server.mjs
// (the raw HTTP wrapper, which also covers prerendered static routes that
// never run Astro middleware). Plain .mjs so the root-level Node wrapper can
// import it without a build step.

export function buildCsp(customDomain) {
  const clerkOrigins = customDomain ? [`https://clerk.${customDomain}`] : [];

  return [
    `default-src 'self'`,
    `script-src 'self' 'unsafe-inline' https://*.clerk.accounts.dev https://challenges.cloudflare.com https://*.protect.clerk.com https://clerk-telemetry.com https://*.clerk-telemetry.com https://www.googletagmanager.com https://pagead2.googlesyndication.com https://*.googlesyndication.com https://googleads.g.doubleclick.net https://www.googleadservices.com https://stats.ligadu.com https://platform.twitter.com https://www.instagram.com https://www.tiktok.com https://cpwebassets.codepen.io https://assets.pinterest.com ${clerkOrigins.join(' ')}`,
    `style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net`,
    `font-src 'self' data:`,
    `img-src 'self' data: https: https://img.clerk.com https://www.google.com`,
    `connect-src 'self' https://*.clerk.accounts.dev https://*.protect.clerk.com https://clerk-telemetry.com https://*.clerk-telemetry.com https://stats.ligadu.com https://www.google-analytics.com ${clerkOrigins.join(' ')}`,
    `frame-src 'self' https://challenges.cloudflare.com https://*.protect.clerk.com https://www.youtube.com https://platform.twitter.com https://www.tiktok.com https://www.instagram.com https://assets.pinterest.com https://www.pinterest.com https://cpwebassets.codepen.io https://codepen.io https://googleads.g.doubleclick.net https://tpc.googlesyndication.com ${clerkOrigins.join(' ')}`,
    `worker-src 'self' blob:`,
    `base-uri 'self'`,
  ]
    .map((directive) => directive.trim())
    .join('; ');
}

export const SECURITY_HEADERS_BASE = {
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Content-Type-Options': 'nosniff',
  'Permissions-Policy': 'geolocation=(), camera=(), microphone=()',
};
