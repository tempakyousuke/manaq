// 学習コンテンツの型定義。
// 詳しい JSON の書き方は src/data/genres/_schema.md を参照。

export interface Lesson {
  heading: string;
  body: string;
}

export interface Question {
  question: string;
  choices: string[];
  /** 正解の choices インデックス（0始まり） */
  answer: number;
  explanation: string;
  /** 最終更新日（ISO形式 "YYYY-MM-DD" / "YYYY-MM"）。未指定なら topic→genre の値を継承 */
  updated?: string;
}

export interface Topic {
  id: string;
  title: string;
  summary?: string;
  lessons: Lesson[];
  questions: Question[];
  /** トピック内の設問が継承する最終更新日のデフォルト */
  updated?: string;
}

export interface Genre {
  id: string;
  title: string;
  description: string;
  icon: string;
  order?: number;
  topics: Topic[];
  /** ジャンル全体の最終更新日のデフォルト（topic/question で上書き可） */
  updated?: string;
}

/** クイズ用に、出題元トピック情報を付与した問題 */
export interface QuizQuestion extends Question {
  topicId: string;
  topicTitle: string;
}
