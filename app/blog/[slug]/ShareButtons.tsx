'use client'

import { useState } from 'react'

export default function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false)

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard unavailable (e.g. insecure context) — ignore
    }
  }

  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`

  return (
    <div className="ss-post-share">
      <button type="button" onClick={copyLink} className="ss-post-share-btn">
        {copied ? 'Copied!' : 'Copy link'}
      </button>
      <a href={tweetUrl} target="_blank" rel="noopener" className="ss-post-share-btn">
        Share on X
      </a>
    </div>
  )
}
