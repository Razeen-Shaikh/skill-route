"use client";

import { Quiz } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function QuizzesPage() {
  const { data, error, isLoading, refetch } = useQuery<Quiz[]>({
    queryKey: ["quizzes"],
    queryFn: async () => {
      const res = await fetch("/api/quizzes");
      if (!res.ok) {
        throw new Error("Failed to fetch quizzes");
      }
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-200 mb-4">Quizzes</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-32 bg-gray-800 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center text-gray-300">
        <p className="text-lg text-red-400 mb-4">
          ⚠️ Error loading quizzes: {error.message}
        </p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold dark:text-gray-200 mb-6">🧠 Quizzes</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
        {data?.map((quiz) => (
          <Link
            key={quiz.id}
            href={`/tutorials/${quiz.tutorialId}/quiz/${quiz.id}`}
            className="group h-full"
          >
            <div className="dark:bg-gray-900 border border-gray-800 p-4 rounded-lg transition transform group-hover:scale-105 group-hover:shadow-lg">
              <h2 className="text-lg font-semibold dark:text-white mb-2 truncate">
                {quiz.title}
              </h2>
              <p className="text-sm dark:text-gray-400 text-gray-600">
                {quiz.isTimed
                  ? `⏳ Timed (${quiz.timeLimit} sec)`
                  : "📖 No time limit"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
