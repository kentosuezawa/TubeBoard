/**
 * GET /api/search
 * 
 * キーワードで投稿を検索
 * 
 * クエリパラメータ:
 * - q: 検索キーワード（タイトル・説明文・ジャンルで検索）
 * - limit: 取得件数デフォルト 20
 * - offset: オフセット（デフォルト 0）
 * 
 * レスポンス: { posts: Post[] }
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/types'

export async function GET(req: NextRequest) {
  try {
    const query = req.nextUrl.searchParams.get('q') || ''
    const limit = parseInt(req.nextUrl.searchParams.get('limit') || '20', 10)
    const offset = parseInt(req.nextUrl.searchParams.get('offset') || '0', 10)

    if (!query.trim()) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      // モックデータで対応
      const mockPosts = [
        {
          id: '1',
          kind: 'video' as const,
          youtube_id: 'dQw4w9WgXcQ',
          title: 'Never Gonna Give You Up',
          description: 'Rick Astley - Never Gonna Give You Up',
          thumbnail_url: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
          genres: ['音楽'],
          is_ad_active: false,
          user_id: 'demo',
          profiles: { username: 'Demo User', avatar_url: '' },
        },
        {
          id: '2',
          kind: 'channel' as const,
          youtube_id: 'UCBR8-60-B8q_2La_FfjSA',
          title: 'YouTube Official',
          description: 'The official YouTube channel',
          thumbnail_url: 'https://yt3.ggpht.com/ytc/default.jpg',
          genres: ['テック'],
          is_ad_active: false,
          user_id: 'demo',
          profiles: { username: 'Demo User', avatar_url: '' },
        },
      ]

      // キーワードでフィルタ
      const searchLower = query.toLowerCase()
      const filtered = mockPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchLower) ||
          post.description.toLowerCase().includes(searchLower) ||
          post.genres.some((g) => g.toLowerCase().includes(searchLower))
      )

      return NextResponse.json({
        posts: filtered.slice(offset, offset + limit),
        total: filtered.length,
      })
    }

    const supabase = createClient<Database>(supabaseUrl, supabaseKey)

    // テキスト検索クエリを組み立て
    const searchLower = query.toLowerCase()

    // title, description, genres でフルテキスト検索
    let queryBuilder = supabase
      .from('posts')
      .select('*, profiles!inner(username, avatar_url)', { count: 'exact' })

    // 実装可能な範囲での検索フィルタリング
    // Supabase のフルテキスト検索は複雑なので、クライアント側で補助する
    const { data, error } = await queryBuilder
      .limit(limit * 5) // 多めに取得

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    // クライアント側で検索フィルタリング
    const filtered = (data || []).filter((post: any) => {
      const titleMatch = post.title?.toLowerCase().includes(searchLower)
      const descMatch = post.description?.toLowerCase().includes(searchLower)
      const genreMatch = (post.genres || []).some((g: string) =>
        g.toLowerCase().includes(searchLower)
      )
      return titleMatch || descMatch || genreMatch
    })

    return NextResponse.json({
      posts: filtered.slice(offset, offset + limit),
      total: filtered.length,
    })
  } catch (error) {
    console.error('[GET /api/search]', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
