/**
 * Feed.tsx
 * 
 * YouTubeスタイルのグリッドフィード
 * - グリッドレイアウト（3列）
 * - 人気順・おすすめ順でソート
 */

'use client'

import React, { useState, useEffect } from 'react'
import { PostCard } from './PostCard'

export interface Post {
  id: string
  kind: 'video' | 'channel'
  youtube_id: string
  representative_video_id?: string
  title: string
  description: string
  thumbnail_url: string
  genres: string[]
  is_ad_active: boolean
  user_id: string
  profiles?: {
    username: string
    avatar_url?: string
  }
}

export const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchFeed()
  }, [])

  const fetchFeed = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/feed?limit=20&offset=0')
      if (!response.ok) {
        throw new Error('Failed to fetch feed')
      }
      const data = await response.json()
      // モックデータなので、推奨順にソート
      const sortedPosts = (data.posts || []).sort(
        (a: Post, b: Post) => {
          // PRアクティブなものを優先
          if (a.is_ad_active !== b.is_ad_active) {
            return a.is_ad_active ? -1 : 1
          }
          // その後、IDの逆順（最新順の仮実装）
          return b.id.localeCompare(a.id)
        }
      )
      setPosts(sortedPosts)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-20">
        <div className="text-white text-lg">🎬 動画を読み込み中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full flex items-center justify-center py-20">
        <div className="text-red-400 text-lg">{error}</div>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="w-full flex items-center justify-center py-20">
        <div className="text-gray-300 text-lg">動画がまだありません</div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* グリッドレイアウト */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="group relative h-96 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            {/* ホバー時のグロー効果 */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 rounded-xl opacity-0 group-hover:opacity-40 blur transition duration-1000"></div>

            {/* カード */}
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
    </div>
  )
}
