import { Button } from "@/components/ui/button";
import { Tutorial, UserProgress } from "@/lib/interfaces";

/**
 * A component that displays a header with two buttons:
 * - A 'Next' button to proceed to the next tutorial
 * - A 'Finish & Proceed' button to mark the current tutorial as completed
 *
 * @param {() => void} handleNext
 * @param {() => void} handleFinishTutorial
 * @param {boolean} hasCompletedQuizzes Whether the user has completed all quizzes in the current tutorial
 * @param {boolean} isLastTutorial Whether the current tutorial is the last one
 * @param {string} nextButtonLabel The label to be displayed on the 'Next' button
 * @param {{ status: string }} updateProgressMutation The mutation object returned by `useMutation` for updating the user's progress
 * @param {UserProgress} progress The user's progress for the current tutorial
 * @param {Tutorial} tutorial The tutorial object
 * @returns {React.ReactElement}
 */
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
