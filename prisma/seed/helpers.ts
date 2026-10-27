import { QuizTimingMode } from "@/generated/prisma";
import { QuizTimingConfig } from "./types";

export function buildTimingFields(config: QuizTimingConfig) {
  const isTimed = config.mode !== QuizTimingMode.NONE;
  let timeLimit: number | null = null;

  switch (config.mode) {
    case QuizTimingMode.FIXED_PER_QUIZ:
    case QuizTimingMode.CHALLENGE_WINDOW:
      timeLimit = config.durationSeconds ?? null;
      break;
    case QuizTimingMode.FIXED_PER_QUESTION:
      timeLimit = config.perQuestionSeconds ?? null;
      break;
    default:
      timeLimit = null;
  }

  return { isTimed, timeLimit, timingMode: config.mode, timingConfig: config };
}

export function pickQuestions<T>(pool: T[], count: number): T[] {
  if (pool.length <= count) return [...pool];
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function skillLevelToDifficulty(
  level: string
): "EASY" | "MEDIUM" | "HARD" {
  switch (level) {
    case "BEGINNER":
      return "EASY";
    case "INTERMEDIATE":
      return "MEDIUM";
    case "ADVANCED":
      return "HARD";
    default:
      return "EASY";
  }
}
