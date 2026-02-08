# TubeBoard 開発ガイド

このドキュメントは TubeBoard の開発者向けの詳細なセットアップ・開発方法を記載しています。

---

## セットアップ手順

### 1. 環境変数の設定

`.env.local.example` をコピーして `.env.local` を作成：

```bash
cp .env.local.example .env.local
```

各項目を入力：

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx

# YouTube Data API
YOUTUBE_API_KEY=xxxxx

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### 2. 依存パッケージのインストール

```bash
npm install
```

### 3. Supabase セットアップ

#### 3-1. Supabase プロジェクト作成

https://supabase.com で新規プロジェクトを作成

#### 3-2. データベーススキーマの実行

Supabase Dashboard > SQL Editor で以下を実行：

```sql
-- supabase/migrations/001_init_schema.sql の内容をコピペ
```

または Supabase CLI を使用：

```bash
supabase db push
```

#### 3-3. RLS（Row Level Security）の確認

Supabase Dashboard > Authentication > Policies で、各テーブルのポリシーが正しく設定されていることを確認

### 4. YouTube Data API キーの取得

1. https://console.cloud.google.com で新規プロジェクト作成
2. YouTube Data API v3 を有効化
3. サービスアカウント / OAuth 2.0 認証情報を作成
4. API キーを `.env.local` に設定

### 5. Stripe セットアップ

1. https://stripe.com で アカウント作成
2. Dashboard > API Keys から公開キー・秘密キーを取得
3. ウェブフック設定:
   - 開発環境: Stripe CLI (`stripe listen --forward-to localhost:3000/api/stripe/webhook`)
   - 本番環境: Stripe Dashboard から設定

### 6. 開発サーバー起動

```bash
npm run dev
```

http://localhost:3000 で起動

---

## ディレクトリ構造詳細

### `/app`

Next.js App Router ページとAPI ルート

- `layout.tsx` - ルートレイアウト（全ページ共通）
- `page.tsx` - ホームページ `/`
- `feed/page.tsx` - フィード画面 `/feed`
- `api/` - API Routes
  - `posts/create/route.ts` - POST 投稿作成
  - `feed/route.ts` - GET フィード取得
  - `events/route.ts` - POST イベント記録
  - `stripe/webhook/route.ts` - Stripeウェブフック受信

### `/components`

再利用可能なReact コンポーネント

- `Feed.tsx` - メインフィード（Swiper.js使用）
- `PostCard.tsx` - 投稿カード表示

### `/lib`

ユーティリティ・共有ロジック

```
lib/
├── supabase/
│   ├── client.ts - Supabaseクライアント初期化
│   └── types.ts - 型定義（Database）
└── youtube/
    ├── urlNormalizer.ts - YouTube URL 正規化
    └── apiClient.ts - YouTube Data API v3 クライアント
```

### `/styles`

グローバルスタイル

- `globals.css` - Tailwind CSS + カスタムスタイル

### `/supabase/migrations`

Supabase マイグレーション（SQL）

- `001_init_schema.sql` - テーブル・ポリシー定義

---

## 開発フロー

### ブランチ戦略（例）

```
main - 本番環境
  ↑
develop - 開発環境
  ↑
feature/* - 機能開発
```

### コミットメッセージ

```
[tag] description

例:
[feat] YouTube URL正規化機能追加
[fix] フィードの順序バグ修正
[docs] READMEの更新
[chore] 依存ライブラリ更新
```

---

## テスト

### TypeScript 型チェック

```bash
npm run type-check
```

### ESLint

```bash
npm run lint
```

### 手動テスト

#### API テストの例

**YouTube URL正規化:**

```bash
curl -X POST http://localhost:3000/api/posts/create \
  -H "Content-Type: application/json" \
  -d '{
    "youtube_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "genres": ["Music"]
  }'
```

**フィード取得:**

```bash
curl http://localhost:3000/api/feed?limit=5&offset=0
```

**イベント記録:**

```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "view",
    "post_id": "uuid-here",
    "meta": { "duration_watched": 60 }
  }'
```

---

## 実装タスク（優先順）

### Phase 1: 基本機能 ✓ 部分完了

- [x] YouTube URL 正規化
- [x] YouTube API クライアント実装
- [x] DB スキーマ定義・RLS設定
- [x] API ルート設計
- [x] コンポーネント骨組み
- [ ] **Supabase 実際の接続テスト**
- [ ] **認証実装（Supabase Auth）**
- [ ] **イベント記録サーバー実装**

### Phase 2: フロントエンド

- [ ] Feed コンポーネント実装（実データ表示）
- [ ] ジャンルフィルタコンポーネント
- [ ] 投稿作成フォーム
- [ ] レビューコンポーネント

### Phase 3: 有料告知（PR）

- [ ] Stripe Checkout 統合
- [ ] Webhook 本実装
- [ ] PR期限管理・表示

### Phase 4: 分析・拡張

- [ ] 行動ログ集計
- [ ] ダッシュボード
- [ ] AI推薦ベース（将来）

---

## 認証（要実装）

### Supabase Auth との統合

```typescript
// 例: ログイン
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
})

// user_id を取得
const { data: { user } } = await supabase.auth.getUser()
const userId = user?.id
```

### API での認証確認

```typescript
// middleware.ts または API ルート内で確認
const token = req.headers.get('Authorization')?.split(' ')[1]
const { data } = await supabase.auth.getUser(token)
```

---

## デバッグ

### Supabase ログ確認

```bash
supabase logs <service> --project-ref <project-ref>
```

### ブラウザコンソール

- Network タブ: API リクエスト確認
- Console: エラーメッセージ確認

### サーバーログ

```bash
npm run dev
# ターミナルに出力される
```

---

## デプロイ

### Vercel へのデプロイ（推奨）

1. GitHub リポジトリ作成・プッシュ
2. https://vercel.com で接続
3. 環境変数設定
4. デプロイ

```bash
# プロジェクト root で
git push
# Vercel が自動デプロイ
```

### セルフホスティング

```bash
npm run build
npm start
# http://localhost:3000
```

---

## トラブルシューティング

### Supabase 接続エラー

```
Error: Supabase configuration is missing
```

→ `.env.local` に `NEXT_PUBLIC_SUPABASE_URL` と `NEXT_PUBLIC_SUPABASE_ANON_KEY` が設定されているか確認

### YouTube API エラー

```
YouTube API error: Unauthorized
```

→ `YOUTUBE_API_KEY` が正しく設定されているか確認

### Stripe Webhook エラー

```
Invalid signature
```

→ `STRIPE_WEBHOOK_SECRET` が正しく設定されているか、ローカルテストは Stripe CLI で実行しているか確認

---

## 参考リンク

- [Next.js ドキュメント](https://nextjs.org/docs)
- [Supabase ドキュメント](https://supabase.com/docs)
- [YouTube Data API v3](https://developers.google.com/youtube/v3)
- [Stripe ドキュメント](https://stripe.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Swiper.js](https://swiperjs.com)

---

質問や問題がある場合は、Issues を作成してください。

