/**
 * YouTube Data API v3クライアント
 * 
 * - 動画情報取得 (title, description, thumbnailURL)
 * - チャンネル情報取得 (title, description, thumbnailURL)
 * - チャンネルの最新動画取得
 */

export interface YouTubeVideoData {
  title: string
  description: string
  thumbnail_url: string
}

export interface YouTubeChannelData {
  title: string
  description: string
  thumbnail_url: string
  representative_video_id?: string
}

export class YouTubeApiClient {
  private apiKey: string

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('YouTube API key is required')
    }
    this.apiKey = apiKey
  }

  /**
   * 動画情報を取得
   */
  async getVideoData(videoId: string): Promise<YouTubeVideoData> {
    const url = new URL('https://www.googleapis.com/youtube/v3/videos')
    url.searchParams.set('key', this.apiKey)
    url.searchParams.set('id', videoId)
    url.searchParams.set(
      'part',
      'snippet,contentDetails'
    )

    const response = await fetch(url.toString())
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.statusText}`)
    }

    const data = await response.json() as any
    if (!data.items || data.items.length === 0) {
      throw new Error(`Video not found: ${videoId}`)
    }

    const item = data.items[0]
    const snippet = item.snippet

    return {
      title: snippet.title,
      description: snippet.description,
      thumbnail_url: snippet.thumbnails.high?.url || snippet.thumbnails.default.url,
    }
  }

  /**
   * チャンネル情報を取得
   * @param channelIdOrHandle チャンネルID または @handle
   */
  async getChannelData(
    channelIdOrHandle: string
  ): Promise<YouTubeChannelData> {
    const url = new URL('https://www.googleapis.com/youtube/v3/channels')
    url.searchParams.set('key', this.apiKey)
    url.searchParams.set('part', 'snippet,contentDetails')

    // @handle の場合はforUsername=false, IDの場合はid=
    if (channelIdOrHandle.startsWith('@')) {
      url.searchParams.set('forUsername', channelIdOrHandle.slice(1))
    } else if (channelIdOrHandle.startsWith('UC')) {
      url.searchParams.set('id', channelIdOrHandle)
    } else {
      url.searchParams.set('forUsername', channelIdOrHandle)
    }

    const response = await fetch(url.toString())
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.statusText}`)
    }

    const data = await response.json() as any
    if (!data.items || data.items.length === 0) {
      throw new Error(`Channel not found: ${channelIdOrHandle}`)
    }

    const item = data.items[0]
    const snippet = item.snippet
    
    // チャンネルIDを取得
    const channelId = item.id
    
    // 最新動画を取得してrepresentative_video_idに設定
    let representativeVideoId: string | undefined
    try {
      const videoId = await this.getLatestVideoId(channelId)
      representativeVideoId = videoId
    } catch {
      // 最新動画が取得できない場合はスキップ
      console.warn(`Could not fetch latest video for channel: ${channelId}`)
    }

    return {
      title: snippet.title,
      description: snippet.description,
      thumbnail_url: snippet.thumbnails.high?.url || snippet.thumbnails.default.url,
      representative_video_id: representativeVideoId,
    }
  }

  /**
   * チャンネルの最新動画IDを取得
   */
  private async getLatestVideoId(channelId: string): Promise<string> {
    const url = new URL('https://www.googleapis.com/youtube/v3/search')
    url.searchParams.set('key', this.apiKey)
    url.searchParams.set('channelId', channelId)
    url.searchParams.set('part', 'snippet')
    url.searchParams.set('order', 'date')
    url.searchParams.set('maxResults', '1')
    url.searchParams.set('type', 'video')

    const response = await fetch(url.toString())
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.statusText}`)
    }

    const data = await response.json() as any
    if (!data.items || data.items.length === 0) {
      throw new Error(`No videos found for channel: ${channelId}`)
    }

    return data.items[0].id.videoId
  }
}
