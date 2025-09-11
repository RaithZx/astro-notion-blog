import rss from '@astrojs/rss'
import { getAllPosts, getDatabase } from '../lib/notion/client'
import { getPostLink } from '../lib/blog-helpers'
const title = 'Ligadu'
const description = 'Artigus di siensia i saudi'
export async function GET() {
  const [posts, database] = await Promise.all([getAllPosts(), getDatabase()])

  return rss({
    title: title,
    description: description,
    site: import.meta.env.SITE,
    items: posts.map((post) => ({
      link: new URL(getPostLink(post.Slug), import.meta.env.SITE).toString(),
      title: post.Title,
      description: post.Excerpt,
      pubDate: new Date(post.Date),
    })),
  })
}
