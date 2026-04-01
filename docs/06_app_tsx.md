# 全体の司令塔（App.tsx）

## メソッド問題アプリとほぼ同じ設計

`App.tsx` の構造はメソッド問題アプリとほぼ同じです。
「状態を親が管理して、子コンポーネントに渡す」という設計を繰り返し使っています。

同じパターンを2回書くことで「なぜこの設計なのか」が身についていきます。

---

## 状態の一覧

```typescript
const [screen, setScreen] = useState<Screen>("menu");
const [level, setLevel] = useState<Level>("junior");
const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
const [currentIndex, setCurrentIndex] = useState(0);
const [correctCount, setCorrectCount] = useState(0);
```

メソッド問題アプリと全く同じ状態の構成です。

---

## シャッフルしてレベルで絞り込む

```typescript
const handleStart = useCallback((selectedLevel: Level) => {
  const filtered = shuffle(questions.filter((q) => q.level === selectedLevel));
  setLevel(selectedLevel);
  setQuizQuestions(filtered);
  setCurrentIndex(0);
  setCorrectCount(0);
  setScreen("quiz");
}, []);
```

`filter` でレベルに合う問題だけ取り出し、`shuffle` でランダムに並び替えてから出題します。
毎回違う順番で出題されるため、繰り返し練習しても新鮮さが保たれます。

---

## 次の問題へ進む / クリア画面に遷移する

```typescript
const handleNext = useCallback(
  (isCorrect: boolean) => {
    const nextCorrect = isCorrect ? correctCount + 1 : correctCount;
    const nextIndex = currentIndex + 1;

    if (nextIndex >= quizQuestions.length) {
      setCorrectCount(nextCorrect);
      setScreen("clear");  // 全問終了 → クリア画面
    } else {
      setCorrectCount(nextCorrect);
      setCurrentIndex(nextIndex);  // 次の問題へ
    }
  },
  [correctCount, currentIndex, quizQuestions.length]
);
```

`QuizScreen` が「次へ」ボタンを押したとき `onNext(isCorrect)` を呼びます。
`isCorrect` を引数で受け取ることで、正解数のカウントを `App.tsx` で一元管理しています。

---

## コンポーネントへのprops

```tsx
<QuizScreen
  question={quizQuestions[currentIndex]}   // 今の問題
  questionNumber={currentIndex + 1}         // 何問目か（1始まり）
  totalQuestions={quizQuestions.length}     // 全問数
  onNext={handleNext}                       // 次へ進む関数
  onMenu={handleMenu}                       // メニューへ戻る関数
/>
```

`QuizScreen` はこれらを受け取るだけで、「今何問目か」「全部で何問か」を自分で管理する必要がありません。
状態は親（`App.tsx`）が持ち、子は表示と操作だけに集中する設計です。

---

## メソッド問題アプリとの設計の共通点

両アプリとも以下の設計パターンを使っています。

1. **状態は親で管理** → `App.tsx` が `screen` / `currentIndex` / `correctCount` を持つ
2. **子から親へはコールバック** → `onNext` / `onMenu` / `onStart` で子の出来事を親に伝える
3. **問題はシャッフルして出題** → `shuffle` 関数（全く同じコード）
4. **CSS Modules でスタイル管理** → 各コンポーネントに対応する `.module.css`

この設計を統合するときに活かします。
