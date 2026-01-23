/**
 * Search index endpoint - generates JSON with full post content for search
 * This enables case-insensitive full-text search across all post content
 */

import type { APIRoute } from 'astro'
import { getAllPosts, getAllBlocksByBlockId } from '../lib/notion/client'
import { getPostLink } from '../lib/blog-helpers'
import { extractBlocksText } from '../lib/notion/text-helpers'

export const GET: APIRoute = async () => {
  const posts = await getAllPosts()
  
  // Build search index with full content
  const searchIndex = await Promise.all(
    posts.map(async (post) => {
      // Fetch all blocks for this post
      const blocks = await getAllBlocksByBlockId(post.PageId)
      
      // Extract full text content from blocks
      const content = extractBlocksText(blocks)
      
      return {
        title: post.Title,
        link: getPostLink(post.Slug),
        excerpt: post.Excerpt || '',
        content: content,
        pubDate: post.Date,
        tags: post.Tags?.map(t => t.name) || []
      }
    })
  )
  
  return new Response(JSON.stringify(searchIndex), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
    }
  })
}
