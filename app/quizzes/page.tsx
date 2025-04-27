"use client";

import { fetchQuizzes } from "@/lib/api";
import { shouldLockQuiz } from "@/lib/helper";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import { Button } from "@/components/ui/button";

export default function QuizzesPage() {
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["quizzes"],
    queryFn: async () => {
      const quizzes = await fetchQuizzes();
      return quizzes.map((quiz) => ({
        ...quiz,
        timeLimit: quiz.timeLimit ?? null,
        tutorialId: quiz.tutorialId ?? null,
      }));
    },
    refetchOnWindowFocus: false,
  });

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-200 mb-6">🧠 Quizzes</h1>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-36 bg-gray-800 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex flex-col items-center justify-center text-center text-gray-300 space-y-4">
          <p className="text-lg text-red-400">⚠️ Error: {error.message}</p>
          <Button
            onClick={() => refetch()}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            🔄 Retry
          </Button>
        </div>
      )}

      {/* Quizzes List */}
      {data && (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          aria-live="polite"
        >
          {data.map((quiz) => {
            const attempts = quiz?.attempts;

            let buttonText = "Start Quiz";
            let buttonColor = "bg-blue-600 hover:bg-blue-700";

            if (
              attempts.length === 1 &&
              quiz.passPercentage < (attempts[0].score / quiz.maxScore) * 100
            ) {
              buttonText = "Retry Quiz";
              buttonColor = "bg-red-500 hover:bg-red-600";
            } else if (attempts.length > 0) {
              buttonText = "Reattempt Quiz";
              buttonColor = "bg-green-500 hover:bg-green-600";
            }

            const isLocked =
              !isLoggedIn || quiz?.tutorialLocked || shouldLockQuiz(data, quiz);

            return (
              <div
                key={quiz.id}
                className={clsx(
                  "border p-4 rounded-lg transition transform",
                  isLocked
                    ? "bg-gray-700 opacity-60 cursor-not-allowed"
                    : "dark:bg-gray-900 hover:scale-105 hover:shadow-lg"
                )}
              >
                <h2 className="text-lg font-semibold dark:text-white truncate">
                  {quiz.title}
                </h2>
                <p className="text-sm text-gray-400 truncate mb-2">
                  📘 {quiz.tutorial?.title || "Untitled Tutorial"}
                </p>
                <p className="text-sm dark:text-gray-400">
                  {quiz.isTimed
                    ? `⏳ Timed (${quiz.timeLimit} sec)`
                    : "📖 No time limit"}
                </p>

                {isLocked ? (
                  <Button
                    disabled
                    className="mt-3 w-full py-2 bg-gray-500 text-white rounded-lg cursor-pointer"
                  >
                    🔒 Locked
                  </Button>
                ) : (
                  <Link
                    href={`/quizzes/${quiz.id}`}
                    passHref
                  >
                    <Button
                      className={`mt-3 w-full py-2 text-white rounded-lg transition cursor-pointer ${buttonColor}`}
                    >
                      {buttonText}
                    </Button>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
