/**
 * app/search/page.tsx
 * 
 * YouTube動画・チャンネル検索ページ
 * YouTubeスタイルのUIデザイン
 */

'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { PostCard } from '@/components/PostCard'
import type { Post } from '@/components/Feed'

const TRENDING_KEYWORDS = ['音楽', 'テック', 'ゲーム', 'エンタメ', '学習', 'スポーツ', 'アート', '料理']

export default function SearchPage() {
  const searchParams = useSearchParams()
  
  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<Post[]>([])
  const [loading, setLoading] = useState(!!initialQuery)
  const [hasSearched, setHasSearched] = useState(!!initialQuery)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery)
    }
  }, [initialQuery])

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return

    setLoading(true)
    setError(null)
    setHasSearched(true)

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}&limit=20`
      )
      if (!response.ok) {
        throw new Error('検索に失敗しました')
      }
      const data = await response.json()
      setResults(data.posts || [])
      // URL を更新
      window.history.replaceState(
        {},
        '',
        `/search?q=${encodeURIComponent(searchQuery)}`
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(query)
  }

  const handleKeywordClick = (keyword: string) => {
    setQuery(keyword)
    handleSearch(keyword)
  }

  return (
    <>
      {/* グローバルナビゲーション */}
      <nav className="sticky top-0 z-50 bg-black bg-opacity-90 backdrop-blur border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500">
              📺 TubeBoard
            </Link>

            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <form onSubmit={handleSearchSubmit} className="w-full">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="検索..."
                    className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-white placeholder-gray-500 focus:outline-none focus:bg-gray-700 focus:ring-2 focus:ring-purple-500 transition"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-full transition text-sm font-semibold"
                  >
                    🔍
                  </button>
                </div>
              </form>
            </div>

            <Link href="/feed" className="text-gray-400 hover:text-white transition">
              フィード
            </Link>
          </div>
        </div>
      </nav>

      {/* メインコンテンツ */}
      <main className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* 検索フォーム */}
          {!hasSearched && (
            <div className="mb-16 text-center">
              <div className="inline-block mb-4 text-6xl animate-bounce">🧭</div>
              <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 mb-8">
                何を探していますか？
              </h1>

              <form onSubmit={handleSearchSubmit} className="mb-12">
                <div className="relative group max-w-2xl mx-auto">
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
                  <div className="relative bg-black rounded-2xl p-3">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="動画、チャンネル、ジャンル...を検索"
                        className="flex-1 px-6 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500 transition"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-pink-500 hover:from-yellow-300 hover:to-pink-400 text-black font-bold rounded-xl transition transform hover:scale-105"
                      >
                        🚀
                      </button>
                    </div>
                  </div>
                </div>
              </form>

              {/* トレンドキーワード */}
              <div>
                <p className="text-gray-400 text-sm mb-4 font-semibold">🔥 トレンド中のキーワード</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {TRENDING_KEYWORDS.map((keyword) => (
                    <button
                      key={keyword}
                      onClick={() => handleKeywordClick(keyword)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-full font-semibold transition transform hover:scale-110 text-sm"
                    >
                      #{keyword}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 検索結果 */}
          {hasSearched && (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {loading ? '🔄 検索中...' : `✨ 「${query}」の検索結果`}
                </h2>
                {results.length > 0 && (
                  <p className="text-gray-400">
                    {results.length}件の動画が見つかりました
                  </p>
                )}
              </div>

              {error && (
                <div className="text-center py-12">
                  <p className="text-6xl mb-4">😕</p>
                  <p className="text-red-400 text-lg">{error}</p>
                </div>
              )}

              {!error && results.length === 0 && !loading && (
                <div className="text-center py-12">
                  <p className="text-6xl mb-4">🗺️</p>
                  <p className="text-gray-300 text-lg mb-4">
                    「{query}」の動画は見つかりませんでした
                  </p>
                  <p className="text-gray-400 mb-8">別のキーワードで探してみてください！</p>
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

              {results.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.map((post) => (
                    <div
                      key={post.id}
                      className="group relative h-96 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105"
                    >
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 rounded-xl opacity-0 group-hover:opacity-40 blur transition duration-1000"></div>
                      <div className="relative h-full bg-gray-900">
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
              )}
            </>
          )}
        </div>
      </main>
    </>
  )
}
