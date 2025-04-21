import QuizPage from "@/components/tutorials/quiz/QuizPage";

export default function Page({ params }: { params: { id: string } }) {
    return <QuizPage quizId={params.id} />;
}