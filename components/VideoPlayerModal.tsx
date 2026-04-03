'use client'

import { useEffect, useRef, useCallback } from 'react'
import Hls from 'hls.js'

interface VideoPlayerModalProps {
  isOpen: boolean
  onClose: () => void
  muxPlaybackId: string
  title: string
  difficultyLevel: string | null
  creatorName: string
}

export default function VideoPlayerModal({
  isOpen,
  onClose,
  muxPlaybackId,
  title,
  difficultyLevel,
  creatorName,
}: VideoPlayerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<Hls | null>(null)

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, handleKeyDown])

  useEffect(() => {
    if (!isOpen || !videoRef.current || !muxPlaybackId) return

    const video = videoRef.current
    const url = `https://stream.mux.com/${muxPlaybackId}.m3u8`

    if (Hls.isSupported()) {
      const hls = new Hls()
      hlsRef.current = hls
      hls.loadSource(url)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {
          // Autoplay was prevented, user needs to interact
        })
      })
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari has native HLS support
      video.src = url
      video.addEventListener('loadedmetadata', () => {
        video.play().catch(() => {
          // Autoplay was prevented
        })
      })
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }
    }
  }, [isOpen, muxPlaybackId])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2 text-white/70 hover:text-white transition-colors"
        aria-label="Close"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Modal content */}
      <div
        className="w-full max-w-4xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Video player */}
        <div className="relative aspect-video bg-black rounded-t-xl overflow-hidden">
          <video
            ref={videoRef}
            className="w-full h-full"
            controls
            playsInline
            poster={`https://image.mux.com/${muxPlaybackId}/thumbnail.jpg`}
          />
        </div>

        {/* Info panel below video */}
        <div className="bg-[#1A1A2E] rounded-b-xl p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h3 className="text-xl font-semibold text-white">{title}</h3>
            {difficultyLevel && (
              <span className="px-3 py-1 bg-[#B76E79]/20 text-[#B76E79] text-sm rounded-full capitalize whitespace-nowrap">
                {difficultyLevel.replace('_', ' ')}
              </span>
            )}
          </div>

          <div className="border-t border-white/10 pt-4">
            <p className="text-white/70 mb-4">
              Want to see more? Join {creatorName}&apos;s Studio
            </p>
            <a
              href="#"
              className="inline-block px-6 py-3 bg-[#B76E79] text-white font-semibold rounded-full hover:bg-[#a05f69] transition-colors"
            >
              Download Sssion
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
