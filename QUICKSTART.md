# 🚀 TubeBoard クイックスタート

このガイドでは、TubeBoardを最速でローカル環境で動かす手順を説明します。

---

## 前提条件

- Node.js 18+ がインストール済み
- npm / yarn / pnpm が利用可能

---

## ステップ 1: 依存関係のインストール

```bash
npm install
```

---

## ステップ 2: 環境変数の設定

`.env.local` ファイルを作成（すでに作成済みの場合はスキップ）：

```bash
cp .env.local.example .env.local
```

### 最低限の設定（モック動作用）

動作確認のみの場合、デフォルト値のままでOKです。

### 実際の機能を使う場合

以下のサービスからAPIキーを取得して設定：

#### Supabase

1. https://supabase.com でアカウント作成
2. 新規プロジェクト作成
3. Settings > API から以下を取得：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. SQL Editor で `supabase/migrations/001_init_schema.sql` を実行

#### YouTube Data API

1. https://console.cloud.google.com にアクセス
2. 新規プロジェクト作成
3. YouTube Data API v3 を有効化
4. 認証情報 > APIキー を作成
5. `YOUTUBE_API_KEY` に設定

#### Stripe（オプション: 有料告知機能用）

1. https://stripe.com でアカウント作成
2. Developers > API Keys から取得
3. 以下を設定：
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`

---

## ステップ 3: 開発サーバー起動

```bash
npm run dev
```

サーバーが起動したら、以下にアクセス：

**トップページ**: http://localhost:3000

---

## 動作確認

### ✅ チェックリスト

- [ ] トップページが表示される
- [ ] `/feed` にアクセスできる
- [ ] TypeScript エラーがない (`npm run type-check`)
- [ ] ESLint エラーがない (`npm run lint`)

### 主要ページ

| URL | 説明 |
|-----|------|
| `/` | ホームページ |
| `/feed` | フィード（縦スワイプUI） |
| `/api/feed` | フィードAPI（JSON） |

---

## トラブルシューティング

### ポート 3000 が使用中

```bash
# 別のポートで起動
PORT=3001 npm run dev
```

### TypeScript エラー

```bash
npm run type-check
```

### ビルドエラー

```bash
# node_modules を削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

---

## 次のステップ

開発サーバーが起動したら：

1. **Supabase セットアップ** - [DEVELOPMENT.md](./DEVELOPMENT.md) の手順を参照
2. **YouTube API 設定** - 実際の動画データ取得
3. **認証実装** - ユーザーログイン機能追加
4. **投稿機能テスト** - `/api/posts/create` でYouTube動画登録

---

## 参考ドキュメント

- [README.md](./README.md) - プロジェクト概要
- [SPEC.md](./SPEC.md) - 完全な実装仕様書
- [DEVELOPMENT.md](./DEVELOPMENT.md) - 開発者向け詳細ガイド

---

## コマンド一覧

```bash
# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# 本番サーバー起動
npm start

# 型チェック
npm run type-check

# Linter
npm run lint
```

---

## サポート

問題がある場合は、GitHub Issues を作成してください：
https://github.com/kentosuezawa/TubeBoard/issues
