// ジャンルの自動読み込み。
// src/data/genres/ 配下に *.json を置くだけで新しいジャンルが追加されます。
// JSON の形式は src/data/genres/_schema.md を参照してください。

import type { Genre, QuizQuestion } from "../types.ts";

const modules = import.meta.glob<{ default: Genre }>("./genres/*.json", {
  eager: true,
});

export const genres: Genre[] = Object.entries(modules)
  .map(([path, mod]) => {
    const data = mod.default;
    // ファイル名を fallback の id に使う（id 未指定でも動くように）
    const fileId = path.replace("./genres/", "").replace(".json", "");
    return { order: 999, ...data, id: data.id ?? fileId };
  })
  .sort(
    (a, b) =>
      (a.order ?? 999) - (b.order ?? 999) ||
      a.title.localeCompare(b.title, "ja"),
  );

export function getGenre(id: string): Genre | undefined {
  return genres.find((g) => g.id === id);
}

export function getTopic(genreId: string, topicId: string) {
  const genre = getGenre(genreId);
  const topic = genre?.topics.find((t) => t.id === topicId);
  return genre && topic ? { genre, topic } : undefined;
}

// ジャンル内の全問題をフラットに集める（ジャンル丸ごとクイズ用）
export function getAllQuestions(genreId: string): QuizQuestion[] {
  const genre = getGenre(genreId);
  if (!genre) return [];
  return genre.topics.flatMap((t) =>
    t.questions.map((q) => ({
      ...q,
      topicId: t.id,
      topicTitle: t.title,
    })),
  );
}
