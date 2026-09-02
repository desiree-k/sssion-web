export const dynamic = 'force-dynamic'
export const revalidate = 0

import { supabase } from '@/lib/supabase'
import type { Metadata } from 'next'

// Embeds should not be indexed on their own — the canonical page is /[username].
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

const BASE = 'https://sssion.studio'
const ROSE_GOLD = '#B76E79'

interface EmbedData {
  displayName: string
  profileImageUrl: string | null
  specialties: string[]
  accent: string
  thumbnails: string[] // Mux thumbnail URLs
  profileUrl: string
}

async function getEmbedData(username: string): Promise<EmbedData | null> {
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, username, full_name, profile_image_url, role')
    .eq('username', username)
    .eq('role', 'creator')
    .single()

  if (!profile) return null

  const { data: creator } = await supabase
    .from('creators')
    .select('id, display_name, specialties, accent_color, is_visible')
    .eq('user_id', profile.id)
    .single()

  if (!creator || creator.is_visible === false) return null

  // Up to 3 public "preview moments" (clips shared to discovery).
  const { data: clips } = await supabase
    .from('content_items')
    .select('mux_playback_id')
    .eq('creator_id', creator.id)
    .eq('content_type', 'clip')
    .in('visibility', ['discovery', 'both'])
    .not('mux_playback_id', 'is', null)
    .order('created_at', { ascending: false })
    .limit(3)

  const thumbnails = (clips || [])
    .map((c) => c.mux_playback_id as string | null)
    .filter((id): id is string => !!id)
    .map((id) => `https://image.mux.com/${id}/thumbnail.jpg?width=200`)

  return {
    displayName: creator.display_name || profile.full_name || username,
    profileImageUrl: profile.profile_image_url ?? null,
    specialties: Array.isArray(creator.specialties) ? creator.specialties.slice(0, 4) : [],
    accent: creator.accent_color || ROSE_GOLD,
    thumbnails,
    profileUrl: `${BASE}/${username}`,
  }
}

const styles = `
  html, body { margin: 0; padding: 0; background: #0E0E12; }
  * { box-sizing: border-box; }
  .ss-embed {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    background: #0E0E12;
    color: #fff;
    border-radius: 16px;
    padding: 18px;
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
    overflow: hidden;
  }
  .ss-embed-head { display: flex; align-items: center; gap: 12px; }
  .ss-embed-avatar {
    width: 48px; height: 48px; border-radius: 50%; object-fit: cover;
    flex: none; border: 2px solid var(--accent);
  }
  .ss-embed-avatar-fallback {
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; font-weight: 700; color: var(--accent);
    background: rgba(255,255,255,0.06);
  }
  .ss-embed-name { font-size: 17px; font-weight: 700; line-height: 1.2; margin: 0; }
  .ss-embed-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }
  .ss-embed-tag {
    font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 999px;
    color: var(--accent); background: rgba(183,110,121,0.15);
  }
  .ss-embed-thumbs { display: flex; gap: 8px; margin-top: 14px; }
  .ss-embed-thumb {
    flex: 1; height: 76px; border-radius: 8px; overflow: hidden;
    display: block; background: rgba(255,255,255,0.04);
  }
  .ss-embed-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .ss-embed-cta {
    display: block; text-align: center; text-decoration: none;
    margin-top: 16px; padding: 12px 16px; border-radius: 10px;
    background: var(--accent); color: #fff; font-size: 15px; font-weight: 700;
  }
  .ss-embed-powered {
    text-align: center; font-size: 11px; margin: 12px 0 0;
    color: rgba(255,255,255,0.4);
  }
  .ss-embed-powered a { color: rgba(255,255,255,0.6); text-decoration: none; }
`

export default async function EmbedPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const data = await getEmbedData(username)

  if (!data) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: styles }} />
        <div className="ss-embed" style={{ ['--accent' as string]: ROSE_GOLD }}>
          <p className="ss-embed-name" style={{ fontSize: 15, fontWeight: 600, opacity: 0.7 }}>
            This creator isn&apos;t available.
          </p>
          <p className="ss-embed-powered">
            <a href={BASE} target="_blank" rel="noopener noreferrer">Powered by Sssion</a>
          </p>
        </div>
      </>
    )
  }

  const { displayName, profileImageUrl, specialties, accent, thumbnails, profileUrl } = data

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="ss-embed" style={{ ['--accent' as string]: accent }}>
        {/* Header: avatar + name */}
        <div className="ss-embed-head">
          {profileImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="ss-embed-avatar" src={profileImageUrl} alt={displayName} />
          ) : (
            <div className="ss-embed-avatar ss-embed-avatar-fallback">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
          <h1 className="ss-embed-name">{displayName}</h1>
        </div>

        {/* Specialties */}
        {specialties.length > 0 && (
          <div className="ss-embed-tags">
            {specialties.map((s, i) => (
              <span key={i} className="ss-embed-tag">{s}</span>
            ))}
          </div>
        )}

        {/* Up to 3 preview moments */}
        {thumbnails.length > 0 && (
          <div className="ss-embed-thumbs">
            {thumbnails.map((thumb, i) => (
              <a
                key={i}
                className="ss-embed-thumb"
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={thumb} alt={`${displayName} preview ${i + 1}`} />
              </a>
            ))}
          </div>
        )}

        {/* Stay Updated CTA */}
        <a className="ss-embed-cta" href={profileUrl} target="_blank" rel="noopener noreferrer">
          Stay Updated
        </a>

        {/* Powered by */}
        <p className="ss-embed-powered">
          <a href={BASE} target="_blank" rel="noopener noreferrer">Powered by Sssion</a>
        </p>
      </div>
    </>
  )
}
