import { Fragment } from "react";

// 本文テキストを段落(\n\n区切り)・インラインコード(`...`)・
// コードブロック(```で囲んだ複数行)に変換して表示する。
export default function RichText({ text }: { text: string }) {
  // ``` で囲まれた部分をコードブロックとして切り出す
  const segments = text.split(/(```[\s\S]*?```)/g);
  return (
    <>
      {segments.map((seg, i) => {
        if (seg.startsWith("```") && seg.endsWith("```")) {
          // 先頭の ```（任意の言語名つき）と末尾の ``` を取り除く
          const code = seg.replace(/^```[^\n]*\n?/, "").replace(/```$/, "");
          return (
            <pre key={i}>
              <code>{code.replace(/\n$/, "")}</code>
            </pre>
          );
        }
        // コードブロック外は段落(\n\n)に分けて描画する
        return seg
          .split("\n\n")
          .filter((para) => para !== "")
          .map((para, j) => <p key={`${i}-${j}`}>{renderInline(para)}</p>);
      })}
    </>
  );
}

function renderInline(text: string) {
  // バッククォートで囲まれた部分を <code> にする
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={i}>{part.slice(1, -1)}</code>;
    }
    // 段落内の単一改行は改行として扱う
    const lines = part.split("\n");
    return (
      <Fragment key={i}>
        {lines.map((line, j) => (
          <Fragment key={j}>
            {j > 0 && <br />}
            {line}
          </Fragment>
        ))}
      </Fragment>
    );
  });
}
