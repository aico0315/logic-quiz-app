# 型定義（types.ts）

## コードと解説

```typescript
// src/types.ts

export type Level = "junior" | "middle" | "senior";

export interface Question {
  id: string;
  level: Level;
  category: string;
  question: string;       // 問題文
  starterCode: string;    // 最初からエディタに表示されるコード
  expected: string;       // console.log の期待出力
  explanation: string;    // 解説文（コードブロック含む）
}

export type Screen = "menu" | "quiz" | "clear";
```

---

## メソッド問題アプリとの違い

メソッド問題アプリの `Question` 型と比べると、フィールドが変わっています。

| フィールド | メソッド問題アプリ | ロジック組み立て問題アプリ |
|---|---|---|
| `answer` | あり（正解メソッド名の配列） | なし |
| `supplement` | あり（補足説明） | なし |
| `starterCode` | なし | **あり**（初期コード） |
| `expected` | なし | **あり**（期待する出力） |
| `explanation` | なし | **あり**（解説文） |

「自由にコードを書いて実行して判定する」アプリなので、`answer` は不要です。
代わりに `expected`（期待する出力）と比較して正誤を判定します。

---

## `expected` の書き方

`console.log` の出力が文字列として比較されます。

```typescript
// 配列を出力する場合
expected: "[4,2,6]"
// → console.log([4,2,6]) の出力結果 [4,2,6] と比較

// 数値を出力する場合
expected: "15"
// → console.log(15) の出力結果 15 と比較

// 文字列を出力する場合（JSON.stringify されるのでダブルクォートがつく）
expected: '"apple,banana,cherry"'
// → console.log("apple,banana,cherry") の出力結果 "apple,banana,cherry" と比較
```

### なぜ文字列にダブルクォートがつくのか

コード実行エンジン（runner.ts）の中で `JSON.stringify` を使って出力を文字列化しています。
`JSON.stringify("hello")` は `'"hello"'` を返すため、文字列の出力結果はダブルクォート付きになります。

```javascript
JSON.stringify([1, 2, 3])   // → "[1,2,3]"
JSON.stringify(15)          // → "15"
JSON.stringify("hello")     // → '"hello"'  ← ダブルクォートが含まれる
```
