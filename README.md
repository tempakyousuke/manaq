# Learn — プログラミング学習サイト

知識を「読む」だけで終わらせず、その場で **4択問題** に挑戦して理解を確かめられる学習サイトです。
ジャンルは後から追加していける設計になっています（第1弾は **Claude Code**）。

## 技術スタック

- [Vite+](https://viteplus.dev/)（`vp` CLI）+ React 18 + TypeScript
- ルーティング: React Router（ハッシュルーター）
- 学習コンテンツ: `src/data/genres/` 配下の JSON

## 開発

```bash
vp dev       # 開発サーバー起動（HMR）
vp build     # 本番ビルド（dist/ に出力）
vp preview   # ビルド結果をプレビュー
vp check     # 整形・Lint・型チェックをまとめて実行
```

> `vp` が見つからない場合は新しいターミナルを開くか、Vite+ をインストールしてください:
> `curl -fsSL https://vite.plus | bash`

## ディレクトリ構成

```
src/
├── main.tsx              エントリ & ルーティング定義
├── App.tsx               共通レイアウト（ヘッダー/フッター）
├── types.ts              コンテンツの型定義
├── styles.css            スタイル
├── data/
│   ├── index.ts          ジャンルの自動読み込み・取得ヘルパ
│   └── genres/
│       ├── _schema.md    JSON の書き方
│       └── claude-code.json
└── components/
    ├── Home.tsx          ジャンル一覧
    ├── GenreView.tsx     ジャンル詳細（学習コンテンツ + 各クイズへの導線）
    ├── QuizPage.tsx      クイズのルーティング解決
    ├── Quiz.tsx          4択クイズ本体
    └── RichText.tsx      本文レンダラ（段落・インラインコード）
```

## 新しいジャンルを追加する

1. `src/data/genres/` に `<ジャンル名>.json` を作成
2. [`src/data/genres/_schema.md`](src/data/genres/_schema.md) の形式に沿って `topics` を記述
3. 開発サーバーが起動していれば自動で反映（`import.meta.glob` で自動読み込み）

コードを一切触らず、JSON を 1 つ置くだけでジャンルが増えます。
