/**
 * app/auth/callback/route.ts
 * 
 * Supabase Auth Callback
 * メール確認後のリダイレクト処理
 */

import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const code = searchParams.get('code')
    const error = searchParams.get('error')
    const error_description = searchParams.get('error_description')

    // エラーハンドリング
    if (error) {
      const errorMessage = error_description || error
      return NextResponse.redirect(
        `${req.nextUrl.origin}/auth/login?error=${encodeURIComponent(errorMessage)}`
      )
    }

    // コード交換はSupabase SSRで自動処理されるため、
    // ここではリダイレクト処理のみを行う
    if (code) {
      // フロントエンド側で処理されるため、成功ページにリダイレクト
      return NextResponse.redirect(`${req.nextUrl.origin}/feed?success=true`)
    }

    return NextResponse.redirect(`${req.nextUrl.origin}/auth/login`)
  } catch (error) {
    console.error('[Auth Callback]', error)
    return NextResponse.redirect(`${req.nextUrl.origin}/auth/login?error=callback_error`)
  }
}
