'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Stage = 'loading' | 'confirm' | 'done' | 'error'

function UnsubscribeInner() {
  const params = useSearchParams()
  const email = (params.get('email') || '').trim()
  const creatorId = params.get('creator')

  const [stage, setStage] = useState<Stage>('loading')
  const [creatorName, setCreatorName] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!email) {
      setStage('error')
      return
    }
    if (!creatorId) {
      setStage('confirm')
      return
    }
    supabase
      .from('creators')
      .select('display_name')
      .eq('id', creatorId)
      .maybeSingle()
      .then(({ data }) => {
        setCreatorName((data?.display_name as string) || null)
        setStage('confirm')
      })
  }, [email, creatorId])

  const label = creatorName ?? (creatorId ? 'this creator' : 'Sssion')

  const handleUnsubscribe = async () => {
    setIsSubmitting(true)
    const { error } = await supabase.rpc('unsubscribe_email_follower', {
      p_email: email,
      p_creator: creatorId,
    })
    setIsSubmitting(false)
    setStage(error ? 'error' : 'done')
  }

  return (
    <div className="min-h-screen bg-[#1A1A2E] flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <h1 className="text-4xl font-bold text-[#B76E79] mb-10">Sssion</h1>

        {stage === 'loading' && (
          <div className="w-10 h-10 border-2 border-[#B76E79] border-t-transparent rounded-full animate-spin mx-auto" />
        )}

        {stage === 'error' && (
          <>
            <h2 className="text-2xl font-semibold text-white mb-3">Something&apos;s not right</h2>
            <p className="text-white/60 leading-relaxed">
              This unsubscribe link looks incomplete or didn&apos;t work. Try the link from your
              most recent email, or reach out and we&apos;ll take care of it.
            </p>
          </>
        )}

        {stage === 'confirm' && (
          <>
            <h2 className="text-2xl font-semibold text-white mb-3">Unsubscribe from updates?</h2>
            <p className="text-white/60 leading-relaxed mb-8">
              {creatorId
                ? <>You&apos;ll stop receiving emails from <span className="text-white">{label}</span>.</>
                : <>You&apos;ll stop receiving Sssion email updates.</>}
            </p>
            <button
              onClick={handleUnsubscribe}
              disabled={isSubmitting}
              className="px-8 py-3.5 bg-[#B76E79] hover:bg-[#a05f69] disabled:opacity-60 text-white font-semibold rounded-full transition-colors"
            >
              {isSubmitting ? 'Unsubscribing...' : 'Unsubscribe'}
            </button>
          </>
        )}

        {stage === 'done' && (
          <>
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#B76E79]/20 flex items-center justify-center">
              <svg className="w-10 h-10 text-[#B76E79]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-white mb-3">You&apos;ve been unsubscribed</h2>
            <p className="text-white/60 leading-relaxed">
              {creatorId
                ? <>You won&apos;t receive updates from <span className="text-white">{label}</span> anymore. You&apos;re always welcome back. 🤍</>
                : <>You won&apos;t receive these updates anymore. You&apos;re always welcome back. 🤍</>}
            </p>
            <a href="https://sssion.studio" className="inline-block mt-8 text-[#B76E79] text-sm hover:underline">
              ← Back to Sssion
            </a>
          </>
        )}
      </div>
    </div>
  )
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#1A1A2E]" />}>
      <UnsubscribeInner />
    </Suspense>
  )
}
