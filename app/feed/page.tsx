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
      {/* ユーザーメニューバー */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-50 backdrop-blur p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          {loading ? (
            <div className="text-gray-300 text-sm">読み込み中...</div>
          ) : user ? (
            <>
              <div className="text-white text-sm">
                <span className="text-gray-300">ログイン中:</span> {user.email}
              </div>
              <Link
                href="/post/create"
                className="px-4 py-2 bg-primary hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition"
              >
                + 投稿する
              </Link>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="px-4 py-2 bg-primary hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition"
            >
              ログイン
            </Link>
          )}
        </div>
        {user && !loading && (
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition"
          >
            ログアウト
          </button>
        )}
      </div>

      {/* フィード */}
      <Feed />
    </>
  )
}
