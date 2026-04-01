# 問題データ（data/questions.ts）

## 1問分の構造

```typescript
{
  id: "1",
  level: "junior",
  category: "配列の操作",
  question: "数値の配列 `[3, 1, 4, 1, 5, 9, 2, 6]` から偶数だけを取り出して `console.log` で出力してください。",
  starterCode: `const numbers = [3, 1, 4, 1, 5, 9, 2, 6];

// ここにコードを書く
`,
  expected: "[4,2,6]",
  explanation: "`filter` を使って条件に合う要素だけ取り出せます。\n\n```js\nconst result = numbers.filter(n => n % 2 === 0);\nconsole.log(result);\n```\n\n`n % 2 === 0` は「2で割り切れる = 偶数」という条件です。",
}
```

---

## 各フィールドの書き方

### `starterCode`：初期コード

バッククォート（`` ` ``）で囲むことで改行を含む文字列（テンプレートリテラル）が書けます。

```typescript
starterCode: `const numbers = [1, 2, 3, 4, 5];

// ここにコードを書く
`,
```

エディタに最初から表示されるコードです。変数の定義だけ書いておき、ユーザーがロジック部分を書く設計にしています。

### `expected`：期待する出力

`console.log` の出力を文字列で書きます。

```typescript
// 配列の場合：スペースなし、ダブルクォートなし
expected: "[4,2,6]"

// 数値の場合
expected: "15"

// 文字列の場合：シングルクォートで囲み、中身はダブルクォート付き
expected: '"apple,banana,cherry"'
```

### `explanation`：解説文

コードブロックを含む場合は ` ```js ` で囲みます。`\n` は改行です。

```typescript
explanation: "説明文\n\n```js\nconst result = ...;\nconsole.log(result);\n```\n\n補足説明",
```

---

## 問題を追加するとき

```typescript
{
  id: "14",                        // 既存IDと重複しない番号
  level: "junior",                 // "junior" | "middle" | "senior"
  category: "文字列の操作",
  question: "問題文をここに書く",
  starterCode: `const str = 'hello';

// ここにコードを書く
`,
  expected: '"HELLO"',             // console.log の出力と一致するように書く
  explanation: "解説文\n\n```js\nconsole.log(str.toUpperCase());\n```",
}
```

### expected を確認する方法

ブラウザのコンソールで実際に実行して確認するのが確実です。

```javascript
// ブラウザのコンソールに貼り付けて実行
console.log(JSON.stringify("HELLO"))  // → '"HELLO"'  ← これが expected に入る値
console.log(JSON.stringify([1,2,3]))  // → '[1,2,3]'  ← これが expected に入る値
```

---

## 現在の問題数と内訳

| レベル | カテゴリ | 問題数 |
|---|---|---|
| Junior | 配列の操作 | 6問 |
| Junior | 文字列の操作 | 2問 |
| Junior | オブジェクトの操作 | 1問 |
| Junior | 条件分岐 | 1問 |
| Middle | 配列の操作 | 1問 |
| Middle | オブジェクトの操作 | 1問 |
| Middle | 非同期処理 | 1問 |
| **合計** | | **13問** |
