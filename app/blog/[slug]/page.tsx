import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getBlogPost, getBlogPosts } from '@/lib/blog'
import ShareButtons from './ShareButtons'
import {
  MARKETING_CSS,
  marketingFontVars,
  MarketingNav,
  MarketingFooter,
} from '@/components/marketing/MarketingChrome'

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
.mk-post-main{max-width:720px;margin:0 auto;padding:clamp(92px,11vw,132px) clamp(20px,5vw,32px) clamp(72px,10vw,110px)}
.mk-post-back{display:inline-flex;align-items:center;gap:8px;font-size:14px;font-weight:600;color:#9E5C68;text-decoration:none;margin-bottom:clamp(26px,4vw,38px)}
.mk-post-back:hover{color:#1D1B18}
.mk-post-h1{font-family:var(--font-fraunces),Georgia,serif;font-weight:400;font-size:clamp(34px,6vw,58px);line-height:1.03;letter-spacing:-.03em;margin:0 0 18px;text-wrap:balance}
.mk-post-meta{display:flex;flex-wrap:wrap;gap:10px;align-items:center;font-size:14px;color:#8D877D;margin-bottom:16px}
.mk-post-tags{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:clamp(26px,4vw,36px)}
.mk-post-tag{font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#9E5C68;background:#FFFFFF;border:1px solid #E5E0D6;border-radius:999px;padding:4px 12px}

/* ShareButtons keeps its class names — restyled to ivory here */
.ss-post-share{display:flex;gap:10px;margin:0 0 clamp(30px,5vw,44px);padding-bottom:clamp(22px,4vw,30px);border-bottom:1px solid #E5E0D6}
.ss-post-share-btn{display:inline-flex;align-items:center;padding:8px 16px;border-radius:999px;background:#FFFFFF;border:1px solid #E5E0D6;color:#1D1B18;font-size:13px;font-weight:600;cursor:pointer;text-decoration:none;font-family:inherit;transition:background .2s ease,border-color .2s ease}
.ss-post-share-btn:hover{background:#F7F4EF;border-color:#1D1B18}

.mk-post-body{font-size:17px;line-height:1.75;color:#4A463F}
.mk-post-body p{margin:0 0 1.4em}
.mk-post-body h2{font-family:var(--font-fraunces),Georgia,serif;font-weight:400;font-size:clamp(26px,3.8vw,34px);letter-spacing:-.02em;color:#1D1B18;margin:1.8em 0 .5em;line-height:1.12}
.mk-post-body h3{font-family:var(--font-fraunces),Georgia,serif;font-weight:500;font-size:clamp(20px,2.8vw,24px);color:#1D1B18;margin:1.6em 0 .5em;line-height:1.2}
.mk-post-body a{color:#9E5C68;text-decoration:underline;text-underline-offset:3px}
.mk-post-body a:hover{color:#1D1B18}
.mk-post-body strong{color:#1D1B18}
.mk-post-body blockquote{margin:1.6em 0;padding:4px 0 4px 20px;border-left:3px solid #9E5C68;color:#8D877D;font-style:italic}
.mk-post-body ul,.mk-post-body ol{margin:0 0 1.4em;padding-left:1.4em}
.mk-post-body li{margin-bottom:.4em}
.mk-post-body img{max-width:100%;border-radius:14px;margin:1.6em 0;border:1px solid #E5E0D6}
.mk-post-body code{background:#F0EDE6;border-radius:6px;padding:2px 6px;font-size:.9em}
.mk-post-body pre{background:#FFFFFF;border:1px solid #E5E0D6;border-radius:12px;padding:18px;overflow-x:auto;margin:1.6em 0}
.mk-post-body pre code{background:none;padding:0}
.mk-post-body hr{border:none;border-top:1px solid #E5E0D6;margin:2.4em 0}
.mk-post-footer{margin-top:clamp(40px,6vw,56px);padding-top:clamp(24px,4vw,32px);border-top:1px solid #E5E0D6}
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
    <div className={marketingFontVars}>
      <style dangerouslySetInnerHTML={{ __html: MARKETING_CSS + css }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <div className="mk">
        <MarketingNav />
        <main className="mk-post-main">
          <Link href="/blog" className="mk-post-back">← Back to Blog</Link>

          <article>
            <h1 className="mk-post-h1">{post.title}</h1>
            <div className="mk-post-meta">
              <span>{post.author}</span>
              <span aria-hidden>·</span>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span aria-hidden>·</span>
              <span>{post.readingTime}</span>
            </div>
            {post.tags.length > 0 && (
              <div className="mk-post-tags">
                {post.tags.map((tag) => (
                  <span key={tag} className="mk-post-tag">{tag}</span>
                ))}
              </div>
            )}

            <ShareButtons url={url} title={post.title} />

            <div className="mk-post-body">
              <MDXRemote source={post.content} />
            </div>
          </article>

          <div className="mk-post-footer">
            <Link href="/blog" className="mk-post-back">← Back to Blog</Link>
          </div>
        </main>
        <MarketingFooter />
      </div>
    </div>
  )
}
