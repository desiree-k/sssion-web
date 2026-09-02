import type { Metadata } from 'next'
import Link from 'next/link'
import { getBlogPosts } from '@/lib/blog'
import {
  MARKETING_CSS,
  marketingFontVars,
  MarketingNav,
  MarketingFooter,
} from '@/components/marketing/MarketingChrome'

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
.mk-blog-main{max-width:720px;margin:0 auto;padding:clamp(96px,12vw,140px) clamp(20px,5vw,32px) clamp(72px,10vw,110px)}
.mk-blog-h1{font-family:var(--font-fraunces),Georgia,serif;font-weight:400;font-size:clamp(44px,8vw,80px);line-height:.98;letter-spacing:-.03em;margin:0 0 16px}
.mk-blog-intro{font-size:clamp(16px,2vw,18px);line-height:1.6;color:#8D877D;margin:0 0 clamp(36px,6vw,56px);max-width:540px}
.mk-blog-card{display:block;padding:clamp(24px,4vw,32px) 0;border-top:1px solid #E5E0D6;text-decoration:none;color:inherit}
.mk-blog-card:last-child{border-bottom:1px solid #E5E0D6}
.mk-blog-card-meta{display:flex;flex-wrap:wrap;gap:10px;align-items:center;font-size:13px;color:#8D877D;margin-bottom:10px}
.mk-blog-card-title{font-family:var(--font-fraunces),Georgia,serif;font-weight:400;font-size:clamp(24px,3.6vw,32px);line-height:1.12;letter-spacing:-.02em;margin:0 0 10px;color:#1D1B18;transition:color .2s ease}
.mk-blog-card:hover .mk-blog-card-title{color:#9E5C68}
.mk-blog-card-desc{font-size:15.5px;line-height:1.6;color:#8D877D;margin:0 0 14px}
.mk-blog-tags{display:flex;flex-wrap:wrap;gap:8px}
.mk-blog-tag{font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#9E5C68;background:#FFFFFF;border:1px solid #E5E0D6;border-radius:999px;padding:4px 12px}
.mk-blog-empty{color:#8D877D;padding:40px 0;border-top:1px solid #E5E0D6}
`

function formatDate(iso: string) {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function BlogIndexPage() {
  const posts = getBlogPosts()

  return (
    <div className={marketingFontVars}>
      <style dangerouslySetInnerHTML={{ __html: MARKETING_CSS + css }} />
      <div className="mk">
        <MarketingNav />
        <main className="mk-blog-main">
          <p className="mk-eyebrow">The Sssion Blog</p>
          <h1 className="mk-blog-h1">Notes on movement</h1>
          <p className="mk-blog-intro">
            On creators, community, and building a platform that treats movement art as art.
          </p>

          {posts.length === 0 ? (
            <p className="mk-blog-empty">No posts yet — check back soon.</p>
          ) : (
            posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="mk-blog-card">
                <div className="mk-blog-card-meta">
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  <span aria-hidden>·</span>
                  <span>{post.readingTime}</span>
                </div>
                <h2 className="mk-blog-card-title">{post.title}</h2>
                <p className="mk-blog-card-desc">{post.description}</p>
                {post.tags.length > 0 && (
                  <div className="mk-blog-tags">
                    {post.tags.map((tag) => (
                      <span key={tag} className="mk-blog-tag">{tag}</span>
                    ))}
                  </div>
                )}
              </Link>
            ))
          )}
        </main>
        <MarketingFooter />
      </div>
    </div>
  )
}
