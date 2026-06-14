"use client";

import { Quiz } from "@/lib/interfaces";
import { fetchQuizAttempts } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import QuizCard from "./QuizCard";

export default function QuizList({
  quizzes,
  tutorialId,
}: {
  quizzes: Quiz[];
  tutorialId: string;
}) {
  const quizIds = quizzes?.map((quiz) => quiz.id);

  const { data: completedQuizzes = [] } = useQuery({
    queryKey: ["completedQuizzes", quizIds],
    queryFn: () => fetchQuizAttempts(quizIds),
    enabled: quizIds.length > 0,
  });

  const passedCount = quizzes.filter((quiz) =>
    completedQuizzes.some(
      (completed: { quizId: string; isPassed?: boolean }) =>
        completed.quizId === quiz.id && completed.isPassed
    )
  ).length;
  const progress = quizzes.length > 0 ? (passedCount / quizzes.length) * 100 : 0;

  return (
    <div className="space-y-4 text-muted-foreground">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Quiz progress</span>
          <span>
            {passedCount}/{quizzes.length} passed
          </span>
        </div>
        <Progress value={progress} />
      </div>

      <h2 className="text-2xl font-semibold mt-6">Quizzes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quizzes.map((quiz) => {
          const attempt = completedQuizzes.find(
            (completed: { quizId: string; score: number; isPassed?: boolean; completedAt: string | null }) =>
              completed.quizId === quiz.id
          );
          const isPassed = attempt?.isPassed ?? false;

          return (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              tutorialId={tutorialId}
              isCompleted={isPassed}
              score={attempt?.score ?? 0}
              completedAt={attempt?.completedAt ?? ""}
            />
          );
        })}
      </div>
    </div>
  );
}
