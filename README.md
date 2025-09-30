# 📊 YouTube勉強時間トラッカー - 公開統計ページ

このプロジェクトは、YouTube勉強時間トラッカーのデータを静的サイト生成（SSG）で可視化する公開統計ページです。

## ✨ 機能

- 📈 **統計概要**: 総ユーザー数、総勉強時間、平均勉強時間を表示
- 📊 **データ可視化**: Rechartsライブラリによるインタラクティブなグラフ表示
- 🏆 **ランキング**: トップユーザーの勉強時間ランキング
- 🚀 **静的サイト生成**: Next.jsのSSGで高速なページ表示
- 📱 **レスポンシブデザイン**: モバイルフレンドリーなUI

## 🛠 技術スタック

- **フレームワーク**: Next.js 15
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS 4
- **グラフライブラリ**: Recharts
- **ビルド**: 静的サイト生成（SSG）

## 📦 セットアップ

1. 依存関係のインストール:
   ```bash
   npm install
   ```

2. 環境変数の設定（オプション）:
   ```bash
   # 本番環境でのAPI URL
   export PARENT_API_URL=https://your-domain.com
   ```

## 🚀 開発・ビルド

### 開発サーバーの起動
```bash
npm run dev
```

### 静的サイトのビルド
```bash
# 方法1: NPMスクリプト
npm run build

# 方法2: 専用スクリプト
./build-static.sh
```

### ビルドされたサイトの確認
```bash
# serveパッケージを使用
npx serve out

# または他のHTTPサーバー
python -m http.server --directory out
```

## 📁 プロジェクト構造

```
src/
├── components/          # Reactコンポーネント
│   ├── StatsOverview.tsx    # 統計概要カード
│   ├── StudyTimeChart.tsx   # グラフ表示
│   └── TopUsersList.tsx     # ランキングリスト
├── types/              # TypeScript型定義
│   └── stats.ts            # API レスポンス型
├── utils/              # ユーティリティ
│   └── api.ts              # API呼び出し
├── pages/              # Next.jsページ
│   └── index.tsx           # メインページ
└── styles/             # スタイルシート
    └── globals.css         # グローバルCSS
```

## 🔌 API連携

このアプリは親プロジェクトの `/api/public-stats` エンドポイントからデータを取得します：

```typescript
interface PublicStatsResponse {
  totalUsers: number;
  totalStudyTimeHours: number;
  topUsers: Array<{
    name: string;
    timeHours: number;
    rank: number;
  }>;
  dailyStats: Array<{
    date: string;
    totalTimeHours: number;
    userCount: number;
  }>;
}
```

## 🚢 デプロイ

### GitHub Pages（推奨）

#### 自動デプロイ（GitHub Actions）
1. GitHubリポジトリの Settings > Pages で Source を "GitHub Actions" に設定
2. `main` ブランチにpushすると自動的にデプロイされます
3. デプロイされたサイトは `https://username.github.io/youtube-study-time-tracker/` でアクセス可能

#### 手動デプロイ
```bash
# 手動でgh-pagesブランチにデプロイ
npm run deploy

# 特定のリポジトリにデプロイ
npm run deploy:github
```

### 環境変数の設定
GitHubリポジトリの Settings > Secrets and variables > Actions で以下を設定：

- **Variables**: `PARENT_API_URL` = 本番APIのURL（例：`https://your-domain.com`）

### 静的ファイルホスティング
1. `npm run build` を実行
2. `out/` ディレクトリの内容をWebサーバーにアップロード

### Vercel
```bash
vercel --prod
```

## ⚙️ 設定

### Next.js設定（next.config.ts）
- `output: 'export'`: 静的サイト生成を有効化
- `trailingSlash: true`: URLの末尾にスラッシュを追加
- `images.unoptimized: true`: 静的エクスポート用の画像最適化設定

### 再生成間隔
- 通常時: 5分毎に再生成（`revalidate: 300`）
- エラー時: 1分毎に再試行（`revalidate: 60`）

## 🎨 カスタマイズ

### カラーテーマの変更
`src/components/StudyTimeChart.tsx` の `COLORS` 配列を編集

### レイアウトの調整
各コンポーネントのTailwindクラスを変更

### データ表示の変更
`src/pages/index.tsx` の `getStaticProps` 関数内でデータ処理をカスタマイズ
