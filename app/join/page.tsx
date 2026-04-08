'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

type Step = 'invite' | 'account' | 'welcome'

export default function JoinPage() {
  const [step, setStep] = useState<Step>('invite')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Step 1: Invite Code
  const [inviteCode, setInviteCode] = useState('')
  const [validatedCodeId, setValidatedCodeId] = useState<string | null>(null)

  // Step 2: Account Details
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle')

  // Step 3: Welcome
  const [createdUsername, setCreatedUsername] = useState('')

  // Validate invite code
  const handleValidateCode = async () => {
    if (!inviteCode.trim()) {
      setError('Please enter an invite code')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { data, error: queryError } = await supabase
        .from('invite_codes')
        .select('id')
        .eq('code', inviteCode.trim().toUpperCase())
        .eq('is_active', true)
        .is('used_by', null)
        .maybeSingle()

      if (queryError) throw queryError

      if (!data) {
        setError('Invalid or already used invite code')
        return
      }

      setValidatedCodeId(data.id)
      setStep('account')
    } catch (err) {
      console.error('Error validating code:', err)
      setError('Error validating code. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Check username availability
  const checkUsername = async (value: string) => {
    if (!value || value.length < 3) {
      setUsernameStatus('idle')
      return
    }

    setUsernameStatus('checking')

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', value.toLowerCase())
        .maybeSingle()

      if (error) throw error

      setUsernameStatus(data ? 'taken' : 'available')
    } catch (err) {
      console.error('Error checking username:', err)
      setUsernameStatus('idle')
    }
  }

  // Handle username input
  const handleUsernameChange = (value: string) => {
    // Only allow lowercase letters, numbers, and underscores
    const sanitized = value.toLowerCase().replace(/[^a-z0-9_]/g, '')
    setUsername(sanitized)
  }

  // Create account
  const handleCreateAccount = async () => {
    if (!fullName.trim()) {
      setError('Please enter your name')
      return
    }
    if (!email.trim()) {
      setError('Please enter your email')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (!username || username.length < 3) {
      setError('Username must be at least 3 characters')
      return
    }
    if (usernameStatus === 'taken') {
      setError('Username is already taken')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // 1. Create the account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            role: 'creator',
            full_name: fullName.trim(),
          },
        },
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('Account creation failed')

      const userId = authData.user.id

      // 2. Wait a moment for the trigger to create profile + creator rows
      await new Promise(resolve => setTimeout(resolve, 1500))

      // 3. Update the profile with the chosen username
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ username: username.toLowerCase() })
        .eq('id', userId)

      if (profileError) {
        console.error('Error updating username:', profileError)
        // Continue anyway - user can update username later
      }

      // 4. Claim the invite code
      if (validatedCodeId) {
        const { error: claimError } = await supabase
          .from('invite_codes')
          .update({
            used_by: userId,
            used_at: new Date().toISOString(),
          })
          .eq('id', validatedCodeId)

        if (claimError) {
          console.error('Error claiming invite code:', claimError)
          // Continue anyway - code claim is not critical
        }
      }

      setCreatedUsername(username.toLowerCase())
      setStep('welcome')
    } catch (err: any) {
      console.error('Error creating account:', err)
      setError(err.message || 'Error creating account. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Copy studio link
  const [copied, setCopied] = useState(false)
  const copyStudioLink = () => {
    navigator.clipboard.writeText(`https://sssion.studio/${createdUsername}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Progress Indicator */}
      <div className="flex items-center gap-3 mb-12">
        {['invite', 'account', 'welcome'].map((s, i) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                step === s
                  ? 'bg-[#B76E79] text-white'
                  : ['invite', 'account', 'welcome'].indexOf(step) > i
                  ? 'bg-[#B76E79]/30 text-[#B76E79]'
                  : 'bg-white/10 text-white/40'
              }`}
            >
              {i + 1}
            </div>
            {i < 2 && (
              <div
                className={`w-12 h-0.5 mx-2 ${
                  ['invite', 'account', 'welcome'].indexOf(step) > i
                    ? 'bg-[#B76E79]/50'
                    : 'bg-white/10'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="w-full max-w-md">
        {/* Step 1: Invite Code */}
        {step === 'invite' && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                Join Sssion as a Creator
              </h1>
              <p className="text-white/60">
                Enter your invite code to get started
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#B76E79] mb-2">
                  Invite Code
                </label>
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  placeholder="ENTER CODE"
                  className="w-full px-4 py-4 bg-[#16162a] border-2 border-[#B76E79]/50 rounded-xl text-white text-center text-xl font-semibold tracking-widest placeholder:text-white/30 focus:outline-none focus:border-[#B76E79] transition-colors"
                  autoFocus
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}

              <button
                onClick={handleValidateCode}
                disabled={isLoading}
                className="w-full py-4 bg-[#B76E79] text-white font-semibold rounded-xl hover:bg-[#a05f69] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Validating...' : 'Continue'}
              </button>
            </div>

            <div className="space-y-2 text-center text-white/40 text-sm">
              <p>
                Don&apos;t have a code?{' '}
                <a href="mailto:hello@sssion.com" className="text-[#B76E79] hover:underline">
                  Contact us to apply
                </a>
              </p>
              <p>
                Already have an account?{' '}
                <a href="/signin" className="text-[#B76E79] hover:underline">
                  Sign in
                </a>
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Create Account */}
        {step === 'account' && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                Create Your Account
              </h1>
              <p className="text-white/60">
                Set up your creator profile
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-3 bg-[#16162a] border border-white/20 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#B76E79] transition-colors"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 bg-[#16162a] border border-white/20 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#B76E79] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full px-4 py-3 bg-[#16162a] border border-white/20 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#B76E79] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Username
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                    sssion.studio/
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    onBlur={() => checkUsername(username)}
                    placeholder="yourname"
                    className="w-full pl-[120px] pr-12 py-3 bg-[#16162a] border border-white/20 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#B76E79] transition-colors"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2">
                    {usernameStatus === 'checking' && (
                      <svg className="w-5 h-5 text-white/40 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    )}
                    {usernameStatus === 'available' && (
                      <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {usernameStatus === 'taken' && (
                      <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </span>
                </div>
                {usernameStatus === 'taken' && (
                  <p className="text-red-400 text-xs mt-1">This username is already taken</p>
                )}
              </div>

              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}

              <button
                onClick={handleCreateAccount}
                disabled={isLoading || usernameStatus === 'taken'}
                className="w-full py-4 bg-[#B76E79] text-white font-semibold rounded-xl hover:bg-[#a05f69] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Welcome */}
        {step === 'welcome' && (
          <div className="space-y-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#B76E79]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-[#B76E79]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                Welcome to Sssion, {fullName.split(' ')[0]}!
              </h1>
              <p className="text-white/60">
                Your creator account is ready
              </p>
            </div>

            {/* Email Verification Notice */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="font-semibold text-amber-400 mb-1">Check your email</p>
                  <p className="text-white/60 text-sm">
                    We sent a verification link to <span className="text-white">{email}</span>.
                    Please verify your email before signing in to your dashboard.
                  </p>
                </div>
              </div>
            </div>

            {/* Studio Link */}
            <div className="bg-[#16162a] rounded-xl p-5 border border-white/10">
              <p className="text-sm text-white/60 mb-2">Your studio link</p>
              <div className="flex items-center gap-3">
                <code className="flex-1 text-[#B76E79] font-mono">
                  sssion.studio/{createdUsername}
                </code>
                <button
                  onClick={copyStudioLink}
                  className="px-4 py-2 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Download App */}
            <div className="bg-[#16162a] rounded-xl p-5 border border-white/10">
              <p className="text-sm text-white/60 mb-3">Download the app to start building your studio</p>
              <a
                href="https://testflight.apple.com/join/PLACEHOLDER"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-[#B76E79] text-white font-semibold rounded-xl hover:bg-[#a05f69] transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Download on TestFlight
              </a>
              <p className="text-xs text-white/40 text-center mt-3">
                Coming soon to the App Store
              </p>
            </div>

            {/* Quick Start Checklist */}
            <div className="bg-[#16162a] rounded-xl p-5 border border-white/10">
              <p className="text-sm font-medium mb-4">Quick start checklist</p>
              <div className="space-y-3">
                {[
                  'Upload a profile photo',
                  'Write your studio description',
                  'Set your payment links',
                  'Upload your first video',
                  'Share your studio link',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-white/60">
                    <div className="w-5 h-5 rounded-full border border-white/30 flex items-center justify-center">
                      <span className="text-xs">{i + 1}</span>
                    </div>
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sign In Link */}
            <div className="text-center">
              <p className="text-white/40 text-sm">
                Verified your email?{' '}
                <a href="/signin" className="text-[#B76E79] hover:underline font-medium">
                  Sign in to your dashboard
                </a>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Back to home link */}
      <a
        href="/"
        className="mt-12 text-white/40 text-sm hover:text-white/60 transition-colors"
      >
        &larr; Back to sssion.studio
      </a>
    </div>
  )
}
