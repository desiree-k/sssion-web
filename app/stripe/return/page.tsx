import type { Metadata } from 'next'
import StripeMessage from '../StripeMessage'

export const metadata: Metadata = {
  title: 'Stripe setup complete | Sssion',
  robots: { index: false, follow: false },
}

export default function StripeReturnPage() {
  return (
    <StripeMessage
      title="Stripe setup complete 🤍"
      body="Head back to the Sssion app — your payments card will update automatically."
    />
  )
}
