import { Link, useParams } from "react-router-dom";
import { getGenre, getAllQuestions } from "../data/index.ts";
import type { Question } from "../types.ts";
import Quiz from "./Quiz.tsx";

export default function QuizPage() {
  const { genreId, topicId } = useParams();
  const genre = genreId ? getGenre(genreId) : undefined;

  if (!genre) {
    return (
      <div className="empty-state">
        <p>ジャンルが見つかりませんでした。</p>
        <Link to="/" className="btn">
          トップに戻る
        </Link>
      </div>
    );
  }

  let questions: Question[];
  let title: string;

  if (topicId) {
    const topic = genre.topics.find((t) => t.id === topicId);
    if (!topic) {
      return (
        <div className="empty-state">
          <p>トピックが見つかりませんでした。</p>
          <Link to={`/genre/${genre.id}`} className="btn">
            戻る
          </Link>
        </div>
      );
    }
    questions = topic.questions;
    title = topic.title;
  } else {
    questions = getAllQuestions(genre.id);
    title = `${genre.title} 総合`;
  }

  return (
    <div>
      <nav className="breadcrumb">
        <Link to="/">ジャンル一覧</Link>
        <span>/</span>
        <Link to={`/genre/${genre.id}`}>{genre.title}</Link>
        <span>/</span>
        <span>クイズ</span>
      </nav>
      <Quiz
        key={`${genre.id}/${topicId ?? "all"}`}
        questions={questions}
        title={title}
        backTo={`/genre/${genre.id}`}
      />
    </div>
  );
}
