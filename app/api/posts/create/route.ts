/**
 * POST /api/posts/create
 * 
 * 投稿をSupabaseに保存
 * 認証必須（Authorizationヘッダーに Bearer <token> を含める）
 * 
 * リクエストボディ:
 * {
 *   "kind": "video" | "channel",
 *   "youtube_id": "string",
 *   "title": "string",
 *   "description": "string",
 *   "thumbnail_url": "string",
 *   "genres": string[],
 *   "representative_video_id": "string | null"
 * }
 * 
 * レスポンス: { id, user_id, kind, youtube_id, ... } | { error }
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/types'

export async function POST(req: NextRequest) {
  try {
    // リクエスト検証
    const body = await req.json()
    const {
      kind,
      youtube_id,
      title,
      description,
      thumbnail_url,
      genres,
      representative_video_id,
    } = body

    if (!kind || !youtube_id || !title || !genres) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!Array.isArray(genres) || genres.length === 0) {
      return NextResponse.json(
        { error: 'genres must be a non-empty array' },
        { status: 400 }
      )
    }

    // Supabase初期化
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Supabase configuration is missing' },
        { status: 500 }
      )
    }

    const supabase = createClient<Database>(supabaseUrl, supabaseKey)

    // リクエストヘッダーから認証トークンを取得
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - missing or invalid authorization token' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)

    // 認証ユーザー情報を取得
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - invalid token' },
        { status: 401 }
      )
    }

    // データベースに投稿を保存
    const { data, error } = await supabase
      .from('posts')
      .insert([
        {
          user_id: user.id,
          kind,
          youtube_id,
          title,
          description,
          thumbnail_url,
          genres,
          representative_video_id: representative_video_id || null,
        },
      ] as any)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('[POST /api/posts/create]', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
