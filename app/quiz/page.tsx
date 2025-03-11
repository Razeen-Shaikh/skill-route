"use client";

import QuizQuestion from "@/components/QuizQuestion";
import { useState } from "react";

const questions = [
  {
    id: 1,
    text: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    answer: "Paris",
  },
  {
    id: 2,
    text: "Which language is used for web development?",
    options: ["Python", "Java", "JavaScript", "C++"],
    answer: "JavaScript",
  },
];

const Quiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);

  const handleNext = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      alert(
        `Quiz Completed! Your Score: ${score + (isCorrect ? 1 : 0)}/${
          questions.length
        }`
      );
    }
  };

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
