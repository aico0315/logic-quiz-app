# Logic Quiz — 初学者向けコードリーディングガイド

## このアプリについて

「日本語で考えたロジックをコードに落とし込む思考」を身につけるための練習アプリです。
問題文を読んで、コードエディタにコードを書き、実行して正誤を確認します。

---

## 画面構成

```
MenuScreen（レベル選択）
    ↓ レベルを選ぶ
QuizScreen（問題・コード実行画面）
    ↓ 全問終了
ClearScreen（結果画面）
```

3 つの画面（コンポーネント）が `App.tsx` の `screen` という state で切り替わります。

---

## ファイル構成と役割

```
src/
├── App.tsx                   # アプリ全体の状態管理・画面切替
├── App.module.css            # ヘッダー・レイアウトのスタイル
├── index.css                 # CSS変数（ライト/ダークの色定義）
├── types.ts                  # 型定義（Question, Level, Screen）
├── data/
│   └── questions.ts          # 問題データ（13問）
├── lib/
│   └── runner.ts             # コード実行・判定ロジック（iframe sandbox）
└── components/
    ├── MenuScreen.tsx         # レベル選択画面
    ├── QuizScreen.tsx         # 問題・エディタ・実行結果画面
    └── ClearScreen.tsx        # 結果表示画面
```

---

## 状態管理の流れ（App.tsx）

`App.tsx` が全体の状態を持ち、子コンポーネントへ props で渡します。

```tsx
const [screen, setScreen] = useState<Screen>("menu");
const [level, setLevel] = useState<Level>("junior");
const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
```

### 画面遷移のトリガー

| イベント | 起こること |
|----------|------------|
| レベルボタンを押す | `handleStart` → 問題をシャッフルして `screen = "quiz"` |
| 全問回答 | `handleNext` → `screen = "clear"` |
| もう一度 / メニューへ | `handleRetry` / `handleMenu` |

---

## コード実行の仕組み（lib/runner.ts）

このアプリの最大の特徴は「ユーザーが入力したコードをブラウザ内で安全に実行する」点です。

### なぜ iframe sandbox を使うのか

ユーザー入力コードをそのまま `eval()` で実行すると、DOM や `localStorage` にアクセスできてしまい危険です。  
`sandbox` 属性付きの `<iframe>` 内で実行することで、完全に隔離された環境になります。

### 実行フロー

```
1. <iframe sandbox="allow-scripts"> を動的に作成
2. iframe の srcdoc に実行コードを HTML として埋め込む
3. コード内の console.log を傍受して出力を収集
4. postMessage で iframe → 親ウィンドウへ結果を送信
5. iframe を破棄
```

```ts
// runner.ts のイメージ（抜粋）
const iframe = document.createElement("iframe");
iframe.sandbox.add("allow-scripts");
iframe.srcdoc = `<script>
  const logs = [];
  const _log = console.log;
  console.log = (...args) => { logs.push(args.map(String).join(" ")); };
  ${code}
  parent.postMessage({ logs }, "*");
<\/script>`;
```

### 判定方法

```ts
export function judge(output: string[], expected: string): boolean {
  return output.join("\n") === expected;
}
```

`console.log` の出力を文字列として比較します。  
問題データの `expected` は `JSON.stringify` の出力と一致させる必要があります。

---

## 問題データの構造（data/questions.ts）

```ts
{
  id: "array-filter-1",
  level: "junior",
  category: "配列操作",
  question: "配列 [1, 2, 3, 4, 5] から偶数だけ取り出して console.log で出力してください",
  starterCode: "const nums = [1, 2, 3, 4, 5];\n// ここにコードを書く\n",
  expected: "[2,4]",        // JSON.stringify の出力に合わせる
  explanation: "filter を使うと条件に合う要素だけ取り出せます。\n```js\nconsole.log(nums.filter(n => n % 2 === 0));\n```",
}
```

### 問題を追加するには

`src/data/questions.ts` の配列に 1 オブジェクト追加するだけです。  
`expected` の値は実際にブラウザの Console で `JSON.stringify(result)` を確認してから書いてください。

---

## エディタの Tab キー対応（QuizScreen.tsx）

通常、テキストエリアで Tab を押すとフォーカスが移動します。  
このアプリではイベントをキャンセルして、2 スペースのインデントを挿入しています。

```tsx
const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  if (e.key === "Tab") {
    e.preventDefault();
    const el = e.currentTarget;
    const start = el.selectionStart;
    const newCode = code.substring(0, start) + "  " + code.substring(start);
    setCode(newCode);
    setTimeout(() => { el.selectionStart = start + 2; }, 0);
  }
};
```

---

## ダークモードの仕組み

```tsx
// App.tsx
const [isDark, setIsDark] = useState(() => {
  return localStorage.getItem("theme") === "dark";
});

useEffect(() => {
  document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  localStorage.setItem("theme", isDark ? "dark" : "light");
}, [isDark]);
```

```css
/* index.css */
:root { --bg-app: #f5f5f5; --text-main: #1a1a1a; }
[data-theme="dark"] { --bg-app: #0f0f0f; --text-main: #e8e8e8; }
```

`data-theme` 属性を `<html>` に付け替えることで CSS 変数が切り替わります。  
設定は `localStorage` に保存されるので、再訪問しても引き継がれます。

---

## ヘッダーの構成（App.tsx + App.module.css）

```tsx
<header className={styles.header}>
  <span className={styles.logo}>Logic Quiz</span>
  <button className={styles.themeToggle}>🌙</button>
</header>
```

- `position: fixed` で画面上部に固定
- `justify-content: space-between` でロゴ左・ボタン右に配置
- `<main>` に `padding-top: 4.25rem` を入れてヘッダー分の余白を確保

---

## ローカルでの起動方法

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:5173` を開く。
