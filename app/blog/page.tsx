import type { Metadata } from 'next'
import Link from 'next/link'
import { Bricolage_Grotesque, Hanken_Grotesk } from 'next/font/google'
import { getBlogPosts } from '@/lib/blog'

const bricolage = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-bricolage' })
const hanken = Hanken_Grotesk({ subsets: ['latin'], variable: '--font-hanken' })

export const metadata: Metadata = {
  title: 'Blog | Sssion',
  description:
    'Notes from the Sssion team on movement, creators, community, and building a platform that treats movement art as art.',
  openGraph: {
    title: 'Blog | Sssion',
    description:
      'Notes from the Sssion team on movement, creators, community, and building a platform that treats movement art as art.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.sssion.studio/blog',
    types: { 'application/rss+xml': 'https://www.sssion.studio/blog/feed.xml' },
  },
}

const css = `
.ss-blog{min-height:100svh;background:#1A1A2E;color:#fff;font-family:var(--font-hanken),system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.ss-blog *{box-sizing:border-box}
.ss-blog-header{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:clamp(16px,3vw,24px) clamp(20px,5vw,64px)}
.ss-blog-logo{font-family:var(--font-bricolage),sans-serif;font-weight:700;font-size:clamp(20px,2.4vw,24px);letter-spacing:.02em;color:#fff;text-decoration:none}
.ss-blog-nav{display:flex;align-items:center;gap:clamp(14px,2.4vw,30px)}
.ss-blog-navlink{color:#C9C9D6;font-size:14px;font-weight:500;text-decoration:none}
.ss-blog-navlink:hover{color:#fff}
.ss-blog-main{max-width:700px;margin:0 auto;padding:clamp(48px,8vw,88px) clamp(20px,5vw,32px) clamp(80px,10vw,120px)}
.ss-blog-eyebrow{font-weight:600;font-size:12px;letter-spacing:.32em;text-transform:uppercase;color:#B76E79;margin-bottom:18px}
.ss-blog-h1{font-family:var(--font-bricolage),sans-serif;font-weight:700;font-size:clamp(38px,7vw,64px);line-height:1;letter-spacing:-.03em;margin:0 0 16px}
.ss-blog-intro{font-size:clamp(16px,2vw,18px);line-height:1.6;color:#B9B9C6;margin:0 0 clamp(40px,6vw,64px)}
.ss-blog-card{display:block;padding:clamp(24px,4vw,32px) 0;border-top:1px solid rgba(255,255,255,.08);text-decoration:none;color:inherit}
.ss-blog-card:last-child{border-bottom:1px solid rgba(255,255,255,.08)}
.ss-blog-card-meta{display:flex;flex-wrap:wrap;gap:10px;align-items:center;font-size:13px;color:#9999AA;margin-bottom:10px}
.ss-blog-card-title{font-family:var(--font-bricolage),sans-serif;font-weight:700;font-size:clamp(22px,3.4vw,28px);line-height:1.15;letter-spacing:-.02em;margin:0 0 10px;color:#fff;transition:color .2s ease}
.ss-blog-card:hover .ss-blog-card-title{color:#D89AA3}
.ss-blog-card-desc{font-size:15.5px;line-height:1.6;color:#B9B9C6;margin:0 0 14px}
.ss-blog-tags{display:flex;flex-wrap:wrap;gap:8px}
.ss-blog-tag{font-size:12px;font-weight:600;color:#D89AA3;background:rgba(183,110,121,.12);border:1px solid rgba(183,110,121,.3);border-radius:999px;padding:4px 12px}
.ss-blog-empty{color:#9999AA;padding:40px 0;border-top:1px solid rgba(255,255,255,.08)}
`

function formatDate(iso: string) {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function BlogIndexPage() {
  const posts = getBlogPosts()

  return (
    <div className={`${bricolage.variable} ${hanken.variable}`}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="ss-blog">
        <header className="ss-blog-header">
          <Link href="/" className="ss-blog-logo">sssion</Link>
          <nav className="ss-blog-nav">
            <Link href="/discover" className="ss-blog-navlink">Discover</Link>
            <Link href="/features" className="ss-blog-navlink">Features</Link>
          </nav>
        </header>

        <main className="ss-blog-main">
          <p className="ss-blog-eyebrow">The Sssion Blog</p>
          <h1 className="ss-blog-h1">Notes on movement</h1>
          <p className="ss-blog-intro">
            On creators, community, and building a platform that treats movement art as art.
          </p>

          {posts.length === 0 ? (
            <p className="ss-blog-empty">No posts yet — check back soon.</p>
          ) : (
            posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="ss-blog-card">
                <div className="ss-blog-card-meta">
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  <span aria-hidden>·</span>
                  <span>{post.readingTime}</span>
                </div>
                <h2 className="ss-blog-card-title">{post.title}</h2>
                <p className="ss-blog-card-desc">{post.description}</p>
                {post.tags.length > 0 && (
                  <div className="ss-blog-tags">
                    {post.tags.map((tag) => (
                      <span key={tag} className="ss-blog-tag">{tag}</span>
                    ))}
                  </div>
                )}
              </Link>
            ))
          )}
        </main>
      </div>
    </div>
  )
}
