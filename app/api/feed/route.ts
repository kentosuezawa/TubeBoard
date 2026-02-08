/**
 * GET /api/feed
 * 
 * クエリパラメータ:
 * - limit: number (default: 20)
 * - offset: number (default: 0)
 * 
 * レスポンス: { posts: Post[] }
 * 
 * 注: Supabase未設定時はモックデータを返します
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/types'

// モックデータ（Supabase未設定時に使用）
const MOCK_POSTS = [
  {
    id: 'mock-1',
    kind: 'video' as const,
    youtube_id: 'dQw4w9WgXcQ',
    title: 'Rick Astley - Never Gonna Give You Up (Official Video)',
    description: 'The official video for "Never Gonna Give You Up" by Rick Astley',
    thumbnail_url: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    genres: ['Music', 'Classic'],
    is_ad_active: true,
    representative_video_id: null,
    created_at: new Date().toISOString(),
    user_id: 'mock-user',
    profiles: {
      username: 'デモユーザー',
      avatar_url: null,
    },
  },
  {
    id: 'mock-2',
    kind: 'video' as const,
    youtube_id: 'jNQXAC9IVRw',
    title: 'Me at the zoo',
    description: 'The first video on YouTube',
    thumbnail_url: 'https://i.ytimg.com/vi/jNQXAC9IVRw/maxresdefault.jpg',
    genres: ['History', 'Fun'],
    is_ad_active: false,
    representative_video_id: null,
    created_at: new Date().toISOString(),
    user_id: 'mock-user',
    profiles: {
      username: 'デモユーザー',
      avatar_url: null,
    },
  },
]

export async function GET(req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Supabaseが未設定の場合はモックデータを返す
    if (
      !supabaseUrl ||
      !supabaseKey ||
      supabaseUrl.includes('your-project') ||
      supabaseKey.includes('your_')
    ) {
      console.log('[GET /api/feed] Using mock data (Supabase not configured)')
      return NextResponse.json({ posts: MOCK_POSTS }, { status: 200 })
    }

    const supabase = createClient<Database>(supabaseUrl, supabaseKey)

    const searchParams = req.nextUrl.searchParams
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const offset = parseInt(searchParams.get('offset') || '0')

    // フィード用クエリ: is_ad_active DESC, created_at DESC
    const { data: posts, error } = await supabase
      .from('posts')
      .select('*, profiles:user_id(username, avatar_url)')
      .order('is_ad_active', { ascending: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      throw error
    }

    return NextResponse.json({ posts: posts || [] }, { status: 200 })
  } catch (error) {
    console.error('[GET /api/feed]', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
