import prisma from "@/lib/prisma";
import { QuestionType, Quiz } from "@/generated/prisma";
import { allQuizDefinitions } from "../data/quizDefinitions";
import { questionBanks } from "../data/questionBanks";
import { buildTimingFields, pickQuestions } from "../helpers";
import { SeedQuestion } from "../types";
import { CategoryMap, CompanyMap, TagMap } from "./catalog";

type QuestionBankKey = keyof typeof questionBanks;

function resolveQuestionPool(def: (typeof allQuizDefinitions)[0]): SeedQuestion[] {
  const keys = def.questionBankKeys ?? (def.questionBankKey ? [def.questionBankKey] : []);
  const pool: SeedQuestion[] = [];

  for (const key of keys) {
    const bank = questionBanks[key as QuestionBankKey];
    if (bank) pool.push(...bank);
  }

  return pool;
}

function normalizeQuestion(q: SeedQuestion, order: number) {
  const questionType = (q.questionType as QuestionType) ?? QuestionType.MCQ;
  const correctAnswers =
    q.correctAnswers ??
    (q.correctAnswer ? [q.correctAnswer] : []);

  return {
    questionText: q.questionText,
    questionType,
    options: q.options,
    correctAnswer: q.correctAnswer ?? correctAnswers[0] ?? "",
    correctAnswers,
    explanation: q.explanation,
    xp: q.xp ?? 5,
    order,
    skillLevel: q.skillLevel,
    timeLimitSeconds: q.timeLimitSeconds,
    metadata: q.metadata ?? undefined,
  };
}

export async function seedQuizzes(
  tutorialIds: string[],
  categoryMap: CategoryMap,
  companyMap: CompanyMap,
  tagMap: TagMap
) {
  console.log("🌱 Seeding quizzes and questions...");
  const quizzes: Quiz[] = [];
  let totalQuestions = 0;

  for (let index = 0; index < allQuizDefinitions.length; index++) {
    const def = allQuizDefinitions[index];
    const pool = resolveQuestionPool(def);
    const count = def.questionCount ?? pool.length;
    const selected = pickQuestions(pool, count);
    const timing = buildTimingFields(def.timingConfig);
    const tutorialId =
      def.tutorialIndex !== undefined ? tutorialIds[def.tutorialIndex] : undefined;

    const tagConnect = (def.tagSlugs ?? [])
      .map((slug) => tagMap.get(slug))
      .filter(Boolean)
      .map((id) => ({ id: id! }));

    const createdQuiz = await prisma.quiz.create({
      data: {
        title: def.title,
        slug: def.slug,
        description: def.description,
        quizType: def.quizType,
        skillLevel: def.skillLevel,
        difficulty: def.difficulty,
        ...timing,
        maxScore: selected.reduce((sum, q) => sum + (q.xp ?? 5), 0),
        passPercentage: def.passPercentage ?? 50,
        order: index + 1,
        questionCount: selected.length,
        estimatedDuration: timing.isTimed
          ? Math.ceil((def.timingConfig.durationSeconds ?? 0) / 60)
          : Math.ceil(selected.length * 1.5),
        randomizeQuestions: def.randomizeQuestions ?? false,
        randomizeOptions: def.randomizeOptions ?? false,
        tutorialId: tutorialId ?? null,
        tutorialLocked: tutorialId ? index > 0 : false,
        categoryId: def.categorySlug ? categoryMap.get(def.categorySlug) : undefined,
        companyId: def.companySlug ? companyMap.get(def.companySlug) : undefined,
        tags: tagConnect.length ? { connect: tagConnect } : undefined,
        questions: {
          create: selected.map((q, i) => normalizeQuestion(q, i + 1)),
        },
      },
      include: { questions: true },
    });

    quizzes.push(createdQuiz);
    totalQuestions += createdQuiz.questions.length;
  }

  console.log(`🌱 Created ${quizzes.length} quizzes with ${totalQuestions} questions`);
  return quizzes;
}
