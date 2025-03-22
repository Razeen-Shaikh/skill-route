import { Quiz } from "@/lib/interface";
import Link from "next/link";
import React from "react";

const QuizCard = ({
  quiz,
  isCompleted,
}: {
  quiz: Quiz;
  isCompleted: boolean;
}) => {
  return (
    <Link href={`/tutorials/${quiz.tutorialId}/quiz/${quiz.id}`}>
      <div
        className={`border p-4 rounded-lg shadow-md hover:shadow-lg transition space-y-2 ${
          isCompleted ? "bg-green-100 border-green-400" : "bg-card"
        }`}
      >
        <h3 className="text-lg font-semibold flex items-center justify-between">
          {quiz.title}{" "}
          {isCompleted && (
            <span className="ml-2 text-green-600">✔ Completed</span>
          )}
        </h3>
        <p className="text-sm text-gray-500">
          {quiz.isTimed ? `⏳ Timed (${quiz.timeLimit}s)` : "⏳ Untimed"}
        </p>
      </div>
    </Link>
  );
};

export default QuizCard;
