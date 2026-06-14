"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchQuiz, submitQuizAttempt } from "@/lib/api";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import QuizSkeleton from "@/components/skeletons/QuizSkeleton";

export default function QuizPage({
  quizId,
  tutorialId,
}: {
  quizId: string;
  tutorialId?: string;
}) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [result, setResult] = useState<{
    scorePercentage: number;
    isPassed: boolean;
    xpEarned: number;
    coinsAwarded: number;
    leveledUp: boolean;
    level: number;
    message: string;
    nextTutorialId: string | null;
    allQuizzesPassed: boolean;
  } | null>(null);

  const { status, data: session } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const userId = session?.user?.id;
  const isAuthenticated = status === "authenticated";

  const { data: quiz, isLoading } = useQuery({
    queryKey: ["quiz", quizId],
    queryFn: () => fetchQuiz(quizId),
    enabled: !!quizId && isAuthenticated,
    refetchOnWindowFocus: false,
  });

  const currentQuestion = useMemo(
    () => quiz?.questions?.[currentQuestionIndex] ?? null,
    [currentQuestionIndex, quiz]
  );

  const invalidateTutorialQueries = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["completedQuizzes"] });
    queryClient.invalidateQueries({ queryKey: ["tutorials", userId] });
    if (tutorialId) {
      queryClient.invalidateQueries({ queryKey: ["tutorial", tutorialId, userId] });
    }
  }, [queryClient, tutorialId, userId]);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!quizId) throw new Error("Quiz ID is not available");
      return submitQuizAttempt(
        quizId,
        quiz?.questions?.map((q) => ({
          questionId: q.id,
          selectedOption: selectedOptions[q.id] ?? "",
        })) ?? []
      );
    },
    onSuccess: (response) => {
      invalidateTutorialQueries();
      setResult({
        scorePercentage: response.data.scorePercentage,
        isPassed: response.data.isPassed,
        xpEarned: response.data.xpEarned,
        coinsAwarded: response.data.coinsAwarded,
        leveledUp: response.data.leveledUp,
        level: response.data.level,
        message: response.message,
        nextTutorialId: response.data.nextTutorialId,
        allQuizzesPassed: response.data.allQuizzesPassed,
      });
    },
    onError: (error) => {
      console.error("Submission error:", error);
    },
  });

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (quiz?.questions?.length ?? 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      mutate();
    },
    [mutate]
  );

  const returnToTutorial = () => {
    if (tutorialId) {
      router.push(`/tutorials/${tutorialId}`);
      return;
    }
    router.back();
  };

  const goToNextTutorial = () => {
    if (result?.nextTutorialId) {
      router.push(`/tutorials/${result.nextTutorialId}`);
      return;
    }
    returnToTutorial();
  };

  useEffect(() => {
    if (quiz?.isTimed) {
      setTimeLeft(quiz.timeLimit ?? 0);
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev !== null ? prev - 1 : prev));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quiz]);

  useEffect(() => {
    if (timeLeft === 0) {
      handleSubmit();
    }
  }, [handleSubmit, timeLeft]);

  if (isLoading) return <QuizSkeleton />;
  if (!quiz) return <p>Quiz not found.</p>;

  if (result) {
    return (
      <div className="p-6 max-w-xl mx-auto space-y-4">
        <h1 className="text-3xl font-bold">
          {result.isPassed ? "Quiz Passed!" : "Quiz Complete"}
        </h1>
        <p className="text-muted-foreground">{result.message}</p>
        <div className="rounded-lg border p-4 space-y-2">
          <p>
            Score: <strong>{result.scorePercentage}%</strong>
          </p>
          <p>
            XP earned: <strong>+{result.xpEarned}</strong>
          </p>
          {result.coinsAwarded > 0 && (
            <p>
              Coins earned: <strong>+{result.coinsAwarded}</strong>
            </p>
          )}
          {result.leveledUp && (
            <p className="text-purple-600 font-semibold">
              Level up! You reached level {result.level}.
            </p>
          )}
          {result.allQuizzesPassed && (
            <p className="text-green-600 font-semibold">
              All quizzes passed for this tutorial!
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-white cursor-pointer"
            onClick={returnToTutorial}
          >
            Back to Tutorial
          </button>
          {result.allQuizzesPassed && result.nextTutorialId && (
            <button
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-white cursor-pointer"
              onClick={goToNextTutorial}
            >
              Next Tutorial →
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold mb-6">{quiz.title}</h1>
      {quiz.isTimed && (
        <div className="text-red-500 font-semibold text-lg">
          ⏳ Time Left: {timeLeft} seconds
        </div>
      )}
      <div className="border dark:border-gray-500 border-gray-300 rounded-lg p-4 mb-4">
        <p className="text-lg font-semibold">{currentQuestion?.questionText}</p>
      </div>

      <div className="space-y-3">
        {currentQuestion?.options.map((option, index) => (
          <label
            key={index}
            className={`block border rounded-lg p-2 cursor-pointer transition ${
              selectedOptions[currentQuestion?.id] === option
                ? "bg-blue-500 text-white"
                : "dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 hover:bg-gray-100"
            }`}
            onClick={() =>
              setSelectedOptions((prev) => ({
                ...prev,
                [currentQuestion.id]: option,
              }))
            }
          >
            {option}
          </label>
        ))}
      </div>

      <div className="flex items-center justify-end mt-4">
        {currentQuestionIndex < (quiz?.questions?.length ?? 0) - 1 ? (
          <button
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-white cursor-pointer"
            onClick={handleNextQuestion}
          >
            Next Question
          </button>
        ) : (
          <button
            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-white cursor-pointer disabled:opacity-50"
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending ? "Submitting..." : "Finish Quiz"}
          </button>
        )}
      </div>
    </div>
  );
}
