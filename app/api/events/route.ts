/**
 * POST /api/events
 * 
 * リクエストボディ:
 * {
 *   "event_type": "view" | "open_youtube" | "filter_genre" | "like" | "skip",
 *   "post_id": string (nullable),
 *   "meta": object (nullable)
 * }
 * 
 * レスポンス: { id } | { error }
 * 
 * 注: 本実装には認証が必要です (現在はプレースホルダー)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/types'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { event_type, post_id, meta } = body

    // バリデーション
    const validEventTypes = [
      'view',
      'open_youtube',
      'filter_genre',
      'like',
      'skip',
    ]
    if (!validEventTypes.includes(event_type)) {
      return NextResponse.json(
        { error: `Invalid event_type: ${event_type}` },
        { status: 400 }
      )
    }

    // Supabase設定確認
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

    const { error } = await supabase.from('user_events').insert(
      {
        user_id: placeholder_user_id,
        event_type: event_type as any,
        post_id: post_id || null,
        meta: meta || null,
      } as any
    )

    if (error) {
      throw error
    }

    return NextResponse.json(
      {
        message: 'Event recorded successfully',
        event_type,
        post_id,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[POST /api/events]', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
