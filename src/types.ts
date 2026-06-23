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
}

export interface Topic {
  id: string;
  title: string;
  summary?: string;
  lessons: Lesson[];
  questions: Question[];
}

export interface Genre {
  id: string;
  title: string;
  description: string;
  icon: string;
  order?: number;
  topics: Topic[];
}

/** クイズ用に、出題元トピック情報を付与した問題 */
export interface QuizQuestion extends Question {
  topicId: string;
  topicTitle: string;
}
