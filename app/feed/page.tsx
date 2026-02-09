/**
 * app/feed/page.tsx
 * 
 * フィードページ
 * - 認証チェック
 * - Feed コンポーネント表示
 */

'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Feed } from '@/components/Feed'
import { useAuth } from '@/lib/auth/provider'

export default function FeedPage() {
  const router = useRouter()
  const { user, loading, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <>
      {/* グローバルナビゲーションバー */}
      <nav className="sticky top-0 z-50 bg-black bg-opacity-90 backdrop-blur border-b border-gray-800 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* ロゴ */}
            <div className="flex items-center gap-3">
              <Link href="/" className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500">
                📺 TubeBoard
              </Link>
            </div>

            {/* 中央検索バー */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <Link
                href="/search"
                className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-gray-400 text-sm transition"
              >
                🔍 検索...
              </Link>
            </div>

            {/* 右側アクション */}
            <div className="flex items-center gap-3">
              <Link
                href="/search"
                className="p-2 hover:bg-gray-800 rounded-full transition md:hidden"
              >
                🔍
              </Link>
              
              {loading ? (
                <div className="text-gray-400 text-sm">⏳</div>
              ) : user ? (
                <>
                  <Link
                    href="/post/create"
                    className="hidden sm:flex px-4 py-2 bg-primary hover:bg-red-700 text-white text-sm font-semibold rounded-full transition"
                  >
                    + 投稿
                  </Link>
                  <div className="hidden lg:flex items-center gap-3 pl-3 border-l border-gray-700">
                    <span className="text-sm text-gray-300">{user.email}</span>
                    <button
                      onClick={handleSignOut}
                      className="px-3 py-1 text-sm text-gray-400 hover:text-white transition"
                    >
                      ログアウト
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  href="/auth/login"
                  className="px-4 py-2 bg-primary hover:bg-red-700 text-white text-sm font-semibold rounded-full transition"
                >
                  ログイン
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* メインコンテンツ */}
      <main className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* セクションヘッダー */}
          <div className="mb-12">
            <h2 className="text-3xl font-black text-white mb-2">
              🌟 おすすめの冒険
            </h2>
            <p className="text-gray-400">
              あなたにぴったりの動画・チャンネルを発見しよう
            </p>
          </div>

          {/* フィード */}
          <Feed />
        </div>
      </main>
    </>
  )
}
