# コード実行エンジン（lib/runner.ts）

## このファイルが何をするのか

ユーザーが書いたコードを**ブラウザの中で安全に実行**して、`console.log` の出力結果を返します。

「安全に」というのが重要なポイントです。ユーザーが書いたコードをそのまま実行すると、`document.cookie` を読んだり、ページを壊したりする悪意あるコードも動いてしまいます。これを防ぐために `iframe sandbox` を使います。

---

## iframe sandbox とは

`<iframe>` は「ページの中に別のページを埋め込む」HTML要素です。
`sandbox` 属性を付けると、その iframe の中でできることを制限できます。

```html
<iframe sandbox="allow-scripts"></iframe>
```

`allow-scripts` だけを許可することで：
- JavaScript は実行できる（問題を解くために必要）
- 親ページの DOM にアクセスできない
- Cookie やローカルストレージにアクセスできない
- フォームの送信やページ遷移ができない

問題を解くのに必要な「JavaScriptを実行する」だけを許可した、最小限の環境です。

---

## 全体の仕組み

```
① iframe を作成（sandbox="allow-scripts"）
② ユーザーのコードを含む HTML を iframe に渡す
③ iframe 内で console.log を上書き → 出力を postMessage で親に送る
④ 親ページで postMessage を受け取る
⑤ 出力結果を返す
```

---

## コードの詳細解説

### iframe を作成して非表示にする

```typescript
const iframe = document.createElement("iframe");
iframe.setAttribute("sandbox", "allow-scripts");
iframe.style.display = "none";  // 画面には表示しない
document.body.appendChild(iframe);
```

`createElement` で HTML 要素をコードから動的に作成できます。
`display: none` で見えないようにしつつ、実行環境としてページに追加します。

### タイムアウトを設定する

```typescript
const timeout = setTimeout(() => {
  cleanup();
  resolve({ output: [], error: "タイムアウト：処理が5秒以内に完了しませんでした" });
}, 5000);
```

無限ループなど、終わらないコードを書かれた場合に5秒で強制終了します。

### postMessage で結果を受け取る

```typescript
function onMessage(event: MessageEvent) {
  if (event.data?.type !== "run-result") return;
  cleanup();
  resolve({ output: event.data.output, error: event.data.error });
}

window.addEventListener("message", onMessage);
```

`postMessage` は「異なるページ（iframe）間でデータをやり取りする」仕組みです。
`type: "run-result"` というメッセージが来たら、それが実行結果だと判断して処理します。

### iframe に渡す HTML の中身

```javascript
const html = `
  <script>
    const logs = [];

    // console.log を上書き
    console.log = (...args) => {
      logs.push(args.map(a => JSON.stringify(a)).join(" "));
    };

    try {
      ${code}  // ← ユーザーが書いたコードがここに入る
      Promise.resolve().then(() => {
        setTimeout(() => {
          parent.postMessage({ type: "run-result", output: logs, error: null }, "*");
        }, 0);
      });
    } catch (e) {
      parent.postMessage({ type: "run-result", output: logs, error: e.message }, "*");
    }
  <\/script>
`;
```

**console.log の上書き：**
通常の `console.log` はブラウザのコンソールに表示するだけです。
これを上書きして「出力を配列に溜める」動作に変えています。

**JSON.stringify：**
`console.log([1,2,3])` のように配列を渡すと、`JSON.stringify` で `"[1,2,3]"` という文字列に変換します。これが `expected` と比較する文字列になります。

**Promise.resolve().then(...)：**
`async/await` を使ったコードは非同期で動くため、コードの実行が終わってからすぐに結果を送ると出力が空になってしまいます。
`Promise.resolve().then(...)` で「現在の処理が全部終わってから送る」という順序を保証しています。

### 正誤判定

```typescript
export function judge(output: string[], expected: string): boolean {
  const actual = output.join("\n").trim();
  return actual === expected.trim();
}
```

`console.log` が複数回呼ばれた場合は改行で結合して1つの文字列にし、期待値と完全一致するか確認します。

---

## Promise とは（非同期処理）

`runCode` 関数は `Promise<RunResult>` を返しています。

```typescript
export function runCode(code: string): Promise<RunResult> {
  return new Promise((resolve) => {
    // ...処理...
    // 完了したら resolve(結果) を呼ぶ
  });
}
```

**Promise** は「後で値を返す約束」です。
iframe 内のコードが実行完了するタイミングはすぐではないため、「完了したら教えて」という約束（Promise）を使っています。

呼び出す側では `await` を使うことで、完了するまで待つことができます。

```typescript
// QuizScreen.tsx での呼び出し
const result = await runCode(code);
// ↑ runCode が完了するまでここで待つ
```
