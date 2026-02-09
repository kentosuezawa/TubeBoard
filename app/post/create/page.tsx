/**
 * app/post/create/page.tsx
 * 
 * 新規投稿作成ページ
 */

'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/provider'
import { CreatePostForm } from '@/components/CreatePostForm'

export default function CreatePostPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  // ローディング中
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black">
        <div className="text-white text-lg">読み込み中...</div>
      </div>
    )
  }

  // 未認証の場合はログイン促進画面
  if (!user) {
    return (
      <main className="w-full h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col items-center justify-center gap-8 p-8">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold text-white mb-4">投稿するには</h1>
          <h2 className="text-2xl font-semibold text-gray-300 mb-6">ログインが必要です</h2>
          <p className="text-gray-400 mb-8">
            YouTube の動画やチャンネルを TubeBoard に投稿し、新しい発見を広めましょう
          </p>
        </div>

        <div className="flex gap-4">
          <Link
            href="/auth/login"
            className="px-6 py-3 bg-primary hover:bg-red-700 text-white font-semibold rounded-lg transition"
          >
            ログイン
          </Link>
          <Link
            href="/auth/signup"
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition"
          >
            新規登録
          </Link>
        </div>

        <Link href="/feed" className="text-gray-400 hover:text-white mt-8 transition">
          ← フィードに戻る
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-gray-900 p-8">
      {/* ヘッダー */}
      <div className="mb-12">
        <button
          onClick={() => router.back()}
          className="text-gray-400 hover:text-white mb-4"
        >
          ← 戻る
        </button>
        <h1 className="text-4xl font-bold text-white">新規投稿</h1>
        <p className="text-gray-400 mt-2">
          YouTube の動画やチャンネルを TuceBoard に投稿してください
        </p>
      </div>

      {/* フォーム */}
      <CreatePostForm />
    </main>
  )
}
