"use client";

import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import QuizSubmit from "../submit";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

export default function QuizDetail() {
  const { id } = useParams();
  const { data: session } = useSession();

  const {
    data: quiz,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["quiz", id],
    queryFn: async () => {
      const res = await fetch(`/api/quizzes/${id}`);
      return res.json();
    },
    enabled: !!id,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading quiz</p>;
  if (!quiz) return <p>Quiz not found</p>;

  return (
    <div>
      <h1>{quiz.question}</h1>
      <pre>{JSON.stringify(quiz.options, null, 2)}</pre>
      <QuizSubmit quizId={quiz.id} userId={session?.user?.id} />
    </div>
  );
}
