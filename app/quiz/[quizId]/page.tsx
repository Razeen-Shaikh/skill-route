"use client";

import QuizQuestion from "@/components/QuizQuestion";
import { fetchQuizData, postAttemptData } from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";

const Quiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  const queryClient = useQueryClient();

  const {
    data: quizData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["quiz", "1"],
    queryFn: () => fetchQuizData(1),
  });

  const questions = useMemo(() => quizData?.questions ?? [], [quizData]);

  const postAttempt = async (score: number) => {
    await postAttemptData(1, { score });
    queryClient.invalidateQueries({ queryKey: ["quiz", "1"] });
  };

  const handleNext = async (isCorrect: boolean) => {
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    if (currentQuestionIndex < questions?.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setIsQuizCompleted(true);
      await postAttempt(score + (isCorrect ? 1 : 0));
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>An error occurred!</p>;

  if (isQuizCompleted) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <h2 className="text-2xl font-bold">🎉 Quiz Completed!</h2>
        <p className="text-lg">
          Your Score:{" "}
          <span className="font-semibold">
            {score}/{questions?.length}
          </span>
        </p>
        <button
          onClick={() => {
            setCurrentQuestionIndex(0);
            setScore(0);
            setIsQuizCompleted(false);
          }}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
        >
          Retry Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <QuizQuestion
        question={questions[currentQuestionIndex]}
        onNext={handleNext}
      />
    </div>
  );
};

export default Quiz;
