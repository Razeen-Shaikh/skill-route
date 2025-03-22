import MarkdownRenderer from "@/components/MarkdownRenderer";
import QuizList from "@/components/tutorials/quiz-list/QuizList";
import { Tutorial } from "@/lib/interface";

export default function TutorialContent({ tutorial }: { tutorial: Tutorial }) {
  return (
    <>
      <MarkdownRenderer content={tutorial.content} />

      <div className="mt-8 text-muted-foreground">
        <h2 className="text-xl font-bold">💬 Interview Questions</h2>
        <p>Coming soon...</p>
      </div>

      <QuizList quizzes={tutorial.quizzes} />
    </>
  );
}
