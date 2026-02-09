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

  // ローディング中
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black">
        <div className="text-white text-lg">読み込み中...</div>
      </div>
    )
  }

  // 未認証の場合はログインページへ
  if (!user) {
    router.push('/auth/login')
    return null
  }

  return (
    <>
      {/* ユーザーメニューバー */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-50 backdrop-blur p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="text-white text-sm">
            <span className="text-gray-300">ログイン中:</span> {user.email}
          </div>
          <Link
            href="/post/create"
            className="px-4 py-2 bg-primary hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition"
          >
            + 投稿する
          </Link>
        </div>
        <button
          onClick={async () => {
            await signOut()
            router.push('/')
          }}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition"
        >
          ログアウト
        </button>
      </div>

      {/* フィード */}
      <Feed />
    </>
  )
}
