'use client'

import { useEffect, useRef } from 'react'
import Hls from 'hls.js'

interface HlsVideoProps extends Omit<React.VideoHTMLAttributes<HTMLVideoElement>, 'src'> {
  src: string
  /** Pass a ref to drive the underlying <video> element (seek, listeners, etc.) */
  videoRef?: React.RefObject<HTMLVideoElement | null>
}

export default function HlsVideo({ src, videoRef, ...videoProps }: HlsVideoProps) {
  const internalRef = useRef<HTMLVideoElement | null>(null)
  const ref = videoRef ?? internalRef

  useEffect(() => {
    const video = ref.current
    if (!video || !src) return

    if (src.includes('.m3u8') && Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource(src)
      hls.attachMedia(video)
      return () => hls.destroy()
    }

    // Safari has native HLS support; non-HLS URLs play directly
    video.src = src
    return () => {
      video.removeAttribute('src')
      video.load()
    }
  }, [src, ref])

  // x-webkit-airplay surfaces the AirPlay button in Safari's video controls
  return <video ref={ref} playsInline x-webkit-airplay="allow" {...videoProps} />
}
