'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface FollowButtonProps {
  creatorId: string
  size?: 'sm' | 'lg'
  /**
   * The creator's auth user_id. Used to hide the button on the viewer's
   * OWN studio page (you can't follow yourself). Everyone else — students
   * AND other creators — sees the button.
   */
  creatorUserId?: string | null
  /**
   * Pass these when the parent already knows the viewer (e.g. the discover
   * grid loads follows once for all cards). Leave undefined to self-load.
   * userId of null means signed out — clicking sends to student signup.
   */
  userId?: string | null
  initialFollowing?: boolean
  /**
   * Hero treatment: a filled accent button instead of the default outline.
   * Used on the studio page where Follow is the primary action.
   */
  hero?: boolean
}

export default function FollowButton({
  creatorId,
  size = 'lg',
  creatorUserId,
  userId: userIdProp,
  initialFollowing,
  hero = false,
}: FollowButtonProps) {
  const selfLoad = userIdProp === undefined
  const [userId, setUserId] = useState<string | null>(userIdProp ?? null)
  const [isFollowing, setIsFollowing] = useState(initialFollowing ?? false)
  const [isReady, setIsReady] = useState(!selfLoad)
  const [isHidden, setIsHidden] = useState(false)

  // Keep in sync when the parent supplies viewer state
  useEffect(() => {
    if (!selfLoad) {
      setUserId(userIdProp ?? null)
      setIsFollowing(initialFollowing ?? false)
      setIsReady(true)
    }
  }, [selfLoad, userIdProp, initialFollowing])

  useEffect(() => {
    if (!selfLoad) return

    const load = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          setUserId(null)
          setIsReady(true)
          return
        }
        // Hide only on the viewer's OWN studio page — you can't follow
        // yourself. Everyone else (students AND other creators) can follow.
        if (creatorUserId && session.user.id === creatorUserId) {
          setIsHidden(true)
          return
        }

        setUserId(session.user.id)

        const { data: follow } = await supabase
          .from('follows')
          .select('id')
          .eq('follower_id', session.user.id)
          .eq('creator_id', creatorId)
          .maybeSingle()

        setIsFollowing(!!follow)
        setIsReady(true)
      } catch (err) {
        console.error('Error loading follow state:', err)
        setIsHidden(true)
      }
    }

    load()
  }, [selfLoad, creatorId, creatorUserId])

  const handleClick = async (e: React.MouseEvent) => {
    // Cards wrap this button in a Link — don't navigate
    e.preventDefault()
    e.stopPropagation()

    if (!userId) {
      window.location.assign('/student-signup')
      return
    }

    const wasFollowing = isFollowing
    setIsFollowing(!wasFollowing)

    try {
      if (wasFollowing) {
        const { error } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', userId)
          .eq('creator_id', creatorId)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('follows')
          .insert({ follower_id: userId, creator_id: creatorId })
        if (error) throw error
      }
    } catch (err) {
      console.error('Error toggling follow:', err)
      setIsFollowing(wasFollowing)
    }
  }

  if (isHidden || !isReady) return null

  const sizeClasses = hero
    ? 'px-10 py-4 text-base'
    : size === 'lg'
      ? 'px-8 py-2.5 text-sm'
      : 'px-3.5 py-1.5 text-xs'

  const colorClasses = isFollowing
    ? 'bg-white/10 text-white hover:bg-white/15'
    : hero
      ? 'bg-[#B76E79] text-white hover:bg-[#a05f69]'
      : 'border border-[#B76E79] text-[#B76E79] hover:bg-[#B76E79]/10'

  return (
    <button
      onClick={handleClick}
      className={`${sizeClasses} ${colorClasses} font-semibold rounded-full transition-colors`}
    >
      {isFollowing ? 'Following ✓' : 'Follow'}
    </button>
  )
}
