'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth/provider'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const TRENDING_KEYWORDS = ['音楽', 'テック', 'ゲーム', 'エンタメ', '学習', 'スポーツ', 'アート']

export default function Home() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleKeywordSearch = (keyword: string) => {
    router.push(`/search?q=${encodeURIComponent(keyword)}`)
  }

  return (
    <>
      {/* グローバルナビゲーション */}
      <nav className="sticky top-0 z-50 bg-black bg-opacity-90 backdrop-blur border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* ロゴ */}
            <Link href="/" className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500">
              📺 TubeBoard
            </Link>

            {/* 右側 */}
            <div className="flex items-center gap-4">
              {!loading && user && (
                <button
                  onClick={() => signOut()}
                  className="text-sm text-gray-400 hover:text-white transition"
                >
                  ログアウト
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* メインコンテンツ */}
      <main className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-purple-950">
        {/* ヒーロー セクション */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
          {/* ヘッダー */}
          <div className="text-center mb-12">
            <div className="inline-block mb-4 text-6xl animate-bounce">🧭</div>
            <h1 className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 mb-4 drop-shadow-lg">
              動画の冒険へ
            </h1>
            <p className="text-xl text-gray-300 mb-3">
              YouTube上の無限の世界から、あなたにぴったりの作品を発見しよう
            </p>
            <p className="text-gray-400 mb-8">
              ジャンル・文脈・第三者視点で整理された、新しい発見との出会い
            </p>
          </div>

          {/* 検索フォーム */}
          <form onSubmit={handleSearch} className="mb-16">
            <div className="relative group">
              {/* グロー効果背景 */}
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>

              {/* 検索コンテナ */}
              <div className="relative bg-black rounded-2xl p-3">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="動画、チャンネル、ジャンル...を検索"
                    className="flex-1 px-6 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500 transition"
                  />
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-pink-500 hover:from-yellow-300 hover:to-pink-400 text-black font-bold rounded-xl transition transform hover:scale-105"
                  >
                    🚀 探す
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* トレンドキーワード */}
          <div className="mb-12">
            <p className="text-gray-400 text-sm mb-4 font-semibold">🔥 トレンド中のキーワード</p>
            <div className="flex flex-wrap gap-3">
              {TRENDING_KEYWORDS.map((keyword) => (
                <button
                  key={keyword}
                  onClick={() => handleKeywordSearch(keyword)}
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-full transition transform hover:scale-110 active:scale-95"
                >
                  #{keyword}
                </button>
              ))}
            </div>
          </div>

          {/* CTA ボタン */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/feed"
              className="px-8 py-4 bg-primary hover:bg-red-700 text-white font-bold rounded-xl transition transform hover:scale-105 text-center"
            >
              🎬 フィードを見る
            </Link>
            {!user && !loading && (
              <Link
                href="/auth/signup"
                className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl transition transform hover:scale-105 text-center"
              >
                ✨ 今すぐ投稿する
              </Link>
            )}
          </div>
        </div>

        {/* フィーチャーセクション */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">
              TubeBoard の特徴
            </h2>
            <p className="text-gray-400">
              YouTube探索の常識を変える3つのポイント
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-yellow-500 transition hover:shadow-2xl hover:shadow-yellow-500/20">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-3 text-white">ジャンル別整理</h3>
              <p className="text-gray-400">
                動画・チャンネルをジャンル・文脈で整理し、探しやすくしています
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-pink-500 transition hover:shadow-2xl hover:shadow-pink-500/20">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-bold mb-3 text-white">第三者視点</h3>
              <p className="text-gray-400">
                評価・コメントを可視化し、「なぜおすすめか」が分かります
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-purple-500 transition hover:shadow-2xl hover:shadow-purple-500/20">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-bold mb-3 text-white">新しい発見</h3>
              <p className="text-gray-400">
                未知の良質コンテンツとの出会いをサポートします
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
