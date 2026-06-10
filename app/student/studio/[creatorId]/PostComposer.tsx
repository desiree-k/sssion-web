'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Post, PostAuthor } from './CommunityTab'

interface PostComposerProps {
  creatorId: string
  userId: string
  onPostCreated: (post: Post) => void
}

export default function PostComposer({ creatorId, userId, onPostCreated }: PostComposerProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [body, setBody] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Resolved studio info (same pattern as the mobile app: the route param can
  // be either creators.id or the creator's user_id)
  const [resolvedStudioId, setResolvedStudioId] = useState<string | null>(null)
  const [creatorUserId, setCreatorUserId] = useState<string | null>(null)
  const [myProfile, setMyProfile] = useState<PostAuthor | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        // Look up by creator id first, then by user id
        let { data: creatorLookup } = await supabase
          .from('creators')
          .select('id, user_id')
          .eq('id', creatorId)
          .maybeSingle()
        if (!creatorLookup) {
          const { data: byUserId } = await supabase
            .from('creators')
            .select('id, user_id')
            .eq('user_id', creatorId)
            .maybeSingle()
          creatorLookup = byUserId
        }

        setResolvedStudioId(creatorLookup?.id ?? creatorId)
        setCreatorUserId(creatorLookup?.user_id ?? null)

        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, profile_image_url')
          .eq('id', userId)
          .maybeSingle()
        setMyProfile(profile ?? null)
      } catch (err) {
        console.error('Error loading composer data:', err)
      }
    }

    load()
  }, [creatorId, userId])

  useEffect(() => {
    if (!selectedImage) {
      setPreviewUrl(null)
      return
    }
    const url = URL.createObjectURL(selectedImage)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [selectedImage])

  const resetForm = () => {
    setBody('')
    setSelectedImage(null)
    setError(null)
    setIsExpanded(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file')
      return
    }
    setError(null)
    setSelectedImage(file)
  }

  const handleSubmit = async () => {
    const trimmedBody = body.trim()
    if (!trimmedBody && !selectedImage) {
      setError('Write something or add an image first')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const studioId = resolvedStudioId ?? creatorId
      const authorRole = creatorUserId === userId ? 'creator' : 'student'

      const mediaUrls: string[] = []
      let mediaType: string | null = null

      if (selectedImage) {
        const extension = selectedImage.name.split('.').pop()?.toLowerCase() || 'jpg'
        const filePath = `community/${userId}/${Date.now()}.${extension}`

        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, selectedImage, {
            contentType: selectedImage.type || 'image/jpeg',
          })
        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(filePath)
        mediaUrls.push(publicUrl)
        mediaType = 'image'
      }

      const { data: inserted, error: insertError } = await supabase
        .from('community_posts')
        .insert({
          studio_id: studioId,
          author_id: userId,
          author_role: authorRole,
          body: trimmedBody,
          media_urls: mediaUrls,
          ...(mediaType ? { media_type: mediaType } : {}),
        })
        .select('*')
        .maybeSingle()

      if (insertError) throw insertError
      if (!inserted) throw new Error('Post was not returned after insert')

      onPostCreated({
        id: inserted.id as string,
        author_id: userId,
        author_role: authorRole,
        body: trimmedBody,
        media_type: mediaType,
        media_urls: mediaUrls,
        created_at: (inserted.created_at as string) || new Date().toISOString(),
        author: myProfile,
        like_count: 0,
        is_liked_by_user: false,
        comment_count: 0,
      })
      resetForm()
    } catch (err) {
      console.error('Error creating post:', err)
      setError('Could not create your post. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full flex items-center justify-center gap-2 py-3 bg-[#16162a] border border-white/10 rounded-2xl text-white/60 hover:text-white hover:border-[#B76E79]/40 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        New Post
      </button>
    )
  }

  return (
    <div className="bg-[#16162a] border border-white/10 rounded-2xl p-5 space-y-4">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Share something with the studio..."
        rows={3}
        className="w-full px-4 py-3 bg-[#1A1A2E] border border-white/15 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#B76E79] transition-colors resize-y"
        autoFocus
      />

      {previewUrl && (
        <div className="relative inline-block">
          <img src={previewUrl} alt="Preview" className="max-h-48 rounded-xl" />
          <button
            onClick={() => {
              setSelectedImage(null)
              if (fileInputRef.current) fileInputRef.current.value = ''
            }}
            className="absolute top-2 right-2 w-7 h-7 bg-black/70 rounded-full flex items-center justify-center text-white/80 hover:text-white"
            aria-label="Remove image"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex items-center justify-between">
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Add Image
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={resetForm}
            disabled={isSubmitting}
            className="text-sm text-white/40 hover:text-white/70 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || (!body.trim() && !selectedImage)}
            className="px-6 py-2 bg-[#B76E79] text-white text-sm font-semibold rounded-full hover:bg-[#a05f69] transition-colors disabled:opacity-40"
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  )
}
