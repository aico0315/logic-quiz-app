# 変更・修正の記録

## 変更1：ダークモードの追加

### やったこと

メニュー・問題・クリア画面の全コンポーネントにダークモードを追加しました。
右上の 🌙 / ☀️ ボタンで切り替えられ、設定はページをリロードしても保持されます。

### 仕組み：CSS変数でテーマを管理する

ハードコードしていた色を全て CSS変数に置き換えています。

```css
/* index.css */

/* ライトテーマ（デフォルト） */
:root {
  --bg-card: #ffffff;
  --text-primary: #1a1a2e;
  --border: #e5e7eb;
  /* ...他の色も同様 */
}

/* ダークテーマ */
[data-theme="dark"] {
  --bg-card: #1c1c2e;
  --text-primary: #f1f1f5;
  --border: #30304a;
  /* ...他の色も同様 */
}
```

`data-theme="dark"` という属性が `<html>` タグに付いたとき、ダークテーマの変数に上書きされます。

各コンポーネントのCSSでは、直接の色指定をやめて変数を使うように変更しています。

```css
/* 変更前 */
.levelButton {
  background: white;
  border: 2px solid #e5e7eb;
  color: #1a1a2e;
}

/* 変更後 */
.levelButton {
  background: var(--bg-card);   /* 変数を参照する */
  border: 2px solid var(--border);
  color: var(--text-primary);
}
```

`var(--変数名)` で CSS変数の値を使えます。テーマが変わると変数の値が変わるので、コンポーネント側は何も変えなくても自動的に色が切り替わります。

### 仕組み：React の状態と localStorage で切り替えを管理

```typescript
// App.tsx

// 初期値：localStorage に保存済みの設定を読み込む
const [isDark, setIsDark] = useState(() => {
  return localStorage.getItem("theme") === "dark";
});

// isDark が変わるたびに <html> の属性と localStorage を更新
useEffect(() => {
  document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  localStorage.setItem("theme", isDark ? "dark" : "light");
}, [isDark]);
```

**`useState` の初期値に関数を渡す理由：**
`localStorage.getItem("theme")` はアプリ起動時に1回だけ実行すれば十分です。
関数として渡すことで「最初の1回だけ実行する」初期化ができます。

**`document.documentElement` とは：**
`document.documentElement` は `<html>` タグそのものです。
`setAttribute("data-theme", "dark")` で `<html data-theme="dark">` になり、CSSのダークテーマが適用されます。

---

## 変更2：問題データを実務シチュエーションに刷新

### なぜ変えたか

元の問題は「数値の配列 `[1,2,3]` を…」のような抽象的な練習問題でした。
実際の開発場面（ECサイト・SNS・管理画面・ブログ）を想定した文脈に変えることで、「このメソッドがどんな場面で使われるか」がイメージしやすくなります。

### 変更の内容

| ID | 旧テーマ | 新テーマ |
|---|---|---|
| 1 | 偶数を取り出す | ECサイト：3000円以上の商品を絞り込む |
| 2 | 全要素を2倍 | ECサイト：税込み価格を計算する |
| 3 | 数値を昇順ソート | 管理画面：月別売上を低い順に並び替える |
| 4 | 合計値を計算 | ECサイト：カートの合計金額を計算する |
| 5 | 重複除去 | ブログ：タグの重複を取り除く |
| 6 | 文字列を分割 | ブログ：カンマ区切りのタグ文字列を配列にする |
| 7 | 配列を結合 | ECサイト：パンくずリストを生成する |
| 8 | オブジェクトのキー取得 | 管理画面：入力フォームのフィールド名一覧を取得する |
| 9 | 3の倍数を絞り込む | ECサイト：在庫状況を条件分岐で表示する |
| 10 | 最大値を取得 | ブログ：最大ページビュー数を取得する |
| 11 | 20歳以上を絞り込む | SNS：フォロワー1000以上のユーザー名を取得する |
| 12 | 偶数・奇数に分類 | ECサイト：注文を発送済み・未発送に分類する |
| 13 | Promiseを返す | ECサイト：商品情報取得APIを呼び出す |

問題数・レベル・カテゴリは変えていません。

---

## 修正：日本語を含むコードが実行できないバグ

### 何が起きていたか

問題データを実務シチュエーション（日本語含む）に変えた後、コードを実行すると以下のエラーが出るようになりました。

```
Uncaught SyntaxError: Invalid regular expression: missing /
```

その後タイムアウトエラーになり、正誤判定ができない状態でした。

### 原因

`runner.ts` でユーザーのコードを iframe に渡すとき、HTML を `Blob` というデータ形式で作成しています。

```typescript
// 修正前
const blob = new Blob([html], { type: "text/html" });
```

`{ type: "text/html" }` だけだと文字コードが指定されていないため、日本語を含む HTML を読み込んだときにブラウザが文字コードを誤判定してしまいます。
その結果、日本語文字列が化けてスクリプトの構文が壊れ、エラーになっていました。

以前の問題データは全て英数字だったため発生していませんでした。

### 修正

```typescript
// 修正後
const blob = new Blob([html], { type: "text/html; charset=utf-8" });
```

`charset=utf-8` を追加して文字コードを明示的に指定しました。
UTF-8 は日本語を含む多言語テキストを扱える文字コードです。

### 学んだこと

- HTMLを動的に生成するときは**文字コードを明示的に指定する**
- 日本語など日本語以外の文字を扱う場合は `charset=utf-8` を付ける
- バグが「英語のときは動くが日本語だと壊れる」という現象だったことから、文字コードの問題だと特定できた

---

## GitHub Pages へのデプロイ設定（logic-quiz-app）

### やったこと

method-quiz-app と同様に、GitHub Pages で公開できるようにしました。

**① `vite.config.ts` に `base` を追加**

```typescript
export default defineConfig({
  plugins: [react()],
  base: "/logic-quiz-app/",  // ← リポジトリ名と合わせる
})
```

**② `.github/workflows/deploy.yml` を作成**

`main` ブランチへのプッシュをトリガーに、ビルド → `gh-pages` ブランチへの自動デプロイが実行されます（method-quiz-app と同じ設定）。

**公開URL：** https://aico0315.github.io/logic-quiz-app/

### トラブルシューティング：真っ白になった

Pagesの設定で Branch が `gh-pages` になっているのに真っ白になった → ブラウザの強制リロード（`Cmd+Shift+R`）で解決しました。

**原因：** ブラウザが古いキャッシュを表示していたため。強制リロードでキャッシュを無視して最新のファイルを取得できます。
