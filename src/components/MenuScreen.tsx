import type { Level } from "../types";
import styles from "./MenuScreen.module.css";

interface Props {
  onStart: (level: Level) => void;
}

const levels: { value: Level; label: string; description: string }[] = [
  { value: "junior", label: "Junior", description: "filter・map・reduceなど基本ロジック" },
  { value: "middle", label: "Middle", description: "メソッドチェーン・非同期処理など" },
];

export default function MenuScreen({ onStart }: Props) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>ロジック組み立て問題</h1>
      <p className={styles.subtitle}>
        日本語で考えたロジックをコードに落とし込む思考を身につける
      </p>
      <div className={styles.levels}>
        {levels.map((level) => (
          <button
            key={level.value}
            className={styles.levelButton}
            onClick={() => onStart(level.value)}
          >
            <span className={styles.levelLabel}>{level.label}</span>
            <span className={styles.levelDesc}>{level.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
