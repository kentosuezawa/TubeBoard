# 📺 TubeBoard

YouTube上に無限に存在する動画・チャンネルを、ジャンル・文脈・第三者視点で整理し、"新しい発見"を取り戻すための探索支援Webサービス

## 目的

YouTubeのレコメンドAIは過去の視聴や似た傾向を優先するため、新しいジャンルや未知の良質コンテンツに出会いづらい。**TubeBoard は YouTubeの"再生体験"ではなく、"探す体験"を再設計する**ことを目的とする。

詳細は [SPEC.md](./SPEC.md) を参照。

---

## セットアップ

### 前提

- Node.js 18+
- npm / yarn / pnpm

### 環境変数

`.env.local.example` をコピーして `.env.local` を作成し、以下を設定：

```bash
cp .env.local.example .env.local
```

- `NEXT_PUBLIC_SUPABASE_URL` - SupabaseプロジェクトのURL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabaseの公開キー
- `SUPABASE_SERVICE_ROLE_KEY` - Supabaseのサービスロールキー
- `YOUTUBE_API_KEY` - YouTube Data API キー
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe公開キー
- `STRIPE_SECRET_KEY` - Stripe秘密キー
- `STRIPE_WEBHOOK_SECRET` - Stripeウェブフック署名

### インストール

```bash
npm install
```

### 開発サーバー起動

```bash
npm run dev
```

http://localhost:3000 で起動します

### ビルド

```bash
npm run build
npm start
```

---

## プロジェクト構造

```
TubeBoard/
├── app/                           # Next.js App Router
│   ├── api/                       # API Routes
│   │   ├── posts/create           # POST 投稿作成
│   │   ├── feed                   # GET フィード取得
│   │   ├── events                 # POST イベント記録
│   │   └── stripe/webhook         # POST Stripeウェブフック
│   ├── feed/                      # フィードページ
│   ├── layout.tsx                 # ルートレイアウト
│   └── page.tsx                   # ホームページ
│
├── components/                    # React コンポーネント
│   ├── Feed.tsx                   # フィードコンポーネント（Swiper版）
│   └── PostCard.tsx               # 投稿カード
│
├── lib/                           # ユーティリティ
│   ├── supabase/
│   │   ├── client.ts              # Supabaseクライアント
│   │   └── types.ts               # 型定義
│   └── youtube/
│       ├── urlNormalizer.ts       # URL正規化
│       └── apiClient.ts           # YouTube API クライアント
│
├── styles/                        # スタイル
│   └── globals.css                # グローバルCSS
│
├── supabase/migrations/           # DB マイグレーション
│   └── 001_init_schema.sql
│
├── public/                        # 静的ファイル
│
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
├── postcss.config.js
├── .eslintrc.json
├── .gitignore
└── SPEC.md                        # 実装仕様書
```

---

## 技術スタック

- **Frontend**: Next.js 14 (App Router) + React 18
- **スタイル**: Tailwind CSS
- **データベース / Auth**: Supabase
- **決済**: Stripe
- **外部API**: YouTube Data API v3
- **UI生成**: Swiper.js（縦スワイプ）
- **言語**: TypeScript

---

## 実装進捗（MVP）

### Phase 1: 基本機能
- [x] YouTube URL 正規化
- [x] YouTube Data API クライアント
- [x] DB スキーマ定義
- [x] API サーフェス設計
- [x] Component 骨組み
- [ ] Supabase セットアップ（実際の接続）
- [ ] 認証（Auth）実装
- [ ] イベント記録サーバー実装

### Phase 2: UI / UX
- [ ] フィード表示（実際のデータ表示）
- [ ] ジャンルフィルタ
- [ ] レビュー機能

### Phase 3: 有料告知（PR）
- [ ] Stripe Checkout 統合
- [ ] Webhook 処理（実装）
- [ ] PR 有効期限管理

### Phase 4: 分析 / ログ
- [ ] 行動ログ記録（実装）
- [ ] ダッシュボード

---

## API仕様

### POST /api/posts/create

投稿を作成する

```json
{
  "youtube_url": "https://youtube.com/watch?v=xxxxx",
  "genres": ["Tech", "Coding"]
}
```

レスポンス:
```json
{
  "kind": "video",
  "youtube_id": "xxxxx",
  "title": "...",
  "description": "...",
  "thumbnail_url": "...",
  "genres": ["Tech", "Coding"]
}
```

### GET /api/feed

フィードを取得

```
GET /api/feed?limit=20&offset=0
```

レスポンス:
```json
{
  "posts": [
    {
      "id": "uuid",
      "kind": "video",
      "youtube_id": "...",
      "title": "...",
      "is_ad_active": false,
      ...
    }
  ]
}
```

### POST /api/events

イベントを記録

```json
{
  "event_type": "view",
  "post_id": "uuid",
  "meta": { "duration_watched": 30 }
}
```

### POST /api/stripe/webhook

Stripe からのウェブフック

イベント:
- `checkout.session.completed` - PR購入完了後処理
- `charge.refunded` - 返金時処理

---

## DB マイグレーション

Supabase に以下を実行：

```sql
-- supabase/migrations/001_init_schema.sql の内容を実行
```

または Supabase CLI:

```bash
supabase db push
```

---

## 次のステップ

1. `.env.local` を設定（Supabase, YouTube API, Stripe）
2. `npm install` でパッケージをインストール
3. Supabase マイグレーション実行
4. `npm run dev` で開発サーバー起動
5. API にダミーリクエストを送信してテスト

---

## ライセンス

MIT

---

## 開発者向けメモ

このプロジェクトは **ライブコーディング対応の実装仕様書** をベースに開発されています。詳細は [SPEC.md](./SPEC.md) を参照してください。