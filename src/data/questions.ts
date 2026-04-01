import type { Question } from "../types";

export const questions: Question[] = [
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
  },
  {
    id: "2",
    level: "junior",
    category: "配列の操作",
    question: "数値の配列 `[1, 2, 3, 4, 5]` の全要素を2倍にした新しい配列を `console.log` で出力してください。",
    starterCode: `const numbers = [1, 2, 3, 4, 5];

// ここにコードを書く
`,
    expected: "[2,4,6,8,10]",
    explanation: "`map` を使って各要素を変換できます。\n\n```js\nconst result = numbers.map(n => n * 2);\nconsole.log(result);\n```\n\n`map` は元の配列を変えず、変換した新しい配列を返します。",
  },
  {
    id: "3",
    level: "junior",
    category: "配列の操作",
    question: "数値の配列 `[5, 3, 8, 1, 9, 2]` を小さい順に並び替えて `console.log` で出力してください。",
    starterCode: `const numbers = [5, 3, 8, 1, 9, 2];

// ここにコードを書く
`,
    expected: "[1,2,3,5,8,9]",
    explanation: "`sort` に比較関数を渡すと数値順に並び替えられます。\n\n```js\nconst result = numbers.sort((a, b) => a - b);\nconsole.log(result);\n```\n\n`a - b` が負のとき a を前に、正のとき b を前に並べます。引数なしの `sort()` は文字列順になるので注意。",
  },
  {
    id: "4",
    level: "junior",
    category: "配列の操作",
    question: "数値の配列 `[1, 2, 3, 4, 5]` の合計値を `console.log` で出力してください。",
    starterCode: `const numbers = [1, 2, 3, 4, 5];

// ここにコードを書く
`,
    expected: "15",
    explanation: "`reduce` を使って配列を1つの値にまとめられます。\n\n```js\nconst result = numbers.reduce((acc, n) => acc + n, 0);\nconsole.log(result);\n```\n\n`acc` は累積値、`0` が初期値です。1+2+3+4+5 = 15 が返ります。",
  },
  {
    id: "5",
    level: "junior",
    category: "配列の操作",
    question: "配列 `[1, 2, 2, 3, 3, 3, 4]` から重複を取り除いた配列を `console.log` で出力してください。",
    starterCode: `const numbers = [1, 2, 2, 3, 3, 3, 4];

// ここにコードを書く
`,
    expected: "[1,2,3,4]",
    explanation: "`Set` はユニークな値だけを保持するデータ構造です。\n\n```js\nconst result = [...new Set(numbers)];\nconsole.log(result);\n```\n\n`new Set(numbers)` で重複が除去され、スプレッド構文 `[...]` で配列に戻します。",
  },
  {
    id: "6",
    level: "junior",
    category: "文字列の操作",
    question: "文字列 `'Hello World'` を単語ごとに分割した配列を `console.log` で出力してください。",
    starterCode: `const str = 'Hello World';

// ここにコードを書く
`,
    expected: '["Hello","World"]',
    explanation: "`split` で文字列を区切り文字で分割できます。\n\n```js\nconst result = str.split(' ');\nconsole.log(result);\n```\n\nスペースを区切り文字にすることで単語ごとに分割されます。",
  },
  {
    id: "7",
    level: "junior",
    category: "文字列の操作",
    question: "文字列の配列 `['apple', 'banana', 'cherry']` を `','` で繋いだ1つの文字列を `console.log` で出力してください。",
    starterCode: `const fruits = ['apple', 'banana', 'cherry'];

// ここにコードを書く
`,
    expected: '"apple,banana,cherry"',
    explanation: "`join` で配列を1つの文字列に結合できます。\n\n```js\nconst result = fruits.join(',');\nconsole.log(result);\n```\n\n引数に渡した文字列が各要素の間に挿入されます。",
  },
  {
    id: "8",
    level: "junior",
    category: "オブジェクトの操作",
    question: "オブジェクト `{ name: 'Alice', age: 25, city: 'Tokyo' }` のキー一覧を配列で `console.log` してください。",
    starterCode: `const person = { name: 'Alice', age: 25, city: 'Tokyo' };

// ここにコードを書く
`,
    expected: '["name","age","city"]',
    explanation: "`Object.keys` でオブジェクトのキー一覧を配列で取得できます。\n\n```js\nconst result = Object.keys(person);\nconsole.log(result);\n```",
  },
  {
    id: "9",
    level: "junior",
    category: "条件分岐",
    question: "数値の配列 `[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]` の中から3の倍数だけを取り出して `console.log` で出力してください。",
    starterCode: `const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// ここにコードを書く
`,
    expected: "[3,6,9]",
    explanation: "`filter` と `%`（余り）を組み合わせます。\n\n```js\nconst result = numbers.filter(n => n % 3 === 0);\nconsole.log(result);\n```\n\n`n % 3 === 0` は「3で割り切れる = 3の倍数」という条件です。",
  },
  {
    id: "10",
    level: "junior",
    category: "配列の操作",
    question: "数値の配列 `[3, 1, 4, 1, 5, 9]` の中から最大値を `console.log` で出力してください。",
    starterCode: `const numbers = [3, 1, 4, 1, 5, 9];

// ここにコードを書く
`,
    expected: "9",
    explanation: "`Math.max` にスプレッド構文を組み合わせると配列の最大値が取れます。\n\n```js\nconst result = Math.max(...numbers);\nconsole.log(result);\n```\n\n`...numbers` で配列を個別の引数として展開しています。",
  },
  // middle
  {
    id: "11",
    level: "middle",
    category: "配列の操作",
    question: "オブジェクトの配列から `age` が20以上の人の `name` だけを取り出した配列を `console.log` してください。",
    starterCode: `const people = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 17 },
  { name: 'Carol', age: 30 },
  { name: 'Dave', age: 19 },
];

// ここにコードを書く
`,
    expected: '["Alice","Carol"]',
    explanation: "`filter` と `map` を組み合わせます。\n\n```js\nconst result = people\n  .filter(p => p.age >= 20)\n  .map(p => p.name);\nconsole.log(result);\n```\n\nメソッドチェーンで「絞り込み→変換」を一連の流れで書けます。",
  },
  {
    id: "12",
    level: "middle",
    category: "オブジェクトの操作",
    question: "数値の配列 `[1, 2, 3, 4, 5, 6]` を偶数と奇数に分けたオブジェクト `{ even: [...], odd: [...] }` を `console.log` してください。",
    starterCode: `const numbers = [1, 2, 3, 4, 5, 6];

// ここにコードを書く
`,
    expected: '{"even":[2,4,6],"odd":[1,3,5]}',
    explanation: "`reduce` でオブジェクトにまとめることができます。\n\n```js\nconst result = numbers.reduce(\n  (acc, n) => {\n    if (n % 2 === 0) acc.even.push(n);\n    else acc.odd.push(n);\n    return acc;\n  },\n  { even: [], odd: [] }\n);\nconsole.log(result);\n```",
  },
  {
    id: "13",
    level: "middle",
    category: "非同期処理",
    question: "1秒後に `'完了'` という文字列を返す Promise を作り、その結果を `console.log` してください。",
    starterCode: `// ここにコードを書く
`,
    expected: '"完了"',
    explanation: "`async/await` で非同期処理を書けます。\n\n```js\nconst wait = () => new Promise(resolve => setTimeout(() => resolve('完了'), 1000));\n\nasync function main() {\n  const result = await wait();\n  console.log(result);\n}\nmain();\n```",
  },
];
