export type Level = "junior" | "middle" | "senior";

export interface Question {
  id: string;
  level: Level;
  category: string;
  question: string;
  starterCode: string;
  expected: string; // console.log の期待出力（文字列として比較）
  explanation: string;
}

export type Screen = "menu" | "quiz" | "clear";
