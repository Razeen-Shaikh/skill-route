import {
  DifficultyLevel,
  QuestionType,
  QuizTimingMode,
  QuizType,
  SkillLevel,
} from "@/generated/prisma";

/** Extensible timing configuration — add new modes without schema migrations */
export type QuizTimingConfig = {
  mode: QuizTimingMode;
  durationSeconds?: number;
  perQuestionSeconds?: number;
  showTimer?: boolean;
  autoSubmit?: boolean;
  gracePeriodSeconds?: number;
};

export type SeedQuestion = {
  questionText: string;
  questionType?: QuestionType | `${QuestionType}`;
  options: string[];
  correctAnswer?: string;
  correctAnswers?: string[];
  explanation?: string;
  xp?: number;
  skillLevel?: SkillLevel;
  timeLimitSeconds?: number;
  metadata?: Record<string, unknown>;
};

export type SeedQuizDefinition = {
  title: string;
  slug: string;
  description?: string;
  quizType: QuizType;
  skillLevel: SkillLevel;
  difficulty: DifficultyLevel;
  timingMode: QuizTimingMode;
  timingConfig: QuizTimingConfig;
  passPercentage?: number;
  randomizeQuestions?: boolean;
  randomizeOptions?: boolean;
  categorySlug?: string;
  companySlug?: string;
  tagSlugs?: string[];
  tutorialIndex?: number;
  questionBankKey?: string;
  questionBankKeys?: string[];
  questionCount?: number;
  mixedSkillLevels?: boolean;
};

export type QuestionBank = Record<string, SeedQuestion[]>;
