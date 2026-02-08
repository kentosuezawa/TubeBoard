/**
 * app/feed/page.tsx
 * 
 * フィードページ
 * - 認証チェック（将来実装）
 * - Feed コンポーネント表示
 */

import React from 'react'
import { Feed } from '@/components/Feed'

export const metadata = {
  title: 'フィード - TubeBoard',
}

export default function FeedPage() {
  return <Feed />
}
