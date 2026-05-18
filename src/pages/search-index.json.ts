export const prerender = true

import { getAllPosts } from '../lib/notion/client'
import { getPostLink } from '../lib/blog-helpers'

export async function GET() {
  const posts = await getAllPosts()

  const items = posts.map((post) => ({
    title: post.Title,
    link: getPostLink(post.Slug),
    description: post.Excerpt ?? '',
    pubDate: post.Date,
    tags: post.Tags?.map((t) => t.name) ?? [],
  }))

  return new Response(JSON.stringify(items), {
    headers: { 'Content-Type': 'application/json' },
  })
}
