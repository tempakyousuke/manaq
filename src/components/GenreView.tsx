import { Link, useParams } from "react-router-dom";
import { getGenre } from "../data/index.ts";

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

      <p className="section-title">
        トピック一覧（{genre.topics.length}件）
      </p>

      <div className="topic-grid">
        {genre.topics.map((topic, index) => (
          <Link
            key={topic.id}
            to={`/genre/${genre.id}/topic/${topic.id}`}
            className="topic-tile"
          >
            <div className="topic-tile-head">
              <span className="topic-number">{index + 1}</span>
              <h2>{topic.title}</h2>
            </div>
            {topic.summary && (
              <p className="topic-tile-summary">{topic.summary}</p>
            )}
            <div className="topic-tile-meta">
              <span>📖 {topic.lessons.length}レッスン</span>
              {topic.questions.length > 0 && (
                <span>✏️ {topic.questions.length}問</span>
              )}
              <span className="topic-tile-arrow">→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
