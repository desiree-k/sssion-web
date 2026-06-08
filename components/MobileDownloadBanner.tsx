'use client'

import { useState, useEffect } from 'react'
import AppStoreBadge from './AppStoreBadge'

export default function MobileDownloadBanner() {
  const [dismissed, setDismissed] = useState(true) // start hidden to avoid SSR flash

  useEffect(() => {
    const wasDismissed = sessionStorage.getItem('app_banner_dismissed')
    if (!wasDismissed) setDismissed(false)
  }, [])

  if (dismissed) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="mx-3 mb-3 flex items-center justify-between gap-3 bg-[#111120] border border-white/15 rounded-2xl px-4 py-3 shadow-2xl shadow-black/60">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 bg-[#B76E79]/20 rounded-xl flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-[#B76E79]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold leading-tight">Get the App</p>
            <p className="text-white/50 text-xs leading-tight truncate">Movement. Mastered.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <AppStoreBadge size="sm" />
          <button
            onClick={() => {
              setDismissed(true)
              sessionStorage.setItem('app_banner_dismissed', '1')
            }}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white/60 hover:text-white"
            aria-label="Dismiss"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
