import { Link } from "react-router-dom";
import { genres } from "../data/index.ts";

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
        {genres.map((genre) => {
          const topicCount = genre.topics.length;
          const questionCount = genre.topics.reduce(
            (sum, t) => sum + t.questions.length,
            0,
          );
          return (
            <Link
              key={genre.id}
              to={`/genre/${genre.id}`}
              className="genre-card"
            >
              <span className="genre-icon">{genre.icon}</span>
              <h3>{genre.title}</h3>
              <p>{genre.description}</p>
              <div className="genre-meta">
                <span>{topicCount} トピック</span>
                <span>{questionCount} 問</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
