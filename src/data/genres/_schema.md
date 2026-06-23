# ジャンルJSONの形式

`src/data/genres/` に `*.json` を追加すると、自動的に新しいジャンルとしてサイトに表示されます。
（`_` で始まるファイルはこのドキュメント用で、`*.json` 以外は読み込まれません）

```jsonc
{
  "id": "claude-code",          // URLに使う一意なID（省略時はファイル名）
  "title": "Claude Code",       // 表示名
  "description": "一行説明",
  "icon": "🤖",                  // 絵文字アイコン
  "order": 1,                    // 並び順（小さいほど先頭。省略可）
  "topics": [
    {
      "id": "basics",           // ジャンル内で一意
      "title": "基本概念",
      "summary": "このトピックの概要（任意）",
      "lessons": [
        { "heading": "見出し", "body": "本文。\n\nで段落、`code` でインラインコード。" }
      ],
      "questions": [
        {
          "question": "問題文",
          "choices": ["選択肢A", "選択肢B", "選択肢C", "選択肢D"],
          "answer": 0,          // 正解の choices インデックス（0始まり）
          "explanation": "解説文"
        }
      ]
    }
  ]
}
```

## 新しいジャンルを追加する手順

1. このフォルダに `<ジャンル名>.json` を作成する
2. 上の形式に沿って `topics` を書く
3. 開発サーバーが動いていれば自動で反映される
