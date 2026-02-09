/**
 * PostCard.tsx
 * 
 * フィード内の単一投稿カード
 * - 中央: iframe（動画 / チャンネル代表動画）
 * - 右上: PRバッジ
 * - 下部: タイトル / ジャンル / 評価
 * - YouTubeで開くボタン
 */

import React, { useState } from 'react'

export interface PostCardProps {
  kind: 'video' | 'channel'
  youtube_id: string
  representative_video_id?: string
  title: string
  description: string
  thumbnail_url: string
  genres: string[]
  is_ad_active: boolean
  username?: string
}

export const PostCard: React.FC<PostCardProps> = ({
  kind,
  youtube_id,
  representative_video_id,
  title,
  genres,
  is_ad_active,
  username,
  thumbnail_url,
}) => {
  const [iframeError, setIframeError] = useState(false)
  
  const videoId =
    kind === 'video' ? youtube_id : representative_video_id || youtube_id

  const youtubeUrl =
    kind === 'video'
      ? `https://www.youtube.com/watch?v=${youtube_id}`
      : `https://www.youtube.com/@${youtube_id}`

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 rounded-lg bg-gray-900">
      {/* PR Badge */}
      {is_ad_active && (
        <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
          PR
        </div>
      )}

      {/* 動画の埋め込み or サムネイル */}
      <div className="flex-1 flex items-center justify-center mb-6 rounded-lg overflow-hidden bg-black relative">
        {!iframeError && videoId ? (
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}?modestbranding=1`}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onError={() => setIframeError(true)}
            className="w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center relative group cursor-pointer">
            {thumbnail_url && (
              <img
                src={thumbnail_url}
                alt={title}
                className="w-full h-full object-cover group-hover:brightness-75 transition"
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 group-hover:bg-opacity-50 transition">
              <div className="bg-red-600 text-white rounded-full p-4 group-hover:bg-red-700 transition">
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* タイトル・ジャンル・ユーザー */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-3 line-clamp-2">{title}</h2>

        {/* ジャンル */}
        <div className="flex flex-wrap gap-2 mb-3">
          {genres.map((genre) => (
            <span
              key={genre}
              className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-xs"
            >
              {genre}
            </span>
          ))}
        </div>

        {/* ユーザー情報 */}
        {username && (
          <p className="text-gray-400 text-sm">投稿者: {username}</p>
        )}
      </div>

      {/* YouTubeで開くボタン */}
      <a
        href={youtubeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full py-3 bg-primary hover:bg-red-700 text-white font-bold rounded-lg text-center transition"
      >
        YouTubeで開く
      </a>
    </div>
  )
}
