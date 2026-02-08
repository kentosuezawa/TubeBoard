/**
 * Supabase Database Types
 * 
 * 自動生成される型定義（通常はSupabase CLIで生成）
 * ここではMVP用の基本型を定義
 */

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          username?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          avatar_url?: string | null
          created_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          user_id: string
          kind: 'video' | 'channel'
          youtube_id: string
          title: string
          description: string
          thumbnail_url: string
          genres: string[]
          is_ad_active: boolean
          representative_video_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          kind: 'video' | 'channel'
          youtube_id: string
          title: string
          description: string
          thumbnail_url: string
          genres: string[]
          is_ad_active?: boolean
          representative_video_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          kind?: 'video' | 'channel'
          youtube_id?: string
          title?: string
          description?: string
          thumbnail_url?: string
          genres?: string[]
          is_ad_active?: boolean
          representative_video_id?: string | null
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          post_id: string
          user_id: string
          rating: number | null
          comment: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          rating?: number | null
          comment: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          rating?: number | null
          comment?: string
          created_at?: string
        }
      }
      ads: {
        Row: {
          id: string
          post_id: string
          stripe_session_id: string
          plan: string
          expires_at: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          stripe_session_id: string
          plan: string
          expires_at: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          stripe_session_id?: string
          plan?: string
          expires_at?: string
          created_at?: string
        }
      }
      user_events: {
        Row: {
          id: string
          user_id: string
          event_type: 'view' | 'open_youtube' | 'filter_genre' | 'like' | 'skip'
          post_id: string | null
          meta: Record<string, unknown> | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          event_type: 'view' | 'open_youtube' | 'filter_genre' | 'like' | 'skip'
          post_id?: string | null
          meta?: Record<string, unknown> | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          event_type?: 'view' | 'open_youtube' | 'filter_genre' | 'like' | 'skip'
          post_id?: string | null
          meta?: Record<string, unknown> | null
          created_at?: string
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}
