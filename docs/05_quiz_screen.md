# 問題画面（QuizScreen.tsx）

## このコンポーネントの責務

1. 問題文とスターターコードを表示する
2. ユーザーがコードを編集できるエディタを提供する
3. 「実行して確認」ボタンでコードを動かす
4. 実行結果・正誤・解説を表示する

---

## 状態（useState）の一覧

```typescript
const [code, setCode] = useState(question.starterCode);
// エディタの現在の内容。最初はスターターコード。

const [running, setRunning] = useState(false);
// 実行中かどうか。true のとき「実行中...」と表示してボタンを無効化する。

const [submitted, setSubmitted] = useState(false);
// 実行して結果が出たかどうか。true になると解説エリアを表示。

const [isCorrect, setIsCorrect] = useState(false);
// 正解かどうか。

const [actualOutput, setActualOutput] = useState<string[]>([]);
// 実際の console.log の出力一覧。

const [runError, setRunError] = useState<string | null>(null);
// エラーメッセージ。エラーなしなら null。
```

---

## 実行ボタンを押したときの流れ

```typescript
const handleRun = async () => {
  setRunning(true);      // ① ボタンを「実行中...」に変える
  setRunError(null);

  const result = await runCode(code);  // ② コードを実行して結果を待つ

  setRunning(false);     // ③ 実行完了
  setActualOutput(result.output);
  setRunError(result.error);

  if (!result.error) {
    setIsCorrect(judge(result.output, question.expected));  // ④ 正誤判定
    setSubmitted(true);  // ⑤ 解説エリアを表示
  }
};
```

`async/await` を使っているのは `runCode` が非同期関数（Promise を返す）だからです。
`await` を付けることで「実行完了まで待ってから次の行へ進む」という流れになります。

---

## Tabキーでインデントできる仕組み

通常ブラウザのテキストエリアで Tab を押すと、フォーカスが次の要素に移ってしまいます。
それを防いで、スペース2つを挿入するように上書きしています。

```typescript
const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  if (e.key === "Tab") {
    e.preventDefault();  // ← デフォルトの「フォーカス移動」をキャンセル

    const el = e.currentTarget;
    const start = el.selectionStart;  // カーソルの開始位置
    const end = el.selectionEnd;      // カーソルの終了位置

    // カーソル位置にスペース2つを挿入
    const newCode = code.substring(0, start) + "  " + code.substring(end);
    setCode(newCode);

    // カーソルをスペースの後ろに移動
    setTimeout(() => {
      el.selectionStart = start + 2;
      el.selectionEnd = start + 2;
    }, 0);
  }
};
```

`e.preventDefault()` は「ブラウザが本来やること（デフォルト動作）をキャンセルする」メソッドです。

---

## 問題が変わるたびにリセットする

```typescript
useEffect(() => {
  setCode(question.starterCode);  // エディタをスターターコードに戻す
  setSubmitted(false);
  setActualOutput([]);
  setRunError(null);
  textareaRef.current?.focus();   // フォーカスをエディタに当てる
}, [question.id]);                // question.id が変わるたびに実行
```

`App.tsx` で `currentIndex` が進むと `question` が新しいオブジェクトに変わります。
`question.id` の変化を `useEffect` が検知して、エディタの状態をリセットします。

---

## 解説のコードブロックを表示する仕組み

解説文（`explanation`）はマークダウン風のテキストで書かれています。

````
"説明文\n\n```js\nconst result = ...;\n```\n\n補足"
````

これをそのまま表示すると ` ``` ` という文字列が見えてしまうため、
簡易的なパーサーで「通常テキスト」と「コードブロック」に分けて表示しています。

```typescript
function renderExplanation(text: string) {
  // ```...``` で囲まれた部分とそれ以外に分割
  const parts = text.split(/(```[\s\S]*?```)/g);

  return parts.map((part, i) => {
    if (part.startsWith("```")) {
      // コードブロック → <pre><code> タグで表示
      const code = part.replace(/^```\w*\n?/, "").replace(/```$/, "");
      return <pre key={i}><code>{code}</code></pre>;
    }
    // 通常テキスト → そのまま表示
    return <span key={i}>{part}</span>;
  });
}
```

`split(/(```[\s\S]*?```)/g)` は正規表現で「コードブロック部分とそれ以外に分割」しています。
括弧 `()` でグループ化することで、区切り文字自体も配列に残ります。

---

## 表示の切り替え

```tsx
{!submitted ? (
  // 実行前：エディタと実行ボタン
  <div>
    <button onClick={handleRun}>▶ 実行して確認</button>
    {runError && <div>エラー表示</div>}
  </div>
) : (
  // 実行後：正誤・出力・解説
  <div>...</div>
)}
```

`submitted` が `false` のとき「実行前の画面」、`true` のとき「結果画面」を表示します。
エラーが出た場合は `submitted` を `true` にしないため、エラーを直してもう一度実行できます。
