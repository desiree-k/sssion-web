'use client'

import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { timeAgo, formatClassDate } from '@/lib/format'
import HlsVideo from '@/components/HlsVideo'
import PostComposer from './PostComposer'

export interface PostAuthor {
  full_name: string | null
  profile_image_url: string | null
}

export interface Post {
  id: string
  author_id: string | null
  author_role: string | null
  body: string
  media_type: string | null
  media_urls: string[] | null
  created_at: string
  author: PostAuthor | null
  like_count: number
  is_liked_by_user: boolean
  comment_count: number
}

interface LiveClassBody {
  type: string
  live_class_id?: string
  title?: string
  scheduled_at?: string
  platform?: string
  date_display?: string
  meeting_url?: string
}

interface Comment {
  id: string
  body: string
  created_at: string
  author: PostAuthor | null
}

function parseLiveClassBody(body: string): LiveClassBody | null {
  if (!body.trimStart().startsWith('{')) return null
  try {
    const data = JSON.parse(body)
    return data?.type === 'live_class' ? (data as LiveClassBody) : null
  } catch {
    return null
  }
}

function first<T>(value: T | T[] | null): T | null {
  if (Array.isArray(value)) return value[0] ?? null
  return value
}

function Avatar({ author, size = 'md' }: { author: PostAuthor | null; size?: 'sm' | 'md' }) {
  const name = author?.full_name || 'Member'
  const sizeClass = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm'

  if (author?.profile_image_url) {
    return (
      <img
        src={author.profile_image_url}
        alt={name}
        className={`${sizeClass} rounded-full object-cover flex-shrink-0`}
      />
    )
  }
  return (
    <div className={`${sizeClass} rounded-full bg-[#B76E79]/20 flex items-center justify-center flex-shrink-0`}>
      <span className="font-bold text-[#B76E79]">{name.charAt(0).toUpperCase()}</span>
    </div>
  )
}

function CommentSection({ postId, userId, onCommentAdded }: {
  postId: string
  userId: string
  onCommentAdded: () => void
}) {
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadComments = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('community_comments')
        .select('id, body, created_at, author:profiles!author_id(full_name, profile_image_url)')
        .eq('post_id', postId)
        .order('created_at', { ascending: true })

      setComments(
        (data || []).map((c) => ({
          id: c.id as string,
          body: c.body as string,
          created_at: c.created_at as string,
          author: first(c.author) as PostAuthor | null,
        }))
      )
    } catch (err) {
      console.error('Error loading comments:', err)
    } finally {
      setIsLoading(false)
    }
  }, [postId])

  useEffect(() => {
    loadComments()
  }, [loadComments])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const body = newComment.trim()
    if (!body || isSubmitting) return

    setIsSubmitting(true)
    try {
      const { error } = await supabase.from('community_comments').insert({
        post_id: postId,
        author_id: userId,
        body,
      })
      if (error) throw error

      setNewComment('')
      onCommentAdded()
      await loadComments()
    } catch (err) {
      console.error('Error posting comment:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="border-t border-white/10 pt-4 mt-4 space-y-4">
      {isLoading ? (
        <p className="text-white/40 text-sm">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-white/40 text-sm">No comments yet. Be the first!</p>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar author={comment.author} size="sm" />
              <div className="flex-1 min-w-0 bg-white/5 rounded-xl px-3 py-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-medium text-white truncate">
                    {comment.author?.full_name || 'Member'}
                  </span>
                  <span className="text-xs text-white/30 flex-shrink-0">
                    {timeAgo(comment.created_at)}
                  </span>
                </div>
                <p className="text-sm text-white/80 whitespace-pre-wrap break-words">
                  {comment.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 px-4 py-2 bg-[#1A1A2E] border border-white/15 rounded-full text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#B76E79] transition-colors"
        />
        <button
          type="submit"
          disabled={isSubmitting || !newComment.trim()}
          className="px-5 py-2 bg-[#B76E79] text-white text-sm font-semibold rounded-full hover:bg-[#a05f69] transition-colors disabled:opacity-40"
        >
          Post
        </button>
      </form>
    </div>
  )
}

function PostCard({ post, userId, onLikeToggle, onCommentAdded }: {
  post: Post
  userId: string
  onLikeToggle: (postId: string) => void
  onCommentAdded: (postId: string) => void
}) {
  const [showComments, setShowComments] = useState(false)
  const liveClass = parseLiveClassBody(post.body)
  const mediaUrls = post.media_urls || []

  return (
    <article className="bg-[#16162a] rounded-2xl border border-white/10 p-5">
      {/* Author row */}
      <div className="flex items-center gap-3 mb-4">
        <Avatar author={post.author} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white truncate">
              {post.author?.full_name || 'Member'}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${
                post.author_role === 'creator'
                  ? 'bg-[#B76E79]/20 text-[#B76E79]'
                  : 'bg-white/10 text-white/50'
              }`}
            >
              {post.author_role === 'creator' ? 'Creator' : 'Student'}
            </span>
          </div>
          <span className="text-xs text-white/40">{timeAgo(post.created_at)}</span>
        </div>
      </div>

      {/* Body */}
      {liveClass ? (
        <div className="bg-gradient-to-br from-[#B76E79]/20 to-[#B76E79]/5 border border-[#B76E79]/30 rounded-xl p-4 mb-4">
          <p className="text-[#B76E79] text-xs font-semibold uppercase tracking-widest mb-2">
            Live Class
          </p>
          <h3 className="text-lg font-bold text-white mb-1">
            {liveClass.title || 'Live Class'}
          </h3>
          <p className="text-white/60 text-sm mb-3">
            {liveClass.date_display ||
              (liveClass.scheduled_at ? formatClassDate(liveClass.scheduled_at) : '')}
            {liveClass.platform ? ` · ${liveClass.platform}` : ''}
          </p>
          {liveClass.meeting_url && (
            <a
              href={liveClass.meeting_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-5 py-2 bg-[#B76E79] text-white text-sm font-semibold rounded-full hover:bg-[#a05f69] transition-colors"
            >
              Join
            </a>
          )}
        </div>
      ) : (
        post.body && (
          <p className="text-white/85 whitespace-pre-wrap break-words mb-4">{post.body}</p>
        )
      )}

      {/* Media */}
      {!liveClass && post.media_type === 'image' && mediaUrls.length > 0 && (
        <div className="mb-4 -mx-1 space-y-2">
          {mediaUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt=""
              className="w-full max-h-[480px] object-cover rounded-xl"
            />
          ))}
        </div>
      )}

      {!liveClass && post.media_type === 'video' && mediaUrls.length > 0 && (
        <div className="mb-4 rounded-xl overflow-hidden bg-black">
          <HlsVideo
            src={mediaUrls[0]}
            controls
            preload="metadata"
            className="w-full max-h-[480px]"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-6 text-sm">
        <button
          onClick={() => onLikeToggle(post.id)}
          className={`flex items-center gap-1.5 transition-colors ${
            post.is_liked_by_user ? 'text-[#B76E79]' : 'text-white/50 hover:text-white'
          }`}
        >
          <svg
            className="w-5 h-5"
            fill={post.is_liked_by_user ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {post.like_count > 0 && <span>{post.like_count}</span>}
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          {post.comment_count > 0 ? <span>{post.comment_count}</span> : <span>Comment</span>}
        </button>
      </div>

      {showComments && (
        <CommentSection
          postId={post.id}
          userId={userId}
          onCommentAdded={() => onCommentAdded(post.id)}
        />
      )}
    </article>
  )
}

export default function CommunityTab({ creatorId, userId }: {
  creatorId: string
  userId: string
}) {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const { data: rawPosts, error } = await supabase
          .from('community_posts')
          .select('*, author:profiles!author_id(full_name, profile_image_url)')
          .eq('studio_id', creatorId)
          .order('created_at', { ascending: false })

        if (error) throw error

        // Hide live class posts whose class is already over
        const visible = (rawPosts || []).filter((post) => {
          const liveClass = parseLiveClassBody((post.body as string) || '')
          if (!liveClass?.scheduled_at) return true
          const scheduled = new Date(liveClass.scheduled_at)
          return isNaN(scheduled.getTime()) || scheduled.getTime() >= Date.now()
        })

        // Batch-fetch likes and comment counts
        const postIds = visible.map((p) => p.id as string)
        const likeCounts = new Map<string, number>()
        const likedByUser = new Set<string>()
        const commentCounts = new Map<string, number>()

        if (postIds.length > 0) {
          const [{ data: likes }, { data: comments }] = await Promise.all([
            supabase.from('community_likes').select('post_id, user_id').in('post_id', postIds),
            supabase.from('community_comments').select('post_id').in('post_id', postIds),
          ])

          for (const like of likes || []) {
            const pid = like.post_id as string
            likeCounts.set(pid, (likeCounts.get(pid) ?? 0) + 1)
            if (like.user_id === userId) likedByUser.add(pid)
          }
          for (const comment of comments || []) {
            const pid = comment.post_id as string
            commentCounts.set(pid, (commentCounts.get(pid) ?? 0) + 1)
          }
        }

        setPosts(
          visible.map((post) => ({
            id: post.id as string,
            author_id: post.author_id as string | null,
            author_role: post.author_role as string | null,
            body: (post.body as string) || '',
            media_type: post.media_type as string | null,
            media_urls: (post.media_urls as string[] | null) || [],
            created_at: post.created_at as string,
            author: first(post.author) as PostAuthor | null,
            like_count: likeCounts.get(post.id as string) ?? 0,
            is_liked_by_user: likedByUser.has(post.id as string),
            comment_count: commentCounts.get(post.id as string) ?? 0,
          }))
        )
      } catch (err) {
        console.error('Error loading posts:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadPosts()
  }, [creatorId, userId])

  const handleLikeToggle = async (postId: string) => {
    const post = posts.find((p) => p.id === postId)
    if (!post) return

    const wasLiked = post.is_liked_by_user

    // Optimistic update
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              is_liked_by_user: !wasLiked,
              like_count: p.like_count + (wasLiked ? -1 : 1),
            }
          : p
      )
    )

    try {
      if (wasLiked) {
        const { error } = await supabase
          .from('community_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', userId)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('community_likes')
          .insert({ post_id: postId, user_id: userId })
        if (error) throw error
      }
    } catch (err) {
      console.error('Error toggling like:', err)
      // Roll back on failure
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                is_liked_by_user: wasLiked,
                like_count: p.like_count + (wasLiked ? 1 : -1),
              }
            : p
        )
      )
    }
  }

  const handleCommentAdded = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comment_count: p.comment_count + 1 } : p
      )
    )
  }

  const handlePostCreated = (post: Post) => {
    setPosts((prev) => [post, ...prev])
  }

  if (isLoading) {
    return (
      <div className="py-16 flex justify-center">
        <div className="w-8 h-8 border-2 border-[#B76E79] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <PostComposer creatorId={creatorId} userId={userId} onPostCreated={handlePostCreated} />

      {posts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-white/50">No posts yet. Be the first to share something!</p>
        </div>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            userId={userId}
            onLikeToggle={handleLikeToggle}
            onCommentAdded={handleCommentAdded}
          />
        ))
      )}
    </div>
  )
}
