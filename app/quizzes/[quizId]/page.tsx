"use client";

import { useParams } from "next/navigation";
import QuizPage from "@/components/quiz/QuizPage";

export default function Page() {
  const params = useParams();
  const quizId = params.quizId as string;

  return <QuizPage quizId={quizId} />;
}
