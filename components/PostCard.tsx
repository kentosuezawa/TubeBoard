/**
 * PostCard.tsx
 * 
 * フィード内の単一投稿カード
 * - 中央: iframe（動画 / チャンネル代表動画）
 * - 右上: PRバッジ
 * - 下部: タイトル / ジャンル / 評価
 * - YouTubeで開くボタン
 */

import React from 'react'

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
}) => {
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

      {/* 動画の埋め込み */}
      <div className="flex-1 flex items-center justify-center mb-6 rounded-lg overflow-hidden bg-black">
        {videoId && (
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
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
