"use client";

import { Quiz } from "@/lib/interfaces";
import { fetchQuizAttempts } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import QuizCard from "./QuizCard";

export default function QuizList({ quizzes }: { quizzes: Quiz[] }) {
  const quizIds = quizzes?.map((quiz) => quiz.id);

  const { data: completedQuizzes = [] } = useQuery({
    queryKey: ["completedQuizzes", quizIds],
    queryFn: () => fetchQuizAttempts(quizIds),
    enabled: quizIds.length > 0,
  });

  const totalQuizzes = quizzes.length;
  const completedCount = quizzes.filter((quiz) =>
    completedQuizzes.some((completed) => completed.quizId === quiz.id)
  ).length;
  const progress = (completedCount / totalQuizzes) * 100;

  return (
    <div className="space-y-4 text-muted-foreground">
      {/* Progress Bar */}
      <Progress value={progress} />

      {/* Quiz List */}
      <h2 className="text-2xl font-semibold mt-6">Quizzes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quizzes.map((quiz) => {
          const isCompleted = completedQuizzes.some((completed: { quizId: string; score: number }) => completed.quizId === quiz.id);
          const { score, completedAt } = completedQuizzes.find((completed) => completed.quizId === quiz.id) || {};

          return (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              isCompleted={isCompleted}
              score={score ?? 0}
              completedAt={completedAt ?? ""}
            />
          );
        })}
      </div>
    </div>
  );
}
