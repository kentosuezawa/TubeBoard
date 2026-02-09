/**
 * GET /api/posts/metadata
 * 
 * YouTubeのメタデータを取得（投稿保存なし、認証不要）
 * 
 * クエリパラメータ:
 * - url: YouTube URL
 * 
 * レスポンス: { kind, youtube_id, title, description, thumbnail_url, representative_video_id }
 */

import { NextRequest, NextResponse } from 'next/server'
import { normalizeYouTubeUrl } from '@/lib/youtube/urlNormalizer'
import { YouTubeApiClient } from '@/lib/youtube/apiClient'

export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl.searchParams.get('url')

    if (!url) {
      return NextResponse.json(
        { error: 'url is required' },
        { status: 400 }
      )
    }

    // YouTube URL正規化
    const normalized = normalizeYouTubeUrl(url)

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

    return NextResponse.json({
      kind: normalized.kind,
      youtube_id: normalized.youtube_id,
      title: youtubeData.title,
      description: youtubeData.description,
      thumbnail_url: youtubeData.thumbnail_url,
      representative_video_id:
        'representative_video_id' in youtubeData
          ? youtubeData.representative_video_id
          : undefined,
    })
  } catch (error) {
    console.error('[GET /api/posts/metadata]', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
