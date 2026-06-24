// 習熟度（学習進捗）の管理。
// クイズ結果を localStorage に保存し、トピック単位で習熟度を算出します。
// バックエンド不要・この端末のこのブラウザにのみ保存されます。

import { useSyncExternalStore } from "react";
import type { Genre } from "../types.ts";

const STORAGE_KEY = "learn.progress.v1";

/** トピック単位の学習記録 */
export interface TopicProgress {
  /** 挑戦回数 */
  attempts: number;
  /** ベスト記録での正答数 */
  bestCorrect: number;
  /** ベスト記録での出題数 */
  bestTotal: number;
  /** 直近の正答数 */
  lastCorrect: number;
  /** 直近の出題数 */
  lastTotal: number;
  /** 最終挑戦日（ISO "YYYY-MM-DD"） */
  lastAt: string;
}

export type Mastery = "untouched" | "learning" | "mastered";

/** ベスト正答率がこの値以上なら「習得済み」とみなす */
export const MASTERY_THRESHOLD = 0.8;

type Store = Record<string, TopicProgress>;

/** `${genreId}/${topicId}` 形式の保存キーを作る */
export function progressKey(genreId: string, topicId: string): string {
  return `${genreId}/${topicId}`;
}

function read(): Store {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as Store) : {};
  } catch {
    return {};
  }
}

function write(store: Store): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // 容量超過やプライベートモード等は黙って無視（学習体験を止めない）
  }
  emit();
}

// --- React 連携（useSyncExternalStore 用の購読機構） -----------------------

const listeners = new Set<() => void>();

function emit(): void {
  for (const l of listeners) l();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  // 別タブでの更新も反映する
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) emit();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

// store 全体のスナップショットをキャッシュし、参照同一性を保つ
let snapshot: Store = read();

function getSnapshot(): Store {
  return snapshot;
}

function refreshSnapshot(): void {
  snapshot = read();
}

listeners.add(refreshSnapshot); // 変更時にスナップショットを更新

// --- 公開 API ---------------------------------------------------------------

/** クイズ結果を1件記録する（ベストは自動更新） */
export function recordResult(
  key: string,
  correct: number,
  total: number,
  /** 記録日（テスト用に上書き可。通常は当日） */
  at: string = todayISO(),
): void {
  if (total <= 0) return;
  const store = read();
  const prev = store[key];
  const prevBestRatio = prev ? prev.bestCorrect / prev.bestTotal : -1;
  const thisRatio = correct / total;
  const isBest = thisRatio >= prevBestRatio;
  store[key] = {
    attempts: (prev?.attempts ?? 0) + 1,
    bestCorrect: isBest ? correct : prev!.bestCorrect,
    bestTotal: isBest ? total : prev!.bestTotal,
    lastCorrect: correct,
    lastTotal: total,
    lastAt: at,
  };
  write(store);
}

/** 保存済みの全進捗をリセットする */
export function resetAllProgress(): void {
  write({});
}

/** 進捗から習熟度を判定する */
export function masteryOf(p: TopicProgress | undefined): Mastery {
  if (!p || p.attempts === 0) return "untouched";
  return p.bestCorrect / p.bestTotal >= MASTERY_THRESHOLD ? "mastered" : "learning";
}

export const MASTERY_META: Record<Mastery, { label: string; icon: string; className: string }> = {
  untouched: { label: "未着手", icon: "○", className: "is-untouched" },
  learning: { label: "挑戦中", icon: "◐", className: "is-learning" },
  mastered: { label: "習得済み", icon: "●", className: "is-mastered" },
};

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

// --- React フック -----------------------------------------------------------

/** 進捗ストア全体を購読する（変更で再描画） */
function useProgressStore(): Store {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/** 指定トピックの進捗を取得する */
export function useTopicProgress(genreId: string, topicId: string): TopicProgress | undefined {
  const store = useProgressStore();
  return store[progressKey(genreId, topicId)];
}

export interface TopicMastery {
  progress: TopicProgress | undefined;
  mastery: Mastery;
}

/** ジャンル内の topicId → 習熟度のマップを取得する（ループ内 hook 呼び出しを避ける用） */
export function useGenreMastery(genre: Genre): Record<string, TopicMastery> {
  const store = useProgressStore();
  const result: Record<string, TopicMastery> = {};
  for (const topic of genre.topics) {
    const progress = store[progressKey(genre.id, topic.id)];
    result[topic.id] = { progress, mastery: masteryOf(progress) };
  }
  return result;
}

export interface GenreProgressSummary {
  total: number;
  mastered: number;
  learning: number;
  untouched: number;
  /** 全トピックの習得割合（0〜1） */
  ratio: number;
}

/** ジャンル全体の習熟度サマリーを取得する */
export function useGenreProgress(genre: Genre): GenreProgressSummary {
  const store = useProgressStore();
  const total = genre.topics.length;
  let mastered = 0;
  let learning = 0;
  for (const topic of genre.topics) {
    const m = masteryOf(store[progressKey(genre.id, topic.id)]);
    if (m === "mastered") mastered++;
    else if (m === "learning") learning++;
  }
  return {
    total,
    mastered,
    learning,
    untouched: total - mastered - learning,
    ratio: total > 0 ? mastered / total : 0,
  };
}
