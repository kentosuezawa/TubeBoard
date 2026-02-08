/**
 * Feed.tsx
 * 
 * メインのフィード画面
 * - Swiper.js（縦スワイプ）
 * - 投稿の取得と表示
 */

'use client'

import React, { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Mousewheel, Keyboard } from 'swiper/modules'
import 'swiper/css'
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
      setPosts(data.posts || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black">
        <div className="text-white text-lg">読み込み中...</div>
      </div>
    )
  }

  if (error || posts.length === 0) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black">
        <div className="text-white text-lg">
          {error || '投稿がまだありません'}
        </div>
      </div>
    )
  }

  return (
    <Swiper
      modules={[Mousewheel, Keyboard]}
      mousewheel
      keyboard
      direction="vertical"
      spaceBetween={0}
      slidesPerView={1}
      onSlideChange={() => {
        // ログ記録など
      }}
      className="w-full h-screen"
    >
      {posts.map((post) => (
        <SwiperSlide key={post.id} className="flex items-center justify-center">
          <div className="w-full h-full max-w-2xl px-4">
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
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
