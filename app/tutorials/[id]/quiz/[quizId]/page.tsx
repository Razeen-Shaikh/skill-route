"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchQuiz, submitQuizAttempt } from "@/lib/api";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import QuizSkeleton from "@/app/tutorials/skeletons/quiz";

export default function QuizPage() {
  const [selectedOptions, setSelectedOptions] = useState<
    Record<number, string>
  >({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // const [currentQuestionId, setCurrentQuestionId] = useState(quiz?.questions?.[currentQuestionIndex].id);

  const router = useRouter();
  const { quizId } = useParams() as { quizId: string };
  const { data: session } = useSession();

  const userId = useMemo(() => session?.user?.id, [session]);

  const {
    data: quiz,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["quiz", quizId],
    queryFn: () => {
      if (!quizId) {
        throw new Error("Quiz ID is undefined");
      }
      return fetchQuiz(quizId);
    },
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

  console.log("Selected option:", selectedOptions, currentQuestionId);

  const handleOptionSelect = useCallback(
    (option: string) => {
      console.log("Selected option:", option, currentQuestionId);
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
      if (!session) {
        throw new Error("User session is not available");
      }
      if (!quizId) {
        throw new Error("Quiz ID is not available");
      }
      if (!session.user) {
        throw new Error("User is not available");
      }
      return submitQuizAttempt({
        userId,
        quizId: Number(quizId),
        attempts:
          quiz?.questions?.map((q) => ({
            questionId: q.id,
            selectedOption: selectedOptions[q.id] ?? "",
          })) ?? [],
      });
    },
    onSuccess: () => {
      router.push("/dashboard");
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

  useEffect(() => {
    if (!session) {
      router.push("/auth/login");
    }
  }, [router, session]);

  if (isLoading) return <QuizSkeleton />;

  if (error || !quiz) {
    return (
      <p className="text-red-500">Failed to load quiz. Please try again.</p>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[92vh] overflow-hidden">
      <div className="w-[400px] mx-auto p-6 dark:bg-gray-900 dark:text-white bg-white border-gray-300 rounded-lg dark:shadow-lg shadow-xl text-center">
        <h2 className="text-xl font-bold mb-4">{quiz.title}</h2>

        <div className="border dark:border-gray-500 border-gray-300 rounded-lg p-4 mb-4">
          <p className="text-lg font-semibold">
            {currentQuestion?.questionText}
          </p>
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
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-white"
              onClick={handleNextQuestion}
            >
              Next Question
            </button>
          ) : (
            <button
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-white"
              onClick={handleSubmit}
            >
              Finish
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
