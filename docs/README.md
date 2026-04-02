# 開発ドキュメント一覧

ロジック組み立て問題アプリの開発記録です。コードと一緒に読むと理解が深まります。

| ファイル | 内容 |
|---|---|
| [01_overview.md](./01_overview.md) | アプリの全体像・技術スタック・ファイル構成 |
| [02_types.md](./02_types.md) | 型定義の解説（メソッド問題アプリとの違い） |
| [03_questions_data.md](./03_questions_data.md) | 問題データの構造・追加方法 |
| [04_runner.md](./04_runner.md) | コード実行エンジンの仕組み（iframe sandbox） |
| [05_quiz_screen.md](./05_quiz_screen.md) | 問題画面の実装解説 |
| [06_app_tsx.md](./06_app_tsx.md) | 全体の状態管理・画面切り替え |
| [07_changes.md](./07_changes.md) | 変更・修正の記録（ダークモード・問題刷新・文字コードバグ修正） |

---

## 開発環境の起動方法

```bash
cd logic-quiz-app
npm install
npm run dev
```

ブラウザで `http://localhost:5173` を開く。
