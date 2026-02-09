/**
 * app/post/create/page.tsx
 * 
 * 新規投稿作成ページ
 */

'use client'

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

  // 未認証の場合はログインページへ
  if (!user) {
    router.push('/auth/login')
    return null
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
