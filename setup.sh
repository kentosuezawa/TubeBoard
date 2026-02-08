#!/bin/bash

# TubeBoard セットアップスクリプト
# このスクリプトは初回セットアップを自動化します

set -e

echo "🚀 TubeBoard セットアップ開始..."
echo ""

# Step 1: 依存関係のインストール
echo "📦 依存関係をインストール中..."
if [ ! -d "node_modules" ]; then
  npm install
else
  echo "✅ node_modules はすでに存在します"
fi
echo ""

# Step 2: 環境変数ファイルの作成
echo "⚙️  環境変数ファイルを確認中..."
if [ ! -f ".env.local" ]; then
  echo "📝 .env.local を作成中..."
  cp .env.local.example .env.local
  echo "✅ .env.local を作成しました"
  echo "⚠️  注意: 実際のAPIキーを設定してください"
else
  echo "✅ .env.local はすでに存在します"
fi
echo ""

# Step 3: TypeScript型チェック
echo "🔍 TypeScript型チェック中..."
npm run type-check
echo "✅ 型チェック完了"
echo ""

# Step 4: ESLint
echo "🧹 ESLintチェック中..."
npm run lint || echo "⚠️  Lintの警告がありますが、続行します"
echo ""

# セットアップ完了
echo "✅ セットアップ完了！"
echo ""
echo "次のステップ:"
echo "1. .env.local にAPIキーを設定"
echo "2. 開発サーバーを起動: npm run dev"
echo "3. ブラウザで http://localhost:3000 を開く"
echo ""
echo "詳細は QUICKSTART.md を参照してください"
