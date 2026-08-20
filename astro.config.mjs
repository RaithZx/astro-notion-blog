import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import icon from 'astro-icon';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import clerk from '@clerk/astro';
import sitemap from '@astrojs/sitemap';
import { clerkLocalization } from './src/lib/clerk-localization.mjs';
import { CUSTOM_DOMAIN, BASE_PATH } from './src/server-constants';
import { getAllPosts } from './src/lib/notion/client';
import { getPostLink, getTagLink } from './src/lib/blog-helpers';
import CoverImageDownloader from './src/integrations/cover-image-downloader';
import CustomIconDownloader from './src/integrations/custom-icon-downloader';
import FeaturedImageDownloader from './src/integrations/featured-image-downloader';
import PostContentImageDownloader from './src/integrations/post-content-image-downloader';
// PublicNotionCopier no longer needed - images are now in src/assets/ and handled by Astro
// import PublicNotionCopier from './src/integrations/public-notion-copier';

// Tag pages thin enough to keep out of the sitemap (2 posts each) are
// intentionally excluded here rather than in the tag data itself.
const SITEMAP_TAGS = ['Notísias', 'Saúdi', 'Siênsia', 'Stórias', 'Tekinolojia'];
const SITEMAP_STATIC_PAGES = ['kontaktu', 'privasidadi', 'termus'];

// @astrojs/sitemap's auto-discovery only finds prerendered routes; post pages
// are on-demand SSR (no getStaticPaths), so their URLs must be built here.
const buildSitemapCustomPages = async (site) => {
  try {
    const posts = await getAllPosts();
    if (!posts || posts.length === 0) {
      console.warn('[sitemap] getAllPosts() returned no posts; customPages will be empty');
      return [];
    }

    const postUrls = posts.map((post) => new URL(getPostLink(post.Slug), site).toString());
    const tagUrls = SITEMAP_TAGS.map((tag) => new URL(getTagLink(tag), site).toString());
    const staticUrls = SITEMAP_STATIC_PAGES.map((page) => new URL(`/${page}`, site).toString());

    return [site, ...postUrls, ...tagUrls, ...staticUrls];
  } catch (error) {
    console.warn('[sitemap] getAllPosts() failed; falling back to empty customPages:', error);
    return [];
  }
};

// Canonical site URL: prefer CUSTOM_DOMAIN (e.g. Coolify production). Vercel / CF_PAGES are optional fallbacks.
const getSite = function () {
  if (CUSTOM_DOMAIN) {
    return new URL(BASE_PATH, `https://${CUSTOM_DOMAIN}`).toString();
  }

  if (process.env.VERCEL && process.env.VERCEL_URL) {
    return new URL(BASE_PATH, `https://${process.env.VERCEL_URL}`).toString();
  }

  if (process.env.CF_PAGES) {
    if (process.env.CF_PAGES_BRANCH !== 'main') {
      return new URL(BASE_PATH, process.env.CF_PAGES_URL).toString();
    }

    return new URL(
      BASE_PATH,
      `https://${new URL(process.env.CF_PAGES_URL).host
        .split('.')
        .slice(1)
        .join('.')}`
    ).toString();
  }

  return new URL(BASE_PATH, 'http://localhost:4321').toString();
};

const site = getSite();
const sitemapCustomPages = await buildSitemapCustomPages(site);

// https://astro.build/config
export default defineConfig({
  site,
  base: BASE_PATH,
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  image: {
    // Enable responsive images globally
    layout: 'constrained', // Constrained layout for most images
    responsiveStyles: true, // Enable responsive image styles
    // Optional: configure remote image domains if using external images
    // domains: ['example.com'],
    // remotePatterns: [{ protocol: 'https' }],
  },
  integrations: [
    clerk({ localization: clerkLocalization }),
    icon(),
    tailwind(),
    react(),
    sitemap({
      customPages: sitemapCustomPages,
      // Auto-discovery would also pick up prerendered routes we don't want
      // (paginated /posts/page/* and /posts/tag/*/page/*, plus tag pages for
      // thin tags like Natureza) - restrict the final sitemap to exactly the
      // URL set built in customPages.
      filter: (url) => sitemapCustomPages.includes(url),
    }),
    CoverImageDownloader(),
    CustomIconDownloader(),
    FeaturedImageDownloader(),
    PostContentImageDownloader(), // Download images from post content blocks
    // PublicNotionCopier() - removed, images now in src/assets/ and handled by Astro
  ],
});