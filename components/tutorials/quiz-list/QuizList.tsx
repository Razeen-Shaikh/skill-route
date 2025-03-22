"use client";

import { Quiz } from "@/lib/interface";
import ProgressBar from "../ProgressBar";
import QuizCard from "../quiz-card/QuizCard";
import { fetchQuizAttempts } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export default function QuizList({ quizzes }: { quizzes: Quiz[] }) {
  const quizIds = quizzes.map((quiz) => quiz.id);

  const { data: completedQuizzes = [] } = useQuery<{ quizId: number }[]>({
    queryKey: ["completedQuizzes", quizIds],
    queryFn: (): Promise<{ quizId: number }[]> => fetchQuizAttempts(quizIds),
    enabled: quizIds.length > 0,
  });

  const totalQuizzes = quizzes.length;
  const completedCount = completedQuizzes.length;
  const progress = totalQuizzes > 0 ? (completedCount / totalQuizzes) * 100 : 0;

  return (
    <div className="space-y-4 text-muted-foreground">
      {/* Progress Bar */}
      <ProgressBar progress={progress} />

      {/* Quiz List */}
      <h2 className="text-2xl font-semibold mt-6">Quizzes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quizzes.map((quiz) => {
          const isCompleted = completedQuizzes.some(
            (completed) => completed.quizId === quiz.id
          );
          return (
            <QuizCard key={quiz.id} quiz={quiz} isCompleted={isCompleted} />
          );
        })}
      </div>
    </div>
  );
}
