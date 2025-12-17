import type { AstroIntegration } from 'astro'
import { getAllPosts, getAllBlocksByBlockId, downloadFile, getBlock } from '../lib/notion/client'
import { extractTargetBlocks } from '../lib/blog-helpers'

/**
 * Downloads all images from post content blocks during build
 * This ensures images are available when import.meta.glob() runs
 */
export default (): AstroIntegration => ({
  name: 'post-content-image-downloader',
  hooks: {
    'astro:build:start': async () => {
      console.log('[Post Content Image Downloader] Starting to download images from post content...')
      
      const posts = await getAllPosts()
      let totalImages = 0
      let downloadedImages = 0

      // Download images from all posts
      await Promise.all(
        posts.map(async (post) => {
          try {
            // Get all blocks for this post
            const blocks = await getAllBlocksByBlockId(post.PageId)
            
            // Extract image and file blocks
            const fileAttachedBlocks = extractTargetBlocks('image', blocks)
              .concat(extractTargetBlocks('file', blocks))
              .filter((block) => {
                if (!block) return false
                const imageOrFile = block.Image || block.File
                return imageOrFile && imageOrFile.File && imageOrFile.File.Url
              })

            totalImages += fileAttachedBlocks.length

            // Download each image/file
            await Promise.all(
              fileAttachedBlocks.map(async (block) => {
                try {
                  const expiryTime = (block.Image || block.File).File.ExpiryTime
                  
                  // If URL is expired, refresh it
                  let url: URL
                  if (Date.parse(expiryTime) > Date.now()) {
                    url = new URL((block.Image || block.File).File.Url)
                  } else {
                    // Refresh expired URL
                    const refreshedBlock = await getBlock(block.Id)
                    url = new URL((refreshedBlock.Image || refreshedBlock.File).File.Url)
                  }

                  await downloadFile(url)
                  downloadedImages++
                } catch (err) {
                  console.warn(`[Post Content Image Downloader] Failed to download image for post ${post.Slug}:`, err)
                }
              })
            )
          } catch (err) {
            console.warn(`[Post Content Image Downloader] Failed to process post ${post.Slug}:`, err)
          }
        })
      )

      console.log(`[Post Content Image Downloader] Completed: ${downloadedImages}/${totalImages} images downloaded`)
    },
  },
})
