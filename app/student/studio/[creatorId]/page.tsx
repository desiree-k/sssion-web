'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import CommunityTab from './CommunityTab'
import StudioTab from './StudioTab'

interface CreatorInfo {
  id: string
  display_name: string | null
  profile: {
    username: string | null
    full_name: string | null
    profile_image_url: string | null
  } | null
}

type Tab = 'community' | 'studio'

export default function StudentStudioPage() {
  const params = useParams<{ creatorId: string }>()
  const creatorId = params.creatorId
  const router = useRouter()

  const [creator, setCreator] = useState<CreatorInfo | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('community')

  useEffect(() => {
    const load = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return // student layout handles the sign-in redirect

        const { data: creatorData } = await supabase
          .from('creators')
          .select('id, display_name, profile:profiles!user_id(username, full_name, profile_image_url)')
          .eq('id', creatorId)
          .maybeSingle()

        if (!creatorData) {
          router.replace('/student/dashboard')
          return
        }

        const profile = Array.isArray(creatorData.profile)
          ? creatorData.profile[0]
          : creatorData.profile

        // Approved access required — otherwise send to the public studio page
        const { data: access } = await supabase
          .from('studio_access')
          .select('status')
          .eq('student_id', user.id)
          .eq('creator_id', creatorId)
          .maybeSingle()

        if (access?.status !== 'approved') {
          router.replace(`/${profile?.username || creatorId}`)
          return
        }

        setUserId(user.id)
        setCreator({ ...creatorData, profile: profile ?? null })
      } catch (err) {
        console.error('Error loading studio:', err)
        router.replace('/student/dashboard')
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [creatorId, router])

  if (isLoading || !creator || !userId) {
    return (
      <div className="py-24 flex justify-center">
        <div className="w-10 h-10 border-2 border-[#B76E79] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const name = creator.display_name || creator.profile?.full_name || 'Studio'
  const imageUrl = creator.profile?.profile_image_url

  return (
    <main className="pb-16">
      {/* Studio header */}
      <div className="px-6 pt-8 pb-6 bg-gradient-to-b from-[#B76E79]/15 to-transparent">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/student/dashboard"
            className="inline-flex items-center gap-2 text-[#F4F1EA]/50 hover:text-[#F4F1EA] text-sm transition-colors mb-6"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            My Studios
          </Link>

          <div className="flex items-center gap-4">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={name}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#B76E79]"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#B76E79]/20 border-2 border-[#B76E79] flex items-center justify-center">
                <span className="text-2xl font-bold text-[#B76E79]">
                  {name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <h1 className="text-2xl md:text-3xl font-bold">{name}</h1>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 border-b border-[#2A2A30] sticky top-[65px] bg-[#0E0E12]/95 backdrop-blur z-30">
        <div className="max-w-4xl mx-auto flex gap-8">
          {(['community', 'studio'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 text-sm font-semibold border-b-2 -mb-px capitalize transition-colors ${
                activeTab === tab
                  ? 'border-[#B76E79] text-[#B76E79]'
                  : 'border-transparent text-[#F4F1EA]/50 hover:text-[#F4F1EA]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="px-6 pt-8">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'community' ? (
            <CommunityTab creatorId={creatorId} userId={userId} />
          ) : (
            <StudioTab creatorId={creatorId} userId={userId} />
          )}
        </div>
      </div>
    </main>
  )
}
