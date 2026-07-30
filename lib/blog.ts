import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')

export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  author: string
  image?: string
  tags: string[]
  readingTime: string
  content: string
}

function parsePost(fileName: string): BlogPost {
  const slug = fileName.replace(/\.mdx?$/, '')
  const raw = fs.readFileSync(path.join(BLOG_DIR, fileName), 'utf8')
  const { data, content } = matter(raw)
  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? '',
    date: data.date ?? '',
    author: data.author ?? 'Sssion',
    image: data.image,
    tags: Array.isArray(data.tags) ? data.tags : [],
    readingTime: readingTime(content).text,
    content,
  }
}

export function getBlogPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return []
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => /\.mdx?$/.test(f))
    .map(parsePost)
    // Skip empty placeholder files (no frontmatter, no body)
    .filter((p) => p.date !== '' || p.content.trim() !== '')
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getBlogPost(slug: string): BlogPost | null {
  const safe = slug.replace(/[^a-zA-Z0-9-_]/g, '')
  for (const ext of ['.mdx', '.md']) {
    if (fs.existsSync(path.join(BLOG_DIR, safe + ext))) {
      return parsePost(safe + ext)
    }
  }
  return null
}
