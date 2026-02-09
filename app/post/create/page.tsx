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
      <main className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black">
        {/* ナビゲーション */}
        <nav className="sticky top-0 z-50 bg-black bg-opacity-90 backdrop-blur border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500">
                📺 TubeBoard
              </Link>
              <Link href="/feed" className="text-gray-400 hover:text-white transition">
                フィードに戻る
              </Link>
            </div>
          </div>
        </nav>

        {/* ヒーロー */}
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="text-center max-w-lg px-6">
            <div className="text-6xl animate-bounce mb-6">🚀</div>
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 mb-4">
              投稿するには
            </h1>
            <h2 className="text-2xl font-semibold text-gray-300 mb-8">
              ログインが必要です
            </h2>
            <p className="text-gray-400 mb-12 text-lg">
              YouTube の動画やチャンネルを TubeBoard に投稿し、新しい動画の冒険を広めましょう！🌍✨
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/login"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-lg transition transform hover:scale-105"
              >
                ログイン
              </Link>
              <Link
                href="/auth/signup"
                className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-lg transition transform hover:scale-105"
              >
                新規登録
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black">
      {/* ナビゲーション */}
      <nav className="sticky top-0 z-50 bg-black bg-opacity-90 backdrop-blur border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500">
              📺 TubeBoard
            </Link>

            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <Link href="/search" className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white transition">
                <span>🔍</span>
                <span className="text-sm">検索...</span>
              </Link>
            </div>

            <Link href="/feed" className="text-gray-400 hover:text-white transition">
              フィード
            </Link>
          </div>
        </div>
      </nav>

      {/* メインコンテンツ */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* ヘッダー */}
        <div className="mb-12">
          <button
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white mb-6 transition text-lg"
          >
            ← 戻る
          </button>
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 mb-3">
            新規投稿 ✨
          </h1>
          <p className="text-gray-300 text-lg">
            あなたが発見した YouTube の動画やチャンネルをシェアして、みんなに冒険を広めよう！
          </p>
        </div>

        {/* フォームコンテナ */}
        <div className="relative p-8 rounded-xl border border-gray-800 bg-gray-950/50 backdrop-blur">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 rounded-xl opacity-10"></div>
          <div className="relative">
            <CreatePostForm />
          </div>
        </div>

        {/* ヒント */}
        <div className="mt-12 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-800/50 rounded-lg p-6">
          <h3 className="text-white font-bold mb-3 flex items-center gap-2">
            💡 投稿のコツ
          </h3>
          <ul className="text-gray-300 space-y-2 text-sm">
            <li>✅ YouTube の動画またはチャンネルのリンクを入力してください</li>
            <li>✅ わかりやすいジャンルを選択すると、他のユーザーが見つけやすくなります</li>
            <li>✅ 説明は簡潔でわかりやすく、このコンテンツの面白さを伝えましょう</li>
            <li>✅ 広告チェックについて相談がある場合は、メタデータを確認してください</li>
          </ul>
        </div>
      </div>
    </main>
  )
}
