/**
 * app/search/page.tsx
 * 
 * YouTube動画・チャンネル検索ページ
 * POPで冒険的なUIデザイン
 */

'use client'

import Link from 'next/link'
import { useState } from 'react'
import { PostCard } from '@/components/PostCard'
import type { Post } from '@/components/Feed'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setError(null)
    setHasSearched(true)

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query)}&limit=20`
      )
      if (!response.ok) {
        throw new Error('検索に失敗しました')
      }
      const data = await response.json()
      setResults(data.posts || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-orange-900 p-8">
      {/* ナビゲーション */}
      <div className="flex justify-between items-center mb-12">
        <Link href="/feed" className="text-gray-300 hover:text-white transition">
          ← フィードに戻る
        </Link>
      </div>

      {/* ヘッダー - 冒険テーマ */}
      <div className="text-center mb-16">
        <div className="inline-block mb-4">
          <div className="text-6xl animate-bounce">🧭</div>
        </div>
        <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 mb-4 drop-shadow-lg">
          動画探検隊へようこそ！
        </h1>
        <p className="text-xl text-gray-200 mb-2">
          YouTube の無限の世界から、きっと出会える最高の動画
        </p>
        <p className="text-lg text-orange-300 font-semibold">
          🔍 何を探していますか？
        </p>
      </div>

      {/* 検索フォーム - POPなデザイン */}
      <div className="max-w-2xl mx-auto mb-16">
        <form onSubmit={handleSearch} className="relative">
          <div className="relative group">
            {/* グロー効果 */}
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>

            {/* 入力フィーム */}
            <div className="relative bg-black rounded-xl p-6">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="動画、チャンネル、ジャンル...を検索"
                  className="flex-1 px-6 py-4 bg-gray-800 border-2 border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition text-lg"
                />
                <button
                  type="submit"
                  disabled={loading || !query.trim()}
                  className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-pink-500 hover:from-yellow-300 hover:to-pink-400 disabled:from-gray-600 disabled:to-gray-600 text-black font-bold rounded-lg transition transform hover:scale-105 disabled:scale-100 text-lg"
                >
                  {loading ? '⏳ 探索中...' : '🚀 探す'}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* サジェスションタグ */}
        {!hasSearched && (
          <div className="mt-8 text-center">
            <p className="text-gray-400 mb-4">人気のキーワード:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['音楽', 'テック', 'ゲーム', 'エンタメ', '学習'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setQuery(tag)
                    setTimeout(() => {
                      const form = document.querySelector('form')
                      form?.dispatchEvent(
                        new Event('submit', { bubbles: true })
                      )
                    }, 0)
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white rounded-full font-semibold transition transform hover:scale-110"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 結果表示 */}
      <div className="max-w-6xl mx-auto">
        {error && (
          <div className="text-center py-12">
            <p className="text-3xl mb-4">😕</p>
            <p className="text-red-400 text-lg">{error}</p>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block">
              <div className="animate-spin text-6xl mb-4">🔄</div>
              <p className="text-gray-300 text-lg">動画を探検中...</p>
            </div>
          </div>
        )}

        {hasSearched && !loading && results.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-6xl mb-4">🗺️</p>
            <p className="text-gray-300 text-lg">
              「{query}」の動画は見つかりませんでした...
            </p>
            <p className="text-gray-400 mt-2">別のキーワードで探してみてください！</p>
          </div>
        )}

        {results.length > 0 && (
          <div>
            <div className="text-center mb-8">
              <p className="text-2xl text-orange-300 font-bold">
                ✨ {results.length}個の冒険を発見！
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.map((post) => (
                <div
                  key={post.id}
                  className="group relative h-96 rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                >
                  {/* グロー背景 */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 rounded-xl opacity-0 group-hover:opacity-50 blur transition duration-1000"></div>

                  {/* カード */}
                  <div className="relative h-full">
                    <PostCard
                      kind={post.kind}
                      youtube_id={post.youtube_id}
                      representative_video_id={post.representative_video_id}
                      title={post.title}
                      description={post.description}
                      thumbnail_url={post.thumbnail_url}
                      genres={post.genres}
                      is_ad_active={post.is_ad_active}
                      username={post.profiles?.username}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* フッター */}
      {hasSearched && results.length > 0 && (
        <div className="text-center mt-16">
          <p className="text-gray-400 mb-4">もっと探検しますか？</p>
          <button
            onClick={() => {
              setQuery('')
              setResults([])
              setHasSearched(false)
            }}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold rounded-lg transition"
          >
            新しい検索を始める
          </button>
        </div>
      )}
    </main>
  )
}
