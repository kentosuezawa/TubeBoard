/**
 * CreatePostForm.tsx
 * 
 * YouTube URL から動画・チャンネルを投稿するフォーム
 */

'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/provider'

interface PostData {
  title: string
  description: string
  thumbnail_url: string
  genres: string[]
  kind: 'video' | 'channel'
  youtube_id: string
}

const AVAILABLE_GENRES = [
  '音楽',
  'テック',
  'ゲーム',
  'エンタメ',
  '学習',
  'トレンド',
  'スポーツ',
  'アート',
  '料理',
  'トラベル',
]

export const CreatePostForm: React.FC = () => {
  const [url, setUrl] = useState('')
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [postData, setPostData] = useState<PostData | null>(null)

  const router = useRouter()
  const { user } = useAuth()

  // ジャンル選択トグル
  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    )
  }

  // YouTube URL検証と情報取得
  const handleFetchData = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setPostData(null)
    setLoading(true)

    try {
      if (!url.trim()) {
        throw new Error('YouTube URLを入力してください')
      }

      if (selectedGenres.length === 0) {
        throw new Error('最低1つ以上のジャンルを選択してください')
      }

      const response = await fetch('/api/posts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          youtube_url: url,
          genres: selectedGenres,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || '動画情報の取得に失敗しました')
      }

      const data = (await response.json()) as PostData
      setPostData(data)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // 投稿確定
  const handleConfirmPost = async () => {
    if (!postData) return

    setLoading(true)
    try {
      // TODO: 実際の投稿保存API呼び出し
      console.log('投稿データ:', postData)

      // 投稿成功後、フィードページへ遷移
      router.push('/feed')
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Posting failed'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="text-center text-gray-300">
        ログインして投稿を作成してください
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* ステップ 1: URL入力 */}
      {!postData && (
        <form onSubmit={handleFetchData} className="space-y-6">
          <div>
            <label className="block text-lg font-bold mb-2">
              YouTube の URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary"
            />
            <p className="text-gray-400 text-sm mt-2">
              対応形式: youtube.com/watch?v=... / youtu.be/... / youtube.com/@...
            </p>
          </div>

          {/* ジャンル選択 */}
          <div>
            <label className="block text-lg font-bold mb-3">
              ジャンル（1つ以上選択）
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {AVAILABLE_GENRES.map((genre) => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => toggleGenre(genre)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    selectedGenres.includes(genre)
                      ? 'bg-primary text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {/* エラー表示 */}
          {error && (
            <div className="p-4 bg-red-900 border border-red-600 rounded text-red-200">
              {error}
            </div>
          )}

          {/* ボタン */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary hover:bg-red-700 disabled:bg-gray-600 text-white font-bold rounded-lg transition"
          >
            {loading ? '取得中...' : '動画情報を取得'}
          </button>
        </form>
      )}

      {/* ステップ 2: 確認画面 */}
      {postData && (
        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            {/* サムネイル */}
            <div className="mb-4 rounded-lg overflow-hidden bg-black">
              <img
                src={postData.thumbnail_url}
                alt={postData.title}
                className="w-full h-48 object-cover"
              />
            </div>

            {/* 情報 */}
            <div>
              <h3 className="text-2xl font-bold mb-2">{postData.title}</h3>
              <p className="text-gray-300 mb-4 text-sm line-clamp-3">
                {postData.description}
              </p>

              {/* メタデータ */}
              <div className="space-y-2 text-sm text-gray-400">
                <p>
                  <span className="text-gray-500">種類:</span>{' '}
                  {postData.kind === 'video' ? '動画' : 'チャンネル'}
                </p>
                <p>
                  <span className="text-gray-500">YouTube ID:</span>{' '}
                  {postData.youtube_id}
                </p>
              </div>

              {/* ジャンル表示 */}
              <div className="mt-4 flex flex-wrap gap-2">
                {postData.genres.map((genre) => (
                  <span
                    key={genre}
                    className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-xs"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ボタン */}
          <div className="flex gap-4">
            <button
              onClick={() => {
                setPostData(null)
                setUrl('')
                setSelectedGenres([])
              }}
              className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition"
            >
              戻る
            </button>
            <button
              onClick={handleConfirmPost}
              disabled={loading}
              className="flex-1 py-3 bg-primary hover:bg-red-700 disabled:bg-gray-600 text-white font-bold rounded-lg transition"
            >
              {loading ? '投稿中...' : '投稿する'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
