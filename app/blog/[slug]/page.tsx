import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { Bricolage_Grotesque, Hanken_Grotesk } from 'next/font/google'
import { getBlogPost, getBlogPosts } from '@/lib/blog'
import ShareButtons from './ShareButtons'

const bricolage = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-bricolage' })
const hanken = Hanken_Grotesk({ subsets: ['latin'], variable: '--font-hanken' })

const SITE_URL = 'https://www.sssion.studio'

export function generateStaticParams() {
  return getBlogPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return { title: 'Post not found | Sssion' }
  return {
    title: `${post.title} | Sssion`,
    description: post.description,
    alternates: { canonical: `${SITE_URL}/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      ...(post.image ? { images: [post.image] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      ...(post.image ? { images: [post.image] } : {}),
    },
  }
}

const css = `
.ss-post{min-height:100svh;background:#1A1A2E;color:#fff;font-family:var(--font-hanken),system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.ss-post *{box-sizing:border-box}
.ss-post-header{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:clamp(16px,3vw,24px) clamp(20px,5vw,64px)}
.ss-post-logo{font-family:var(--font-bricolage),sans-serif;font-weight:700;font-size:clamp(20px,2.4vw,24px);letter-spacing:.02em;color:#fff;text-decoration:none}
.ss-post-nav{display:flex;align-items:center;gap:clamp(14px,2.4vw,30px)}
.ss-post-navlink{color:#C9C9D6;font-size:14px;font-weight:500;text-decoration:none}
.ss-post-navlink:hover{color:#fff}
.ss-post-main{max-width:700px;margin:0 auto;padding:clamp(40px,7vw,72px) clamp(20px,5vw,32px) clamp(80px,10vw,120px)}
.ss-post-back{display:inline-flex;align-items:center;gap:8px;font-size:14px;font-weight:600;color:#D89AA3;text-decoration:none;margin-bottom:clamp(28px,4vw,40px)}
.ss-post-back:hover{color:#E8B4BC}
.ss-post-h1{font-family:var(--font-bricolage),sans-serif;font-weight:700;font-size:clamp(32px,6vw,52px);line-height:1.05;letter-spacing:-.03em;margin:0 0 18px;text-wrap:balance}
.ss-post-meta{display:flex;flex-wrap:wrap;gap:10px;align-items:center;font-size:14px;color:#9999AA;margin-bottom:16px}
.ss-post-tags{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:clamp(28px,4vw,40px)}
.ss-post-tag{font-size:12px;font-weight:600;color:#D89AA3;background:rgba(183,110,121,.12);border:1px solid rgba(183,110,121,.3);border-radius:999px;padding:4px 12px}
.ss-post-share{display:flex;gap:10px;margin:0 0 clamp(32px,5vw,48px);padding-bottom:clamp(24px,4vw,32px);border-bottom:1px solid rgba(255,255,255,.08)}
.ss-post-share-btn{display:inline-flex;align-items:center;padding:8px 16px;border-radius:999px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.18);color:#fff;font-size:13px;font-weight:600;cursor:pointer;text-decoration:none;font-family:inherit;transition:background .2s ease}
.ss-post-share-btn:hover{background:rgba(255,255,255,.16)}
.ss-post-body{font-size:17px;line-height:1.75;color:#D3D3DE}
.ss-post-body p{margin:0 0 1.4em}
.ss-post-body h2{font-family:var(--font-bricolage),sans-serif;font-weight:700;font-size:clamp(24px,3.6vw,30px);letter-spacing:-.02em;color:#fff;margin:1.8em 0 .6em;line-height:1.15}
.ss-post-body h3{font-family:var(--font-bricolage),sans-serif;font-weight:700;font-size:clamp(19px,2.8vw,23px);color:#fff;margin:1.6em 0 .5em;line-height:1.2}
.ss-post-body a{color:#D89AA3;text-decoration:underline;text-underline-offset:3px}
.ss-post-body a:hover{color:#E8B4BC}
.ss-post-body strong{color:#fff}
.ss-post-body blockquote{margin:1.6em 0;padding:4px 0 4px 20px;border-left:3px solid #B76E79;color:#B9B9C6;font-style:italic}
.ss-post-body ul,.ss-post-body ol{margin:0 0 1.4em;padding-left:1.4em}
.ss-post-body li{margin-bottom:.4em}
.ss-post-body img{max-width:100%;border-radius:12px;margin:1.6em 0}
.ss-post-body code{background:rgba(255,255,255,.08);border-radius:6px;padding:2px 6px;font-size:.9em}
.ss-post-body pre{background:#14141f;border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:18px;overflow-x:auto;margin:1.6em 0}
.ss-post-body pre code{background:none;padding:0}
.ss-post-body hr{border:none;border-top:1px solid rgba(255,255,255,.08);margin:2.4em 0}
.ss-post-footer{margin-top:clamp(40px,6vw,56px);padding-top:clamp(24px,4vw,32px);border-top:1px solid rgba(255,255,255,.08)}
`

function formatDate(iso: string) {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) notFound()

  const url = `${SITE_URL}/blog/${post.slug}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.date,
    author: { '@type': 'Person', name: post.author },
    description: post.description,
    ...(post.image ? { image: `${SITE_URL}${post.image}` } : {}),
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    publisher: { '@type': 'Organization', name: 'Sssion', url: SITE_URL },
  }

  return (
    <div className={`${bricolage.variable} ${hanken.variable}`}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <div className="ss-post">
        <header className="ss-post-header">
          <Link href="/" className="ss-post-logo">sssion</Link>
          <nav className="ss-post-nav">
            <Link href="/blog" className="ss-post-navlink">Blog</Link>
            <Link href="/discover" className="ss-post-navlink">Discover</Link>
          </nav>
        </header>

        <main className="ss-post-main">
          <Link href="/blog" className="ss-post-back">← Back to Blog</Link>

          <article>
            <h1 className="ss-post-h1">{post.title}</h1>
            <div className="ss-post-meta">
              <span>{post.author}</span>
              <span aria-hidden>·</span>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span aria-hidden>·</span>
              <span>{post.readingTime}</span>
            </div>
            {post.tags.length > 0 && (
              <div className="ss-post-tags">
                {post.tags.map((tag) => (
                  <span key={tag} className="ss-post-tag">{tag}</span>
                ))}
              </div>
            )}

            <ShareButtons url={url} title={post.title} />

            <div className="ss-post-body">
              <MDXRemote source={post.content} />
            </div>
          </article>

          <div className="ss-post-footer">
            <Link href="/blog" className="ss-post-back">← Back to Blog</Link>
          </div>
        </main>
      </div>
    </div>
  )
}
