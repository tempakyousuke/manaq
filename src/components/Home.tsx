import { Link } from "react-router-dom";
import { genres } from "../data/index.ts";
import { useGenreProgress } from "../data/progress.ts";
import type { Genre } from "../types.ts";

export default function Home() {
  return (
    <div>
      <section className="hero">
        <h1>読むだけで終わらせない学習サイト</h1>
        <p>
          各ジャンルの知識を学んだら、その場で4択問題に挑戦。
          理解できているか、すぐに確かめられます。
        </p>
      </section>

      <h2 className="section-title">ジャンルを選ぶ</h2>
      <div className="genre-grid">
        {genres.map((genre) => (
          <GenreCard key={genre.id} genre={genre} />
        ))}
      </div>
    </div>
  );
}

function GenreCard({ genre }: { genre: Genre }) {
  const summary = useGenreProgress(genre);
  const topicCount = genre.topics.length;
  const questionCount = genre.topics.reduce((sum, t) => sum + t.questions.length, 0);
  return (
    <Link to={`/genre/${genre.id}`} className="genre-card">
      <span className="genre-icon">{genre.icon}</span>
      <h3>{genre.title}</h3>
      <p>{genre.description}</p>
      <div className="genre-meta">
        <span>{topicCount} トピック</span>
        <span>{questionCount} 問</span>
      </div>
      <div className="genre-progress">
        <div className="genre-progress-track">
          <div className="genre-progress-fill" style={{ width: `${summary.ratio * 100}%` }} />
        </div>
        <span className="genre-progress-label">
          {summary.mastered}/{summary.total} 習得
        </span>
      </div>
    </Link>
  );
}
