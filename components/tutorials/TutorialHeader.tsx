import { Button } from "@/components/ui/button";
import { Tutorial } from "@/lib/interfaces";

export default function TutorialHeader({
  handleNext,
  hasCompletedQuizzes,
  isLastTutorial,
  nextButtonLabel,
  updateProgressMutation,
}: {
  handleNext: () => void;
  hasCompletedQuizzes: boolean;
  isLastTutorial: boolean;
  nextButtonLabel: string;
  updateProgressMutation: { status: string };
  tutorial: Tutorial;
}) {
  return (
    <div className="flex justify-between items-center gap-4">
      <div>
        <p className="text-sm text-muted-foreground">
          {hasCompletedQuizzes
            ? isLastTutorial
              ? "All quizzes passed. Tutorial complete!"
              : "All quizzes passed. Continue to the next tutorial."
            : "Pass all quizzes to unlock the next tutorial."}
        </p>
      </div>

      <Button
        onClick={handleNext}
        disabled={!hasCompletedQuizzes || updateProgressMutation.status === "pending"}
        className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {updateProgressMutation.status === "pending"
          ? "Loading..."
          : nextButtonLabel}
      </Button>
    </div>
  );
}
