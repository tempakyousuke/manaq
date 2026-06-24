import { Link, useParams } from "react-router-dom";
import { getTopic } from "../data/index.ts";
import { MASTERY_META, masteryOf, useTopicProgress } from "../data/progress.ts";
import RichText from "./RichText.tsx";

export default function TopicView() {
  const { genreId, topicId } = useParams();
  const found = genreId && topicId ? getTopic(genreId, topicId) : undefined;
  const progress = useTopicProgress(genreId ?? "", topicId ?? "");

  if (!found) {
    return (
      <div className="empty-state">
        <p>トピックが見つかりませんでした。</p>
        <Link to={genreId ? `/genre/${genreId}` : "/"} className="btn">
          戻る
        </Link>
      </div>
    );
  }

  const { genre, topic } = found;
  const index = genre.topics.findIndex((t) => t.id === topic.id);
  const prev = index > 0 ? genre.topics[index - 1] : undefined;
  const next = index < genre.topics.length - 1 ? genre.topics[index + 1] : undefined;

  return (
    <div>
      <nav className="breadcrumb">
        <Link to="/">ジャンル一覧</Link>
        <span>/</span>
        <Link to={`/genre/${genre.id}`}>{genre.title}</Link>
        <span>/</span>
        <span>{topic.title}</span>
      </nav>

      <header className="topic-head">
        <span className="topic-number">{index + 1}</span>
        <div>
          <h1>{topic.title}</h1>
          {topic.summary && <p className="topic-summary">{topic.summary}</p>}
        </div>
      </header>

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
          {(() => {
            const meta = MASTERY_META[masteryOf(progress)];
            return (
              <div className="topic-mastery">
                <span className={`mastery-badge ${meta.className}`}>
                  <i className="badge-icon">{meta.icon}</i>
                  {meta.label}
                </span>
                {progress ? (
                  <span className="topic-mastery-stats">
                    ベスト {Math.round((progress.bestCorrect / progress.bestTotal) * 100)}% （直近{" "}
                    {progress.lastCorrect}/{progress.lastTotal}・{progress.attempts}回挑戦・最終{" "}
                    {progress.lastAt}）
                  </span>
                ) : (
                  <span className="topic-mastery-stats">まだ挑戦していません</span>
                )}
              </div>
            );
          })()}
          <Link to={`/genre/${genre.id}/topic/${topic.id}/quiz`} className="btn btn-primary">
            ✏️ このトピックの{topic.questions.length}問に挑戦
          </Link>
        </div>
      )}

      <div className="topic-nav">
        {prev ? (
          <Link to={`/genre/${genre.id}/topic/${prev.id}`} className="btn btn-ghost">
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to={`/genre/${genre.id}/topic/${next.id}`} className="btn btn-ghost">
            {next.title} →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
