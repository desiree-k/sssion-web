'use client'

import { APP_STORE_URL, PLAY_STORE_URL } from './AppStoreBadge'

/**
 * Quiet, non-fixed mobile app-download row — a small "Also on the App Store
 * and Google Play" line that sits in normal flow and never overlaps a page's
 * own CTAs. Use only on pages that lack their own store buttons.
 */
export default function MobileDownloadBanner() {
  return (
    <div className="md:hidden px-6 pt-2 pb-8 text-center">
      <p className="text-sm text-[var(--pt-text2)]">
        Also on the{' '}
        <a
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:opacity-80"
          style={{ color: 'var(--pt-accent)' }}
        >
          App Store
        </a>{' '}
        and{' '}
        <a
          href={PLAY_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:opacity-80"
          style={{ color: 'var(--pt-accent)' }}
        >
          Google Play
        </a>
      </p>
    </div>
  )
}
