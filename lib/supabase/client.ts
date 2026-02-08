/**
 * Supabase クライアント設定
 * 
 * - Browser/Client側: createClient (anon key)
 * - Server側: createServerClient (service role key)
 */

import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types'

/**
 * ブラウザ側で使用するクライアント
 * (public anon keyを使用)
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase environment variables are not set')
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseKey)
}

/**
 * サーバー側で使用するクライアント
 * (service role keyを使用)
 */
export function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase server environment variables are not set')
  }

  return createSupabaseClient<Database>(supabaseUrl, supabaseKey)
}
