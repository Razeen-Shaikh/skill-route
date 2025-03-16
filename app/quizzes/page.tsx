"use client";

import { Quiz } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function QuizzesPage() {
  const {
    data: quizzes,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["quizzes"],
    queryFn: async () => {
      const res = await fetch("/api/quizzes");
      return res.json();
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading quizzes</p>;

  return (
    <div>
      <h1>Quizzes</h1>
      <ul>
        {quizzes.map((quiz: Quiz) => (
          <li key={quiz.id}>
            <Link href={`/quizzes/${quiz.id}`}>{quiz?.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
