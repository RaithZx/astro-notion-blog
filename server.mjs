// Thin wrapper around the Astro Node adapter's standalone handler.
//
// Why this exists: @astrojs/node's standalone server serves prerendered
// static routes (homepage, /posts/page/N, tag pages) directly from disk,
// bypassing Astro middleware entirely — so src/middleware.ts's security
// headers never reach those responses, only SSR routes (post pages, /404,
// /feed). This wrapper intercepts every response at the raw HTTP layer,
// below both the static file server and the SSR pipeline, so the same
// baseline header set applies everywhere regardless of route type.
import http from 'node:http';
import { buildCsp, SECURITY_HEADERS_BASE } from './security-headers.mjs';

// @astrojs/node's standalone entry auto-starts its own server as an import
// side effect (see createExports/start in @astrojs/node/dist/server.js).
// Disable that so only the http.createServer below binds the port.
process.env.ASTRO_NODE_AUTOSTART = 'disabled';
const { handler } = await import('./dist/server/entry.mjs');

const csp = buildCsp(process.env.CUSTOM_DOMAIN || '');

const server = http.createServer((req, res) => {
  const originalWriteHead = res.writeHead.bind(res);

  res.writeHead = (...args) => {
    for (const [name, value] of Object.entries(SECURITY_HEADERS_BASE)) {
      if (!res.getHeader(name)) res.setHeader(name, value);
    }
    if (!res.getHeader('Content-Security-Policy')) {
      res.setHeader('Content-Security-Policy', csp);
    }
    return originalWriteHead(...args);
  };

  handler(req, res);
});

const port = Number(process.env.PORT) || 4321;
const host = process.env.HOST || '0.0.0.0';

server.listen(port, host, () => {
  console.log(`Server listening on http://${host}:${port}`);
});
