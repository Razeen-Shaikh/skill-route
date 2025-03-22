import { Button } from "@/components/ui/button";
import { Tutorial, UserProgress } from "@/lib/interface";

export default function TutorialHeader({
  handleNext,
  handleFinishTutorial,
  hasCompletedQuizzes,
  isLastTutorial,
  nextButtonLabel,
  updateProgressMutation,
  progress,
  tutorial,
}: {
  handleNext: () => void;
  handleFinishTutorial: () => void;
  hasCompletedQuizzes: boolean;
  isLastTutorial: boolean;
  nextButtonLabel: string;
  updateProgressMutation: { status: string };
  progress: UserProgress;
  tutorial: Tutorial;
}) {
  return (
    <div className="flex justify-between items-center">
      <Button
        onClick={handleNext}
        disabled={!hasCompletedQuizzes || isLastTutorial}
        className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {nextButtonLabel}
      </Button>

      <Button
        onClick={handleFinishTutorial}
        disabled={
          !hasCompletedQuizzes ||
          !progress?.interviewCompleted ||
          (tutorial.hasChallenge && !progress?.challengeCompleted)
        }
        className="px-4 py-2 bg-green-500 text-white rounded cursor-pointer hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {updateProgressMutation.status === "pending"
          ? "Processing Completion..."
          : "Finish & Proceed"}
      </Button>
    </div>
  );
}
