"use client";

import Link from "next/link";
import { fetchTutorial, fetchUserProgress } from "@/lib/api";
import { useSession } from "next-auth/react";
import { Quiz } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function TutorialPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { id } = useParams();

  const { data: tutorial, isLoading: tutorialLoading } = useQuery({
    queryKey: ["tutorial", id],
    queryFn: () => fetchTutorial(id as string),
    enabled: !!id,
  });

  const { data: progress, isLoading: progressLoading } = useQuery({
    queryKey: ["progress", userId, id],
    queryFn: () => fetchUserProgress(userId as string, id as string),
    enabled: !!userId && !!id,
  });

  if (tutorialLoading || progressLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{tutorial?.title}</h1>
      <p className="text-gray-600 mb-4">{tutorial?.content}</p>

      <h2 className="text-xl font-semibold mb-4">Quizzes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tutorial?.quizzes?.map((quiz: Quiz) => (
          <Link key={quiz.id} href={`/tutorials/${id}/quiz/${quiz.id}`}>
            <div className="border p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold">{quiz?.title}</h3>
              <p className="text-sm text-gray-500">
                {quiz.isTimed ? `Timed (${quiz.timeLimit}s)` : "Untimed"}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {progress?.isCompleted && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          You have completed this tutorial!
        </div>
      )}
    </div>
  );
}
