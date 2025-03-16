"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchQuiz, submitQuizAttempt } from "@/lib/api";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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
    <div className="w-[400px] mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg text-center">
      <h2 className="text-xl font-bold mb-4">{quiz.title}</h2>

      <div className="border border-gray-500 rounded-lg p-4 mb-4">
        <p className="text-lg font-semibold">{currentQuestion?.questionText}</p>
      </div>

      <div className="space-y-3">
        {currentQuestion?.options.map((option, index) => (
          <label
            key={index}
            htmlFor={`option-${currentQuestionIndex}-${index}`}
            className={`block border rounded-lg p-2 cursor-pointer transition ${
              selectedOptions[currentQuestion?.id] === option
                ? "bg-blue-500 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
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
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg"
            onClick={handleNextQuestion}
          >
            Next Question
          </button>
        ) : (
          <button
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg"
            onClick={handleSubmit}
          >
            Finish
          </button>
        )}
      </div>
    </div>
  );
}

// ✅ Quiz Skeleton Loader
const QuizSkeleton = () => (
  <Card className="max-w-lg mx-auto mt-6 shadow-lg">
    <CardHeader>
      <Skeleton className="w-32 h-6 rounded-md" />
    </CardHeader>
    <CardContent>
      <Skeleton className="w-full h-4 rounded-md mb-4" />
      <Skeleton className="w-3/4 h-4 rounded-md mb-2" />
      <Skeleton className="w-3/4 h-4 rounded-md mb-2" />
      <Skeleton className="w-3/4 h-4 rounded-md mb-2" />
      <Skeleton className="w-full h-10 rounded-md mt-4" />
    </CardContent>
  </Card>
);
