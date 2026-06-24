import { Link, Outlet } from "react-router-dom";

export default function App() {
  return (
    <div className="app">
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="brand">
            <span className="brand-mark">📚</span>
            <span className="brand-name">Learn</span>
          </Link>
          <span className="tagline">手を動かして学ぶプログラミング</span>
        </div>
      </header>
      <main className="container main">
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="container">学んで、4択で確かめる学習サイト · ジャンルは順次追加予定</div>
      </footer>
    </div>
  );
}
