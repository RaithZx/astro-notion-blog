// Pulls one Ligadu post's raw content out of Notion, so the model step of the
// social-clips skill has real text to pick a stat/fact from. Deliberately does
// no creative work here (no summarizing, no hook-picking) — that judgment call
// belongs in SKILL.md, not hardcoded in a script.
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { Client } = require('@notionhq/client');

dotenv.config();

const NOTION_API_SECRET = process.env.NOTION_API_SECRET;
const DATABASE_ID = process.env.DATABASE_ID;
const CUSTOM_DOMAIN = process.env.CUSTOM_DOMAIN || '';
const BASE_PATH = process.env.BASE_PATH || '';

// Mirrors src/lib/utils.ts pathJoin() and src/lib/blog-helpers.ts getPostLink()
// so the CTA link matches what the site itself would generate.
function pathJoin(...parts) {
  return (
    parts
      .filter(Boolean)
      .join('/')
      .replace(/\/+/g, '/')
      .replace(/\/$/, '') || '/'
  );
}

// Mirrors astro.config.mjs getSite(): CUSTOM_DOMAIN is the source of truth for
// the canonical domain; VERCEL_URL/CF_PAGES_URL are build-platform fallbacks
// that don't apply to a one-off script run outside those platforms.
function buildPostUrl(slug) {
  const postPath = pathJoin(BASE_PATH, `/posts/${slug}`);
  if (CUSTOM_DOMAIN) {
    return new URL(postPath, `https://${CUSTOM_DOMAIN}`).toString();
  }
  return postPath;
}

function slugFromInput(input) {
  try {
    const url = new URL(input);
    const segments = url.pathname.split('/').filter(Boolean);
    return segments[segments.length - 1];
  } catch {
    return input;
  }
}

// Mirrors _generateSlugFromTitle() in src/lib/notion/client.ts — the site falls
// back to a slug derived from the title whenever the Notion Slug property is
// empty, so this script has to do the same to find those posts by URL slug.
function generateSlugFromTitle(title) {
  if (!title || title.trim().length === 0) return '';
  return title
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function findPageBySlug(notion, slug) {
  const directRes = await notion.databases.query({
    database_id: DATABASE_ID,
    filter: {
      property: 'Slug',
      rich_text: { equals: slug },
    },
  });
  if (directRes.results.length > 0) return directRes.results[0];

  // Fall back: the site generates the slug from the title when the Slug
  // property is empty, so scan for a title that produces the same slug.
  let cursor;
  while (true) {
    const res = await notion.databases.query({
      database_id: DATABASE_ID,
      start_cursor: cursor,
    });
    for (const page of res.results) {
      const title = page.properties.Page?.title
        ? plainTextFromRichText(page.properties.Page.title)
        : '';
      if (generateSlugFromTitle(title) === slug) return page;
    }
    if (!res.has_more) return null;
    cursor = res.next_cursor;
  }
}

function plainTextFromRichText(richTextArray) {
  if (!richTextArray) return '';
  return richTextArray.map((rt) => rt.plain_text).join('');
}

async function fetchBlockChildren(notion, blockId) {
  let results = [];
  let cursor;
  while (true) {
    const res = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
    });
    results = results.concat(res.results);
    if (!res.has_more) break;
    cursor = res.next_cursor;
  }
  return results;
}

// Walks the block tree and flattens it into {type, depth, text} entries.
// Covers the block types this repo's Notion database actually uses for body
// copy (paragraphs, headings, lists, quotes, callouts, tables, toggles).
async function extractBlocksText(notion, blockId, depth = 0) {
  const children = await fetchBlockChildren(notion, blockId);
  let out = [];
  for (const block of children) {
    const type = block.type;
    const data = block[type];
    let text = '';
    if (data && data.rich_text) {
      text = plainTextFromRichText(data.rich_text);
    } else if (type === 'table_row' && data && data.cells) {
      text = data.cells.map((cell) => plainTextFromRichText(cell)).join(' | ');
    }
    if (text) {
      out.push({ type, depth, text });
    }
    if (block.has_children && type !== 'child_page') {
      const nested = await extractBlocksText(notion, block.id, depth + 1);
      out = out.concat(nested);
    }
  }
  return out;
}

async function main() {
  const input = process.argv[2];
  if (!input) {
    console.error('Usage: node fetch-post.cjs <slug-or-notion-page-url>');
    process.exit(1);
  }
  if (!NOTION_API_SECRET || !DATABASE_ID) {
    console.error(
      'Missing NOTION_API_SECRET and/or DATABASE_ID. Set them in .env at the repo root ' +
        '(the same variables npm run cache:fetch uses) before running this script.'
    );
    process.exit(1);
  }

  const notion = new Client({ auth: NOTION_API_SECRET });
  const slug = slugFromInput(input);

  const page = await findPageBySlug(notion, slug);

  if (!page) {
    console.error(
      `No page found with Slug = "${slug}" in this database (checked both the literal Slug ` +
        'property and titles that would generate this slug). Note: this does not filter on ' +
        'Published, so draft/scheduled posts are found too — prepping social artifacts ahead ' +
        'of publish day is a valid use case.'
    );
    process.exit(1);
  }

  const props = page.properties;

  const title = props.Page?.title ? plainTextFromRichText(props.Page.title) : '';
  const excerpt = props.Excerpt?.rich_text
    ? plainTextFromRichText(props.Excerpt.rich_text)
    : '';
  const tags = props.Tags?.multi_select ? props.Tags.multi_select.map((t) => t.name) : [];
  const published = props.Published?.checkbox ?? null;
  const date = props.Date?.date?.start ?? null;

  const blocks = await extractBlocksText(notion, page.id);
  const plainText = blocks.map((b) => b.text).join('\n');

  const output = {
    slug,
    pageId: page.id,
    title,
    excerpt,
    tags,
    published,
    date,
    url: buildPostUrl(slug),
    blocks,
    plainText,
  };

  const outDir = path.join('social', slug);
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'source.json');
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));

  console.log(`Wrote extracted source to ${outPath}`);
  console.log(`Title: ${title}`);
  console.log(`Published: ${published}`);
  console.log(`URL: ${output.url}${CUSTOM_DOMAIN ? '' : '  (CUSTOM_DOMAIN not set — relative path only)'}`);
  console.log(`Blocks extracted: ${blocks.length}`);
}

main().catch((err) => {
  console.error('fetch-post.cjs failed:', err.message || err);
  process.exit(1);
});
