"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

const fetchQuizQuestions = async (): Promise<QuizQuestion[]> => {
  const response = await fetch(
    "https://67cc58cfdd7651e464ebaf94.mockapi.io/api/v1/quiz"
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch quiz questions: ${response.status}`);
  }

  const responseBody = await response.json();
  if (
    !Array.isArray(responseBody) ||
    responseBody.some((item) => typeof item !== "object")
  ) {
    throw new Error("Expected an array of objects from the API");
  }

  return responseBody as QuizQuestion[];
};

const Quiz: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  const {
    data: quizData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["quizQuestions"],
    queryFn: fetchQuizQuestions,
  });

  const totalQuestions = quizData?.length || 0;
  const currentQuestion = quizData?.[currentQuestionIndex];

  const handleOptionSelect = (option: string) => {
    if (!selectedAnswer) {
      setSelectedAnswer(option);

      if (currentQuestion?.correctAnswer === option) {
        setScore((prevScore) => prevScore + 1);
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < totalQuestions) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedAnswer(null);
    } else {
      setIsQuizCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setIsQuizCompleted(false);
  };

  if (isLoading)
    return <p className="text-center text-gray-600">Loading questions...</p>;
  if (error)
    return (
      <p className="text-center text-red-500">Error fetching quiz data.</p>
    );

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6 border border-gray-200">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">🧠 Quiz</h2>

      {isQuizCompleted ? (
        <div className="text-center">
          <h3 className="text-xl font-semibold text-green-600">
            🎉 Quiz Completed!
          </h3>
          <p className="mt-2 text-lg font-medium">
            🏆 Final Score: <span className="text-blue-600">{score}</span> /{" "}
            {totalQuestions}
          </p>

          {/* Restart Quiz Button */}
          <button
            onClick={handleRestartQuiz}
            className="mt-4 bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition"
          >
            🔄 Restart Quiz
          </button>
        </div>
      ) : (
        <>
          {/* Progress Indicator */}
          <div className="mb-4 text-center">
            <p className="text-gray-700 font-semibold">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </p>
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{
                  width: `${
                    ((currentQuestionIndex + 1) / totalQuestions) * 100
                  }%`,
                }}
              ></div>
            </div>
          </div>

          <div className="p-4 border border-gray-300 rounded-lg shadow-md bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800">
              {currentQuestion?.question}
            </h3>
            <ul className="mt-3 space-y-2">
              {currentQuestion?.options.map((option: string, index: number) => (
                <li
                  key={index}
                  className={`p-2 border rounded-lg cursor-pointer transition-all ${
                    selectedAnswer
                      ? option === currentQuestion.correctAnswer
                        ? "bg-green-500 text-white font-bold"
                        : option === selectedAnswer
                        ? "bg-red-500 text-white font-bold"
                        : "bg-gray-100"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                  onClick={() => {
                    if (!selectedAnswer) {
                      handleOptionSelect(option)
                    }
                  }}
                >
                  {option}
                </li>
              ))}
            </ul>
          </div>

          {/* Next Question Button */}
          {selectedAnswer && (
            <button
              onClick={handleNextQuestion}
              className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
            >
              {currentQuestionIndex + 1 < totalQuestions
                ? "Next Question"
                : "Finish Quiz"}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default Quiz;
