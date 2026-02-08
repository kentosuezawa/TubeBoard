/**
 * YouTube URL正規化ユーティリティ
 * 
 * サポートする形式：
 * - https://youtube.com/watch?v=xxxx
 * - https://youtu.be/xxxx
 * - https://youtube.com/@xxxx
 * - https://youtube.com/channel/xxxx
 * 
 * 戻り値:
 * { kind: 'video' | 'channel', youtube_id: string }
 */

export interface NormalizedYouTubeUrl {
  kind: 'video' | 'channel'
  youtube_id: string
}

export class YouTubeUrlNormalizationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'YouTubeUrlNormalizationError'
  }
}

/**
 * YouTube URLを正規化する
 */
export function normalizeYouTubeUrl(url: string): NormalizedYouTubeUrl {
  try {
    const urlObj = new URL(url)
    const hostname = urlObj.hostname

    // youtube.com / youtu.be のいずれかであることを確認
    if (!['youtube.com', 'youtu.be', 'www.youtube.com'].includes(hostname)) {
      throw new YouTubeUrlNormalizationError(
        `Unsupported hostname: ${hostname}`
      )
    }

    // 動画URLの場合
    if (hostname === 'youtu.be') {
      const videoId = urlObj.pathname.slice(1)
      if (!videoId) {
        throw new YouTubeUrlNormalizationError('Invalid youtu.be URL')
      }
      return { kind: 'video', youtube_id: videoId }
    }

    // youtube.com の場合
    const searchParams = urlObj.searchParams
    const pathname = urlObj.pathname

    // watch?v=xxxx (動画)
    if (searchParams.has('v')) {
      const videoId = searchParams.get('v')
      if (!videoId) {
        throw new YouTubeUrlNormalizationError('Invalid watch URL: missing video ID')
      }
      return { kind: 'video', youtube_id: videoId }
    }

    // /@xxxx (チャンネル)
    if (pathname.startsWith('/@')) {
      const handle = pathname.slice(2)
      if (!handle) {
        throw new YouTubeUrlNormalizationError('Invalid channel handle URL')
      }
      return { kind: 'channel', youtube_id: handle }
    }

    // /channel/xxxx (チャンネル)
    if (pathname.startsWith('/channel/')) {
      const channelId = pathname.slice(9)
      if (!channelId) {
        throw new YouTubeUrlNormalizationError('Invalid channel ID URL')
      }
      return { kind: 'channel', youtube_id: channelId }
    }

    throw new YouTubeUrlNormalizationError(
      'Could not recognize URL format'
    )
  } catch (error) {
    if (error instanceof YouTubeUrlNormalizationError) {
      throw error
    }
    throw new YouTubeUrlNormalizationError(
      `Invalid URL: ${error instanceof Error ? error.message : 'unknown error'}`
    )
  }
}

/**
 * YouTube URLを検証する
 */
export function validateYouTubeUrl(url: string): boolean {
  try {
    normalizeYouTubeUrl(url)
    return true
  } catch {
    return false
  }
}
