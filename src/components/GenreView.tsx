import { Link, useParams } from "react-router-dom";
import { getGenre } from "../data/index.ts";
import {
  MASTERY_META,
  resetAllProgress,
  useGenreMastery,
  useGenreProgress,
} from "../data/progress.ts";

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

  return <GenreContent genre={genre} />;
}

function GenreContent({ genre }: { genre: NonNullable<ReturnType<typeof getGenre>> }) {
  const summary = useGenreProgress(genre);
  const masteryMap = useGenreMastery(genre);

  const totalQuestions = genre.topics.reduce((sum, t) => sum + t.questions.length, 0);

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

      <section className="mastery-panel">
        <div className="mastery-panel-head">
          <p className="section-title">習熟度</p>
          {summary.mastered + summary.learning > 0 && (
            <button
              type="button"
              className="mastery-reset"
              onClick={() => {
                if (
                  window.confirm("このサイトの学習進捗をすべてリセットします。よろしいですか？")
                ) {
                  resetAllProgress();
                }
              }}
            >
              進捗をリセット
            </button>
          )}
        </div>
        <div
          className="mastery-bar"
          role="img"
          aria-label={`習得 ${summary.mastered} / ${summary.total} トピック`}
        >
          {summary.mastered > 0 && (
            <span className="mastery-seg is-mastered" style={{ flex: summary.mastered }} />
          )}
          {summary.learning > 0 && (
            <span className="mastery-seg is-learning" style={{ flex: summary.learning }} />
          )}
          {summary.untouched > 0 && (
            <span className="mastery-seg is-untouched" style={{ flex: summary.untouched }} />
          )}
        </div>
        <div className="mastery-legend">
          <span>
            <i className="dot is-mastered" />
            習得済み {summary.mastered}
          </span>
          <span>
            <i className="dot is-learning" />
            挑戦中 {summary.learning}
          </span>
          <span>
            <i className="dot is-untouched" />
            未着手 {summary.untouched}
          </span>
          <span className="mastery-pct">{Math.round(summary.ratio * 100)}% 習得</span>
        </div>
      </section>

      <div className="cta-row">
        <Link to={`/genre/${genre.id}/quiz`} className="btn btn-primary">
          🎯 全{totalQuestions}問で腕試し
        </Link>
      </div>

      <p className="section-title">トピック一覧（{genre.topics.length}件）</p>

      <div className="topic-grid">
        {genre.topics.map((topic, index) => {
          const { progress, mastery } = masteryMap[topic.id];
          const meta = MASTERY_META[mastery];
          return (
            <Link key={topic.id} to={`/genre/${genre.id}/topic/${topic.id}`} className="topic-tile">
              <div className="topic-tile-head">
                <span className="topic-number">{index + 1}</span>
                <h2>{topic.title}</h2>
                <span className={`mastery-badge ${meta.className}`}>
                  <i className="badge-icon">{meta.icon}</i>
                  {meta.label}
                </span>
              </div>
              {topic.summary && <p className="topic-tile-summary">{topic.summary}</p>}
              <div className="topic-tile-meta">
                <span>📖 {topic.lessons.length}レッスン</span>
                {topic.questions.length > 0 && <span>✏️ {topic.questions.length}問</span>}
                {progress && (
                  <span className="topic-tile-best">
                    ベスト {Math.round((progress.bestCorrect / progress.bestTotal) * 100)}%
                  </span>
                )}
                <span className="topic-tile-arrow">→</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
