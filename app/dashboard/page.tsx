'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface UserData {
  displayName: string
  username: string | null
  studentCount: number
  videoCount: number
  pendingRequestsCount: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    checkAuthAndLoadData()
  }, [])

  const checkAuthAndLoadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/signin')
        return
      }

      // Get profile data
      let { data: profile } = await supabase
        .from('profiles')
        .select('username, full_name, display_name')
        .eq('id', user.id)
        .single()

      // Check for pending username from signup flow
      if (!profile?.username) {
        const pendingUsername = localStorage.getItem('pending_username')
        if (pendingUsername) {
          console.log('Found pending username, applying:', pendingUsername)
          const { data: updatedProfile, error: updateError } = await supabase
            .from('profiles')
            .update({ username: pendingUsername })
            .eq('id', user.id)
            .select('username, full_name, display_name')
            .single()

          if (updatedProfile) {
            console.log('Username updated successfully:', updatedProfile)
            profile = updatedProfile
            localStorage.removeItem('pending_username')
          } else {
            console.error('Failed to update username:', updateError)
          }
        }
      } else {
        // Clear any stale pending username if user already has one
        localStorage.removeItem('pending_username')
      }

      // Get creator data
      const { data: creator } = await supabase
        .from('creators')
        .select('id, display_name')
        .eq('user_id', user.id)
        .single()

      if (!creator) {
        // User is not a creator
        router.push('/signin')
        return
      }

      // Get student count
      const { count: studentCount } = await supabase
        .from('studio_access')
        .select('*', { count: 'exact', head: true })
        .eq('creator_id', creator.id)
        .eq('status', 'approved')

      // Get video count
      const { count: videoCount } = await supabase
        .from('content_items')
        .select('*', { count: 'exact', head: true })
        .eq('creator_id', creator.id)

      // Get pending requests count
      const { count: pendingRequestsCount } = await supabase
        .from('studio_access')
        .select('*', { count: 'exact', head: true })
        .eq('creator_id', creator.id)
        .eq('status', 'pending')

      setUserData({
        displayName: creator.display_name || profile?.full_name || profile?.display_name || 'Creator',
        username: profile?.username || null,
        studentCount: studentCount || 0,
        videoCount: videoCount || 0,
        pendingRequestsCount: pendingRequestsCount || 0,
      })
    } catch (err) {
      console.error('Error loading dashboard:', err)
      router.push('/signin')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const copyStudioLink = () => {
    if (userData?.username) {
      navigator.clipboard.writeText(`https://sssion.studio/${userData.username}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#B76E79] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!userData) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="py-6 px-6 border-b border-white/10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <a href="/" className="text-2xl font-bold text-[#B76E79]">
            Sssion
          </a>
          <button
            onClick={handleSignOut}
            className="text-white/60 hover:text-white text-sm transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-12 px-6">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Welcome */}
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome back, {userData.displayName}
            </h1>
            <p className="text-white/60">
              Your creator dashboard
            </p>
          </div>

          {/* Studio Link */}
          {userData.username ? (
            <div className="bg-[#16162a] rounded-2xl p-6 border border-white/10">
              <p className="text-sm text-white/60 mb-3">Your studio link</p>
              <div className="flex items-center gap-3">
                <code className="flex-1 text-[#B76E79] font-mono text-lg">
                  sssion.studio/{userData.username}
                </code>
                <button
                  onClick={copyStudioLink}
                  className="px-5 py-2.5 bg-[#B76E79] text-white font-medium rounded-xl hover:bg-[#a05f69] transition-colors"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-[#16162a] rounded-2xl p-6 border border-white/10">
              <p className="text-white/60 text-center">
                Set up your username in the app to get your studio link
              </p>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#16162a] rounded-2xl p-6 border border-white/10 text-center">
              <p className="text-3xl font-bold text-[#B76E79]">{userData.studentCount}</p>
              <p className="text-white/60 text-sm mt-1">Students</p>
            </div>
            <div className="bg-[#16162a] rounded-2xl p-6 border border-white/10 text-center">
              <p className="text-3xl font-bold text-[#B76E79]">{userData.videoCount}</p>
              <p className="text-white/60 text-sm mt-1">Videos</p>
            </div>
            <div className="bg-[#16162a] rounded-2xl p-6 border border-white/10 text-center">
              <p className="text-3xl font-bold text-[#B76E79]">{userData.pendingRequestsCount}</p>
              <p className="text-white/60 text-sm mt-1">Pending</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            {userData.username && (
              <a
                href={`/${userData.username}`}
                className="flex items-center justify-between w-full p-5 bg-[#16162a] rounded-2xl border border-white/10 hover:border-[#B76E79]/50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#B76E79]/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#B76E79]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-white">View My Studio Page</p>
                    <p className="text-sm text-white/50">See what students see</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-white/40 group-hover:text-[#B76E79] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            )}
          </div>

          {/* Download App */}
          <div className="bg-gradient-to-br from-[#B76E79]/20 to-[#B76E79]/5 rounded-2xl p-8 border border-[#B76E79]/30 text-center">
            <h3 className="text-xl font-semibold mb-2">Manage Your Studio</h3>
            <p className="text-white/60 mb-6">
              Upload videos, approve students, and engage with your community in the Sssion app.
            </p>
            <a
              href="https://testflight.apple.com/join/PLACEHOLDER"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#B76E79] text-white font-semibold rounded-xl hover:bg-[#a05f69] transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Download Sssion
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <p className="text-white/40 text-sm">
            &copy; 2026 Sssion
          </p>
          <div className="flex gap-6">
            <a href="/" className="text-white/40 hover:text-white/60 text-sm transition-colors">
              Home
            </a>
            <a href="/discover" className="text-white/40 hover:text-white/60 text-sm transition-colors">
              Discover
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
