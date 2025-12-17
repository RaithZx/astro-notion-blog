import type { ImageMetadata } from 'astro'

/**
 * Pre-load all images using import.meta.glob()
 * This creates a mapping from URL paths to image modules at build time
 */
const imageModules = import.meta.glob<ImageMetadata>(
  '../assets/notion/**/*.{jpg,jpeg,png,webp,avif,gif,svg}',
  { eager: true }
)

/**
 * Creates a lookup map from Notion URL path to image module
 * The key format is: {dir}/{filename} (e.g., "abc123/image.jpg")
 */
function createImageMap(): Record<string, ImageMetadata> {
  const imageMap: Record<string, ImageMetadata> = {}
  
  for (const [path, module] of Object.entries(imageModules)) {
    // Extract the notion/{dir}/{filename} part from the path
    // Path format: ../assets/notion/{dir}/{filename}
    const match = path.match(/assets\/notion\/(.+)$/)
    if (match) {
      const key = match[1]
      // Handle both default export and direct module
      const imageMetadata = (module as any).default || module
      if (imageMetadata) {
        imageMap[key] = imageMetadata as ImageMetadata
      }
    }
  }
  
  return imageMap
}

// Create the image map once at module load time
const imageMap = createImageMap()

// Debug: Log image map stats (only in dev or if DEBUG_IMAGES env var is set)
if (import.meta.env.DEV || process.env.DEBUG_IMAGES) {
  const mapSize = Object.keys(imageMap).length
  const sampleKeys = Object.keys(imageMap).slice(0, 3)
  console.log(`[Image Helpers] Image map created with ${mapSize} images. Sample keys:`, sampleKeys)
}

/**
 * Constructs the lookup key for an image from a Notion URL
 * @param url - The Notion image URL
 * @returns The lookup key (format: "{dir}/{filename}")
 */
function getImageKey(url: URL): string {
  const [dir, filename] = url.pathname.split('/').slice(-2)
  const decodedFilename = decodeURIComponent(filename)
  return `${dir}/${decodedFilename}`
}

/**
 * Gets an image from a Notion URL using the pre-loaded image map
 * @param url - The Notion image URL
 * @returns The imported image module for use with Astro's <Image /> component, or null if not found
 */
export function getImageFromNotionUrl(
  url: URL
): ImageMetadata | null {
  try {
    const key = getImageKey(url)
    const imageModule = imageMap[key]
    
    if (!imageModule) {
      // Enhanced debugging
      if (import.meta.env.DEV || process.env.DEBUG_IMAGES) {
        const [dir, filename] = url.pathname.split('/').slice(-2)
        console.warn(`[Image Helpers] Image not found in map.`, {
          lookupKey: key,
          url: url.toString(),
          pathname: url.pathname,
          mapSize: Object.keys(imageMap).length,
          similarKeys: Object.keys(imageMap).filter(k => k.includes(dir) || k.includes(filename)).slice(0, 3)
        })
      }
      return null
    }
    
    return imageModule
  } catch (err) {
    console.error(`[Image Helpers] Failed to get image from Notion URL: ${url.toString()}`, err)
    return null
  }
}
