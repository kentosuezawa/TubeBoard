'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth/provider'

export default function Home() {
  const { user, loading, signOut } = useAuth()

  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col items-center justify-center gap-8 p-8">
      <div className="absolute top-4 right-4">
        {!loading && user && (
          <div className="flex items-center gap-4">
            <span className="text-gray-300 text-sm">{user.email}</span>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
            >
              ログアウト
            </button>
          </div>
        )}
      </div>

      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold text-white mb-4">📺 TubeBoard</h1>
        <p className="text-xl text-gray-300 mb-8">
          YouTube上に無限に存在する動画・チャンネルを、ジャンル・文脈・第三者視点で整理し、"新しい発見"を取り戻すための探索支援Webサービス
        </p>
        <p className="text-gray-400 mb-8">
          YouTubeの"再生体験"ではなく、"探す体験"を再設計します
        </p>
      </div>

      <div className="flex gap-4">
        {loading ? (
          <div className="text-gray-300">読み込み中...</div>
        ) : (
          <>
            <Link
              href="/feed"
              className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-red-700 transition"
            >
              フィードを見る
            </Link>
            {!user && (
              <Link
                href="/auth/signup"
                className="px-8 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
              >
                今すぐ登録
              </Link>
            )}
          </>
        )}
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-bold mb-2">ジャンル別整理</h3>
          <p className="text-gray-300 text-sm">動画・チャンネルをジャンル・文脈で整理し、探しやすくします</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-bold mb-2">第三者視点</h3>
          <p className="text-gray-300 text-sm">評価・コメントを可視化し、「なぜおすすめか」が分かります</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-bold mb-2">新しい発見</h3>
          <p className="text-gray-300 text-sm">未知の良質コンテンツとの出会いをサポートします</p>
        </div>
      </div>
    </main>
  )
}
