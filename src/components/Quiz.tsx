import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { Question } from "../types.ts";

interface PreparedChoice {
  text: string;
  correct: boolean;
}

interface PreparedQuestion {
  question: string;
  explanation: string;
  updated?: string;
  choices: PreparedChoice[];
}

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function prepare(questions: Question[]): PreparedQuestion[] {
  return questions.map((q) => ({
    question: q.question,
    explanation: q.explanation,
    updated: q.updated,
    choices: shuffle(
      q.choices.map((text, i) => ({ text, correct: i === q.answer })),
    ),
  }));
}

interface QuizProps {
  questions: Question[];
  title: string;
  backTo: string;
}

export default function Quiz({ questions, title, backTo }: QuizProps) {
  // マウント時(=出題セット切り替え時)に一度だけ選択肢をシャッフル
  const prepared = useMemo(() => prepare(questions), [questions]);

  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  if (prepared.length === 0) {
    return (
      <div className="empty-state">
        <p>このセットにはまだ問題がありません。</p>
        <Link to={backTo} className="btn">
          戻る
        </Link>
      </div>
    );
  }

  const total = prepared.length;
  const current = prepared[step];
  const answered = selected !== null;

  function choose(index: number) {
    if (answered) return;
    setSelected(index);
    if (current.choices[index].correct) {
      setCorrectCount((c) => c + 1);
    }
  }

  function next() {
    if (step + 1 < total) {
      setStep(step + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
  }

  function restart() {
    setStep(0);
    setSelected(null);
    setCorrectCount(0);
    setFinished(false);
  }

  if (finished) {
    const ratio = Math.round((correctCount / total) * 100);
    const message =
      ratio === 100
        ? "満点！完璧です 🎉"
        : ratio >= 70
          ? "good! あと少しで完璧です 👍"
          : "復習してもう一度挑戦しよう 📖";
    return (
      <div className="quiz quiz-result">
        <h1>結果</h1>
        <div className="score-circle">
          <span className="score-big">
            {correctCount}
            <span className="score-total">/{total}</span>
          </span>
          <span className="score-pct">{ratio}%</span>
        </div>
        <p className="result-message">{message}</p>
        <div className="cta-row">
          <button className="btn btn-primary" onClick={restart}>
            もう一度挑戦
          </button>
          <Link to={backTo} className="btn">
            トピックに戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz">
      <div className="quiz-top">
        <h1>{title}</h1>
        <span className="quiz-progress">
          {step + 1} / {total}
        </span>
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${(step / total) * 100}%` }}
        />
      </div>

      <div className="question-card">
        <p className="question-text">{current.question}</p>
        <div className="choices">
          {current.choices.map((choice, i) => {
            let cls = "choice";
            if (answered) {
              if (choice.correct) cls += " is-correct";
              else if (i === selected) cls += " is-wrong";
              else cls += " is-dim";
            }
            return (
              <button
                key={i}
                className={cls}
                onClick={() => choose(i)}
                disabled={answered}
              >
                <span className="choice-label">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="choice-text">{choice.text}</span>
                {answered && choice.correct && (
                  <span className="choice-icon">✓</span>
                )}
                {answered && i === selected && !choice.correct && (
                  <span className="choice-icon">✗</span>
                )}
              </button>
            );
          })}
        </div>

        {answered && (
          <div
            className={`feedback ${
              current.choices[selected].correct ? "ok" : "ng"
            }`}
          >
            <strong>
              {current.choices[selected].correct ? "正解！" : "不正解"}
            </strong>
            <p>{current.explanation}</p>
            {current.updated && (
              <p className="question-updated">🕒 この設問の知識は {current.updated} 時点のものです</p>
            )}
          </div>
        )}
      </div>

      <div className="quiz-actions">
        <Link to={backTo} className="btn btn-ghost">
          中断して戻る
        </Link>
        <button className="btn btn-primary" onClick={next} disabled={!answered}>
          {step + 1 < total ? "次の問題 →" : "結果を見る"}
        </button>
      </div>
    </div>
  );
}
