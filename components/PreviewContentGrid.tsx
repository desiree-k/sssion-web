'use client'

import { useState } from 'react'
import VideoPlayerModal from './VideoPlayerModal'

interface ContentItem {
  id: string
  title: string
  mux_playback_id: string | null
  difficulty_level: string | null
}

interface PreviewContentGridProps {
  contentItems: ContentItem[]
  creatorName: string
}

export default function PreviewContentGrid({ contentItems, creatorName }: PreviewContentGridProps) {
  const [selectedVideo, setSelectedVideo] = useState<ContentItem | null>(null)

  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {contentItems.map((item) => (
          <button
            key={item.id}
            onClick={() => item.mux_playback_id && setSelectedVideo(item)}
            className="relative aspect-video rounded-xl overflow-hidden bg-[#16162a] text-left group cursor-pointer"
          >
            {item.mux_playback_id ? (
              <img
                src={`https://image.mux.com/${item.mux_playback_id}/thumbnail.jpg`}
                alt={item.title}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#B76E79]/20 to-[#1A1A2E]">
                <svg className="w-12 h-12 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            {/* Difficulty badge */}
            {item.difficulty_level && (
              <div className="absolute top-2 right-2">
                <span className="px-2 py-1 bg-black/50 backdrop-blur-sm text-white/90 text-xs rounded-full capitalize">
                  {item.difficulty_level.replace('_', ' ')}
                </span>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p className="text-white text-sm font-medium truncate">{item.title}</p>
            </div>
            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
                <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Video Player Modal */}
      {selectedVideo && selectedVideo.mux_playback_id && (
        <VideoPlayerModal
          isOpen={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
          muxPlaybackId={selectedVideo.mux_playback_id}
          title={selectedVideo.title}
          difficultyLevel={selectedVideo.difficulty_level}
          creatorName={creatorName}
        />
      )}
    </>
  )
}
