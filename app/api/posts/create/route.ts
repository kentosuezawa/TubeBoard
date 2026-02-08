/**
 * POST /api/posts/create
 * 
 * リクエストボディ:
 * {
 *   "youtube_url": "string",
 *   "genres": string[]
 * }
 * 
 * レスポンス: { id, title, description, ... } | { error }
 * 
 * 注: 本実装には認証が必要です (現在はプレースホルダー)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { normalizeYouTubeUrl } from '@/lib/youtube/urlNormalizer'
import { YouTubeApiClient } from '@/lib/youtube/apiClient'
import type { Database } from '@/lib/supabase/types'

export async function POST(req: NextRequest) {
  try {
    // リクエスト検証
    const body = await req.json()
    const { youtube_url, genres } = body

    if (!youtube_url) {
      return NextResponse.json(
        { error: 'youtube_url is required' },
        { status: 400 }
      )
    }

    if (!genres || !Array.isArray(genres) || genres.length === 0) {
      return NextResponse.json(
        { error: 'genres must be a non-empty array' },
        { status: 400 }
      )
    }

    // YouTube URL正規化
    const normalized = normalizeYouTubeUrl(youtube_url)

    // YouTube API でメタデータ取得
    const youtubeApiKey = process.env.YOUTUBE_API_KEY
    if (!youtubeApiKey) {
      return NextResponse.json(
        { error: 'YouTube API key not configured' },
        { status: 500 }
      )
    }

    const youtubeClient = new YouTubeApiClient(youtubeApiKey)

    let youtubeData
    if (normalized.kind === 'video') {
      youtubeData = await youtubeClient.getVideoData(normalized.youtube_id)
    } else {
      youtubeData = await youtubeClient.getChannelData(normalized.youtube_id)
    }

    // Supabase に投稿を保存
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Supabase configuration is missing' },
        { status: 500 }
      )
    }

    const supabase = createClient<Database>(supabaseUrl, supabaseKey)

    // TODO: 認証ユーザーのIDを取得
    // 現在はプレースホルダーとして固定の user_id を使用
    const placeholder_user_id = 'placeholder-user-id'

    const { error } = await supabase.from('posts').insert({
      user_id: placeholder_user_id,
      kind: normalized.kind,
      youtube_id: normalized.youtube_id,
      title: youtubeData.title,
      description: youtubeData.description,
      thumbnail_url: youtubeData.thumbnail_url,
      genres,
      representative_video_id:
        'representative_video_id' in youtubeData
          ? youtubeData.representative_video_id
          : null,
    } as any)

    if (error) {
      throw error
    }

    return NextResponse.json(
      {
        kind: normalized.kind,
        youtube_id: normalized.youtube_id,
        title: youtubeData.title,
        description: youtubeData.description,
        thumbnail_url: youtubeData.thumbnail_url,
        genres,
        representative_video_id:
          'representative_video_id' in youtubeData
            ? youtubeData.representative_video_id
            : undefined,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[POST /api/posts/create]', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
