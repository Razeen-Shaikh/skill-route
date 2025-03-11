"use client";

import { useState } from "react";

interface Question {
  id: number;
  text: string;
  options: string[];
  answer: string;
}

interface QuizQuestionProps {
  question: Question;
  onNext: (isCorrect: boolean) => void;
}


const QuizQuestion: React.FC<QuizQuestionProps> = ({ question, onNext }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (option: string) => {
    if (!submitted) {
      setSelectedOption(option);
    }
  };

  const handleSubmit = () => {
    if (selectedOption) {
      const isCorrect = selectedOption === question.answer;
      setSubmitted(true);
      setTimeout(() => {
        onNext(isCorrect); // Move to next question
        setSubmitted(false);
        setSelectedOption(null);
      }, 1000);
    }
  };

  return (
    <div className="max-w-lg p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">{question.text}</h2>
      <div className="space-y-2">
        {question.options.map((option) => (
          <button
            key={option}
            className={`w-full p-3 text-left border rounded-lg ${
              submitted
                ? option === question.answer
                  ? "bg-green-500 text-white"
                  : option === selectedOption
                  ? "bg-red-500 text-white"
                  : "bg-gray-200"
                : selectedOption === option
                ? "bg-blue-500 text-white"
                : "bg-gray-100"
            }`}
            onClick={() => handleSelect(option)}
            disabled={submitted}
          >
            {option}
          </button>
        ))}
      </div>
      <button
        className="mt-4 w-full p-3 bg-blue-600 text-white rounded-lg disabled:bg-gray-400"
        onClick={handleSubmit}
        disabled={!selectedOption || submitted}
      >
        Submit
      </button>
    </div>
  );
};

export default QuizQuestion;
