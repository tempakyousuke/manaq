# Learn — プログラミング学習サイト

知識を読むだけで終わらせず、その場で4択問題に挑戦して理解を確かめる学習サイト。
ジャンルは後から追加できる設計。第1弾は Claude Code（当面はこの1ジャンルのみ）。

## 技術スタック（重要）

- **ビルドツールは Vite+（`vp` CLI）。素の Vite ではない別物。** `vite` は `package.json` の
  overrides で `@voidzero-dev/vite-plus-core` に解決される。`vite.config.ts` は `vite-plus` の
  `defineConfig` を使う。
- React 18 + TypeScript。ルーティングは React Router の **ハッシュルーター**（`createHashRouter`）。
- React プラグインは **`@vitejs/plugin-react-oxc`**（Vite+ は Rolldown/Oxc ベースなので、
  `@vitejs/plugin-react` ではなくこちらを使う）。

## コマンド

```bash
vp dev       # 開発サーバー（HMR）
vp build     # 本番ビルド（tsc → vp build。dist/ に出力）
vp check     # 整形・Lint・型チェックをまとめて実行
vp install   # 依存インストール
```

- `vp` が PATH に無い場合は新しいターミナルを開く（インストール時に `~/.zshenv` 等へ設定済み）。
  直接呼ぶなら `~/.vite-plus/bin/vp`。
- TypeScript は厳格設定（`noUnusedLocals` / `noUnusedParameters` など）。未使用の変数・引数を残さない。

## アーキテクチャ

- **学習コンテンツはコードと分離**。`src/data/genres/*.json` を `import.meta.glob`（eager）で
  自動読み込みする（`src/data/index.ts`）。**ジャンル追加＝JSON を1つ置くだけ**でコード変更不要。
- 型は `src/types.ts`（Genre / Topic / Lesson / Question）。JSON の書き方は
  `src/data/genres/_schema.md` に記載。`_` 始まりや `.json` 以外のファイルは読み込まれない。
- 画面: `Home`（ジャンル一覧）→ `GenreView`（学習コンテンツ＋各クイズへの導線）→
  `QuizPage`（出題セットの解決）→ `Quiz`（4択本体）。本文の段落/インラインコードは `RichText` が描画。

## コンテンツ作成のルール

- 各 `question` の `choices` は **4つ**、`answer` は **0始まりの正解インデックス**、`explanation` は必須。
- クイズ表示時に選択肢は**シャッフル**される（`Quiz.tsx`）。正解は順序ではなく内容で判定すること。
- ジャンル内 `topic.id` は一意にする。

## 検証

変更後は **JSON の妥当性 → `vp build`** で確認する。問題データを足したら 4択・正解index・解説の
有無もチェックする（`answer` が範囲外だと実行時まで気づきにくい）。
