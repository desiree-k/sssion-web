import type { Metadata } from 'next'
import StripeMessage from '../StripeMessage'

export const metadata: Metadata = {
  title: 'Link expired | Sssion',
  robots: { index: false, follow: false },
}

export default function StripeRefreshPage() {
  return (
    <StripeMessage
      title="That link expired"
      body="Open the Sssion app and tap Connect Stripe again to continue."
    />
  )
}
