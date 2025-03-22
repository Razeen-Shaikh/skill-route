"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchQuiz, submitQuizAttempt } from "@/lib/api";
import { useSession } from "next-auth/react";
import { useCallback, useMemo, useState } from "react";
import QuizSkeleton from "@/app/tutorials/skeletons/quiz";

export default function QuizPage({ quizId }: { quizId: string }) {
  const [selectedOptions, setSelectedOptions] = useState<
    Record<number, string>
  >({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const { data: session } = useSession();
  const router = useRouter();

  const userId = session?.user?.id;

  const { data: quiz, isLoading } = useQuery({
    queryKey: ["quiz", quizId],
    queryFn: () => fetchQuiz(Number(quizId)),
    enabled: !!quizId,
  });

  const currentQuestion = useMemo(
    () => quiz?.questions?.[currentQuestionIndex] ?? null,
    [currentQuestionIndex, quiz]
  );

  const currentQuestionId = useMemo(
    () => currentQuestion?.id ?? null,
    [currentQuestion]
  );

  const handleOptionSelect = useCallback(
    (option: string) => {
      if (!currentQuestionId) {
        return;
      }
      setSelectedOptions((prev) => ({
        ...prev,
        [currentQuestionId]: option,
      }));
    },
    [currentQuestionId]
  );

  const { mutate } = useMutation({
    mutationFn: async () => {
      if (!quizId) {
        throw new Error("Quiz ID is not available");
      }
      return submitQuizAttempt(
        Number(userId),
        Number(quizId),
        quiz?.questions?.map((q) => ({
          questionId: q.id,
          selectedOption: selectedOptions[q.id] ?? "",
        })) ?? []
      );
    },
    onSuccess: () => {
      router.back();
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate();
  };

  if (isLoading) return <QuizSkeleton />;
  if (!quiz) return <p>Quiz not found.</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold mb-6">{quiz.title}</h1>
      <div className="border dark:border-gray-500 border-gray-300 rounded-lg p-4 mb-4">
        <p className="text-lg font-semibold">{currentQuestion?.questionText}</p>
      </div>

      <div className="space-y-3">
        {currentQuestion?.options.map((option, index) => (
          <label
            key={index}
            htmlFor={`option-${currentQuestionIndex}-${index}`}
            className={`block border rounded-lg p-2 cursor-pointer transition ${
              selectedOptions[currentQuestion?.id] === option
                ? "bg-blue-500 hover:bg-blue-600 hover:bg-blue-200 text-white"
                : "dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => handleOptionSelect(option)}
          >
            <input
              id={`option-${currentQuestionIndex}-${index}`}
              type="radio"
              name={`question-${currentQuestionIndex}`}
              className="hidden"
              value={option}
              readOnly
            />
            {option}
          </label>
        ))}
      </div>

      <div className="flex justify-end mt-4">
        {currentQuestionIndex < (quiz?.questions?.length ?? 0) - 1 ? (
          <button
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-white cursor-pointer"
            onClick={handleNextQuestion}
          >
            Next Question
          </button>
        ) : (
          <button
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-white cursor-pointer"
            onClick={handleSubmit}
          >
            Finish
          </button>
        )}
      </div>
    </div>
  );
}
