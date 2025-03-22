import QuizPage from "@/components/tutorials/quiz/QuizPage";

export default function Page({ params }: { params: { quizId: string } }) {
  return <QuizPage quizId={params.quizId} />;
}
