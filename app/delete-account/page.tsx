import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Delete Your Account | Sssion',
  description: 'How to delete your Sssion account and all associated data.',
}

export default function DeleteAccountPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="py-6 px-6 border-b border-white/10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <a href="/" className="text-2xl font-bold text-[#B76E79]">
            Sssion
          </a>
        </div>
      </header>

      {/* Content */}
      <main className="py-12 px-6">
        <article className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Delete Your Account
          </h1>

          <p className="text-white/70 leading-relaxed mb-4">
            You can delete your account and all associated data directly in the
            Sssion app: open the app &rarr; Settings &rarr; Delete Account.
          </p>

          <p className="text-white/70 leading-relaxed mb-8">
            If you&apos;re unable to access the app, email us at{' '}
            <a
              href="mailto:support@sssion.studio"
              className="text-[#B76E79] underline"
            >
              support@sssion.studio
            </a>{' '}
            and we&apos;ll process your deletion request within 48 hours.
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              What gets deleted
            </h2>
            <ul className="text-white/70 space-y-2 list-disc list-inside">
              <li>Your profile and personal information</li>
              <li>Your videos and posts</li>
              <li>Your studio access and memberships</li>
              <li>Your watch history</li>
              <li>Your account credentials</li>
            </ul>
          </section>

          <p className="text-white/90 font-medium mb-8">
            This action is permanent and cannot be undone.
          </p>

          <a
            href="mailto:support@sssion.studio"
            className="inline-block bg-[#B76E79] text-white font-semibold px-6 py-3 rounded-lg"
          >
            Email support@sssion.studio
          </a>
        </article>
      </main>
    </div>
  )
}
