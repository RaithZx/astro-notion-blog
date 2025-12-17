# Move Images to src/assets/notion/ and Optimize Rendering

## Current Situation

- Images are downloaded from Notion at build time to `public/notion/` (line 418 in `src/lib/notion/client.ts`)
- Images in `public/` are NOT optimized by Astro
- All images use plain `<img>` tags without dimensions
- This causes CLS (Cumulative Layout Shift) and progressive loading issues (blank to image top-bottom rendering)

## Solution: Move to src/assets/notion/

Moving images to `src/assets/notion/` enables:
- Full Astro image optimization (compression, format conversion, responsive images)
- Automatic width/height inference to prevent CLS
- Better performance with optimized formats (WebP, AVIF)
- Responsive image generation with srcset

## Implementation Plan

### 1. Update downloadFile() Function
**File**: `src/lib/notion/client.ts` (line 418)

**Change**:
```typescript
// FROM:
const dir = './public/notion/' + url.pathname.split('/').slice(-2)[0]

// TO:
const dir = './src/assets/notion/' + url.pathname.split('/').slice(-2)[0]
```

**Details**:
- Change the directory path from `./public/notion/` to `./src/assets/notion/`
- Ensure directory structure is created: `src/assets/notion/{dir}/{filename}`
- Keep the same path structure based on Notion URL for consistency
- The function already handles directory creation with `fs.mkdirSync(dir, { recursive: true })` - verify this works

### 2. Create Image Import Helper Functions
**New File**: `src/lib/image-helpers.ts`

**Functions to create**:

1. `getImageAssetPath(url: URL): string`
   - Constructs the import path for an image from a Notion URL
   - Returns: `../../assets/notion/{dir}/{filename}` (relative path)
   - Used for dynamic imports

2. `getImageFromNotionUrl(url: URL): Promise<ImageMetadata>`
   - Async function that dynamically imports the image
   - Constructs path using `getImageAssetPath()`
   - Uses dynamic import: `await import(imagePath)`
   - Returns the imported image module for use with `<Image />`
   - Handles errors gracefully

3. `getImageImportPath(url: URL): string` (alternative approach)
   - Returns absolute import path using import alias if configured
   - Or uses `import.meta.glob()` pattern

**Implementation considerations**:
- Dynamic imports in Astro require the path to be known at build time
- Use string literals or `import.meta.glob()` to pre-load images
- Consider using `import.meta.glob('../../assets/notion/**/*.{jpg,jpeg,png,webp,avif}')` to create a mapping

### 3. Update filePath() Helper (Backward Compatibility)
**File**: `src/lib/blog-helpers.ts` (line 12)

**Options**:
- **Option A**: Keep `filePath()` for external/public images, create new `getImageAssetPath()` for src/assets
- **Option B**: Update `filePath()` to detect if image is in src/assets and return appropriate path
- **Option C**: Deprecate `filePath()` and migrate all usages to new helpers

**Recommended**: Option A - Create new helper, keep old one for transition period

### 4. Update PostFeaturedImage Component
**File**: `src/components/PostFeaturedImage.astro`

**Changes**:
- Import `getImageFromNotionUrl` helper
- Import Astro's `<Image />` component from `'astro:assets'`
- Replace `<img>` tag with `<Image />` component
- Use dynamic import to get image module
- Extract width/height from `post.FeaturedImage.Width` and `post.FeaturedImage.Height` if available
- Use proper alt text (currently hardcoded as "Featured image of the post")
- Handle both DEV and PROD environments

**Code structure**:
```astro
---
import { Image } from 'astro:assets'
import { getImageFromNotionUrl } from '../lib/image-helpers'

let imageModule = null
if (post.FeaturedImage && post.FeaturedImage.Url) {
  if (import.meta.env.DEV) {
    // In dev, might still use URL directly
    imageModule = post.FeaturedImage.Url
  } else {
    imageModule = await getImageFromNotionUrl(new URL(post.FeaturedImage.Url))
  }
}
---

{imageModule && (
  <Image 
    src={imageModule} 
    alt={post.Title || "Featured image"}
    width={post.FeaturedImage?.Width}
    height={post.FeaturedImage?.Height}
  />
)}
```

### 5. Update Notion Image Block Component
**File**: `src/components/notion-blocks/Image.astro`

**Changes**:
- Import `getImageFromNotionUrl` helper
- Import Astro's `<Image />` component
- Handle both External (remote) and File (downloaded) image types
- For File images: use dynamic import
- For External images: use URL directly (or configure remote patterns)
- Use `block.Image.Width` and `block.Image.Height` if available
- Extract alt text from caption using existing Caption component logic
- Keep lightbox functionality if `ENABLE_LIGHTBOX` is true
- Replace `<img>` with `<Image />` component

**Code structure**:
```astro
---
import { Image } from 'astro:assets'
import { getImageFromNotionUrl } from '../../lib/image-helpers'

let imageModule = null
let imageUrl = ''
let altText = ''

if (block.Image.External) {
  imageUrl = block.Image.External.Url
} else if (block.Image.File) {
  imageModule = await getImageFromNotionUrl(new URL(block.Image.File.Url))
}

// Extract alt text from caption
altText = block.Image.Caption?.map(rt => rt.Text?.Content).join(' ') || 'Image in a image block'
---

{imageModule && (
  <Image 
    src={imageModule}
    alt={altText}
    width={block.Image.Width}
    height={block.Image.Height}
    loading="lazy"
  />
)}
```

### 6. Update All Page Components
**Files to update**:

1. **`src/pages/index.astro`** (line 69-73)
   - Featured post image in featured section
   - Replace inline `<img>` with `<Image />` component
   - Use dynamic import for Notion images

2. **`src/pages/posts/[slug].astro`** (lines 157-162, 197-202, 237-242)
   - Related post images in sidebar
   - Replace all `<img>` tags with `<Image />`
   - Use dynamic imports

3. **`src/pages/posts/page/[page].astro`** (lines 108-113)
   - Post list images in sidebar
   - Update to use `<Image />` component

4. **`src/pages/posts/tag/[tag].astro`**
   - Tag page post images
   - Update to use `<Image />` component

5. **`src/pages/posts/tag/[tag]/page/[page].astro`**
   - Tag pagination page images
   - Update to use `<Image />` component

**Pattern for all**:
- Import `<Image />` component
- Import `getImageFromNotionUrl` helper
- Replace `<img src={filePath(...)} />` with dynamic import + `<Image />`
- Set proper dimensions and alt text

### 7. Update Astro Configuration
**File**: `astro.config.mjs`

**Add image configuration**:
```javascript
export default defineConfig({
  site: getSite(),
  base: BASE_PATH,
  image: {
    // Enable responsive images globally
    layout: 'constrained', // or 'full-width' for full-width images
    responsiveStyles: true, // Enable responsive image styles
    // Optional: configure remote image domains if using external images
    // domains: ['example.com'],
    // remotePatterns: [{ protocol: 'https' }],
  },
  integrations: [
    // ... existing integrations
  ],
});
```

### 8. Handle Image Dimensions
**Strategy**:
- Use `block.Image.Width` and `block.Image.Height` when available (from Notion API)
- For images without dimensions, let Astro infer from the image file
- Set appropriate aspect ratios for featured images (currently using `aspect-[16/10]` and `aspect-video`)
- Use `layout="constrained"` or `layout="full-width"` based on image usage

**Note**: The Image interface already has optional `Width` and `Height` properties (see `src/lib/interfaces.ts` line 103-104), but they may not always be populated from Notion API.

### 9. Update Build Process
**Considerations**:
- Ensure `src/assets/notion/` directory exists before build
- Update `.gitignore` if needed (images in src/assets should be committed or handled differently)
- Remove or update `public-notion-copier` integration (no longer needed if images are in src/)
- Verify build process handles the new location

### 10. Handle External Images
**Strategy**:
- For external images (not downloaded from Notion):
  - Continue using URL directly with `<Image />` component
  - Configure `image.domains` or `image.remotePatterns` in astro.config.mjs if needed
  - Remote images will be optimized if authorized, otherwise displayed as-is

### 11. Remove/Update public-notion-copier Integration
**File**: `src/integrations/public-notion-copier.ts`

**Options**:
- Remove entirely if no longer needed
- Or update to copy from `src/assets/notion/` if still needed for some reason
- Check if this integration is used for deployment or other purposes

## Dynamic Import Strategy

Since images are downloaded at build time but referenced dynamically, we have several options:

### Option 1: Dynamic Import with Relative Paths
```typescript
export async function getImageFromNotionUrl(url: URL) {
  const [dir, filename] = url.pathname.split('/').slice(-2)
  const imagePath = `../../assets/notion/${dir}/${filename}`
  return await import(imagePath)
}
```
**Challenge**: Relative paths depend on component location.

### Option 2: Import Alias
Configure import alias in `tsconfig.json` or `astro.config.mjs`:
```json
{
  "compilerOptions": {
    "paths": {
      "~/assets/*": ["src/assets/*"]
    }
  }
}
```
Then use: `await import('~/assets/notion/...')`

### Option 3: import.meta.glob() Pre-loading
```typescript
const imageModules = import.meta.glob('../../assets/notion/**/*.{jpg,jpeg,png,webp,avif}', { eager: true })
// Create a mapping from URL to module
```

**Recommended**: Start with Option 2 (import alias) for cleaner code, fallback to Option 3 if needed.

## Migration Steps

1. **Phase 1**: Update `downloadFile()` to save to `src/assets/notion/`
2. **Phase 2**: Create image helper functions
3. **Phase 3**: Update one component at a time (start with `PostFeaturedImage.astro`)
4. **Phase 4**: Update all page components
5. **Phase 5**: Update Astro config and test
6. **Phase 6**: Clean up old `public/notion/` files and integrations

## Testing Checklist

- [ ] Images download correctly to `src/assets/notion/`
- [ ] Images are optimized (check file sizes and formats)
- [ ] No CLS issues (images have proper dimensions)
- [ ] Responsive images work (check srcset in HTML output)
- [ ] External images still work
- [ ] Lightbox functionality still works
- [ ] Build process completes successfully
- [ ] Production build serves optimized images
- [ ] No broken image links

## Key Files to Modify

1. `src/lib/notion/client.ts` - Update `downloadFile()` function (line 418)
2. `src/lib/image-helpers.ts` - **NEW FILE** - Create helper functions
3. `src/lib/blog-helpers.ts` - Add new helper or update `filePath()`
4. `src/components/PostFeaturedImage.astro` - Use `<Image />` component
5. `src/components/notion-blocks/Image.astro` - Use `<Image />` component
6. `src/pages/index.astro` - Update featured image
7. `src/pages/posts/[slug].astro` - Update related post images
8. `src/pages/posts/page/[page].astro` - Update post list images
9. `src/pages/posts/tag/[tag].astro` - Update tag page images
10. `src/pages/posts/tag/[tag]/page/[page].astro` - Update tag pagination images
11. `astro.config.mjs` - Add image configuration
12. `src/integrations/public-notion-copier.ts` - Remove or update

## Notes

- Images in `src/assets/` will be fully optimized by Astro at build time
- Dynamic imports require the path to be known at build time (use string literals or glob patterns)
- Consider using `import.meta.glob()` to pre-load all images for better performance
- External images (not downloaded) will still work but won't be optimized unless configured
- The change from `public/` to `src/assets/` is a breaking change - all image references need updating
- Consider keeping both locations during transition period for backward compatibility
