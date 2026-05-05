'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

async function adminPost(action: string, payload?: unknown) {
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token ?? ''
  const res = await fetch('/api/admin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ action, payload }),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

type Audience = 'creators' | 'students' | 'all'

export default function AnnouncementsPage() {
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [audience, setAudience] = useState<Audience>('creators')
  const [preview, setPreview] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [result, setResult] = useState<{ sent: number; failures: string[]; total: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) {
      setError('Subject and body are required')
      return
    }
    setIsSending(true)
    setError(null)
    setResult(null)
    try {
      const res = await adminPost('send_announcement', { subject, body, audience })
      setResult(res)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to send')
    } finally {
      setIsSending(false)
    }
  }

  const audienceLabel = { creators: 'All Creators', students: 'All Students', all: 'Everyone' }[audience]

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Announcements</h1>
        <p className="text-white/40 text-sm mt-1">Send email announcements to creators or students</p>
      </div>

      {/* Success result */}
      {result && (
        <div className={`rounded-xl border px-5 py-4 space-y-1 ${
          result.failures.length > 0
            ? 'bg-yellow-500/8 border-yellow-500/25'
            : 'bg-green-500/8 border-green-500/25'
        }`}>
          <p className={`text-sm font-medium ${result.failures.length > 0 ? 'text-yellow-400' : 'text-green-400'}`}>
            ✓ Sent to {result.sent} of {result.total} recipients
          </p>
          {result.failures.length > 0 && (
            <div>
              <p className="text-yellow-400/70 text-xs mb-1">Failed to deliver to:</p>
              {result.failures.map(f => (
                <p key={f} className="text-yellow-400/50 text-xs font-mono">{f}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="bg-[#111127] rounded-xl border border-white/6 overflow-hidden">
        {/* Compose / Preview toggle */}
        <div className="flex border-b border-white/6">
          <button
            onClick={() => setPreview(false)}
            className={`px-5 py-3 text-sm font-medium transition-colors ${
              !preview ? 'text-white border-b-2 border-[#B76E79] -mb-px' : 'text-white/40 hover:text-white'
            }`}
          >
            Compose
          </button>
          <button
            onClick={() => setPreview(true)}
            className={`px-5 py-3 text-sm font-medium transition-colors ${
              preview ? 'text-white border-b-2 border-[#B76E79] -mb-px' : 'text-white/40 hover:text-white'
            }`}
          >
            Preview
          </button>
        </div>

        {!preview ? (
          <div className="p-6 space-y-5">
            {/* Audience */}
            <div>
              <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Send To</label>
              <div className="flex gap-2">
                {(['creators', 'students', 'all'] as Audience[]).map(a => (
                  <button
                    key={a}
                    onClick={() => setAudience(a)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                      audience === a
                        ? 'bg-[#B76E79]/20 border-[#B76E79]/50 text-[#B76E79]'
                        : 'border-white/10 text-white/50 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {a === 'all' ? 'Everyone' : a === 'creators' ? 'Creators' : 'Students'}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="e.g. New features in Sssion"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#B76E79]/50"
              />
            </div>

            {/* Body */}
            <div>
              <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">
                Body <span className="normal-case text-white/25">(HTML supported)</span>
              </label>
              <textarea
                value={body}
                onChange={e => setBody(e.target.value)}
                placeholder={`<p>Hi there,</p>\n<p>We have some exciting updates to share...</p>`}
                rows={12}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#B76E79]/50 font-mono resize-y"
              />
              <p className="text-white/25 text-xs mt-1.5">
                Use HTML tags for formatting: &lt;p&gt;, &lt;b&gt;, &lt;a href="..."&gt;, &lt;br&gt;, &lt;ul&gt;&lt;li&gt;, etc.
              </p>
            </div>
          </div>
        ) : (
          /* Email preview */
          <div className="p-6">
            <div className="bg-white rounded-xl overflow-hidden text-gray-900 max-w-xl mx-auto shadow-xl">
              {/* Email header */}
              <div className="bg-black px-6 py-5 text-center">
                <span className="text-[#B76E79] text-3xl font-light">S</span>
                <p className="text-white/60 text-xs tracking-widest mt-1">SSSION</p>
              </div>
              <div className="px-8 py-6">
                <p className="text-xs text-gray-400 mb-1">Subject</p>
                <p className="font-semibold text-lg text-gray-900 mb-6 pb-4 border-b border-gray-100">
                  {subject || <span className="text-gray-300 font-normal italic">No subject</span>}
                </p>
                {body ? (
                  <div
                    className="prose prose-sm max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: body }}
                  />
                ) : (
                  <p className="text-gray-300 italic text-sm">No body content</p>
                )}
              </div>
              <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-center">
                <p className="text-gray-400 text-xs">Sssion · Movement. Mastered.</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer / Send */}
        <div className="px-6 py-4 border-t border-white/6 flex items-center justify-between gap-4">
          <p className="text-white/30 text-sm">
            Will be sent to: <span className="text-white/60 font-medium">{audienceLabel}</span>
          </p>
          <button
            onClick={handleSend}
            disabled={isSending || !subject.trim() || !body.trim()}
            className="px-5 py-2.5 bg-[#B76E79] text-white text-sm font-medium rounded-lg hover:bg-[#a55f69] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {isSending ? 'Sending…' : `Send to ${audienceLabel}`}
          </button>
        </div>
      </div>
    </div>
  )
}
