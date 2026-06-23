import { Link, useParams } from "react-router-dom";
import { getGenre } from "../data/index.ts";
import RichText from "./RichText.tsx";

export default function GenreView() {
  const { genreId } = useParams();
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

  const totalQuestions = genre.topics.reduce(
    (sum, t) => sum + t.questions.length,
    0,
  );

  return (
    <div>
      <nav className="breadcrumb">
        <Link to="/">ジャンル一覧</Link>
        <span>/</span>
        <span>{genre.title}</span>
      </nav>

      <header className="genre-header">
        <span className="genre-header-icon">{genre.icon}</span>
        <div>
          <h1>{genre.title}</h1>
          <p>{genre.description}</p>
        </div>
      </header>

      <div className="cta-row">
        <Link to={`/genre/${genre.id}/quiz`} className="btn btn-primary">
          🎯 全{totalQuestions}問で腕試し
        </Link>
      </div>

      <div className="topic-list">
        {genre.topics.map((topic, index) => (
          <section key={topic.id} className="topic-card">
            <div className="topic-head">
              <span className="topic-number">{index + 1}</span>
              <div>
                <h2>{topic.title}</h2>
                {topic.summary && <p className="topic-summary">{topic.summary}</p>}
              </div>
            </div>

            <div className="lessons">
              {topic.lessons.map((lesson, i) => (
                <article key={i} className="lesson">
                  <h3>{lesson.heading}</h3>
                  <div className="lesson-body">
                    <RichText text={lesson.body} />
                  </div>
                </article>
              ))}
            </div>

            {topic.questions.length > 0 && (
              <div className="topic-quiz-cta">
                <Link
                  to={`/genre/${genre.id}/topic/${topic.id}/quiz`}
                  className="btn btn-primary"
                >
                  ✏️ このトピックの{topic.questions.length}問に挑戦
                </Link>
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
