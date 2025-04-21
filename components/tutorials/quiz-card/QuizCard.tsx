import Link from "next/link";
import React from "react";
import clsx from "clsx";
import { Quiz } from "@/lib/interfaces";
import { formatDate } from "@/lib/helper";

const QuizCard = ({
  quiz,
  isCompleted,
  score,
  completedAt,
}: {
  quiz: Quiz;
  isCompleted: boolean;
  score: number;
  completedAt: string;
}) => {
  const { id, title, tutorialId, isTimed, timeLimit } = quiz;

  return (
    <Link
      href={`/tutorials/${tutorialId}/quiz/${id}`}
      aria-label={`Open quiz: ${title}`}
      className="block"
    >
      <div
        className={clsx(
          "border p-4 rounded-lg shadow-md transition-all duration-200 space-y-2",
          "hover:shadow-lg hover:scale-[1.02]",
          isCompleted
            ? "bg-green-50 border-green-400"
            : "bg-white dark:bg-gray-800"
        )}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          {isCompleted && (
            <span className="text-green-600 text-sm font-medium">
              ✔ Completed | Score: {score}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <p>{isTimed ? `⏳ Timed (${timeLimit}s)` : "⏳ Untimed"}</p>
          {isCompleted && (
            <p className="text-gray-600 dark:text-gray-400">
              🏆 {formatDate(completedAt)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default QuizCard;
