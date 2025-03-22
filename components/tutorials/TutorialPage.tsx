"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import InterviewSection from "@/components/tutorials/InterviewSection";
import QuizList from "@/components/tutorials/quiz-list/QuizList";
import { fetchTutorial, fetchUserProgress, updateProgress } from "@/lib/api";
import LockedTutorial from "@/components/tutorials/LockedTutorial";
import TutorialHeader from "@/components/tutorials/TutorialHeader";
import { Tutorial, UserProgress, UserQuizAttempt } from "@/lib/interface";
import { Skeleton } from "../ui/skeleton";

export default function TutorialPage({ tutorialId }: { tutorialId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { data: tutorial, isLoading } = useQuery<Tutorial>({
    queryKey: ["tutorial", tutorialId],
    queryFn: () => {
      if (!tutorialId) throw new Error("Tutorial ID is required");
      return fetchTutorial(Number(tutorialId));
    },
    enabled: !!tutorialId && !!userId,
  });

  const { data: progress } = useQuery<UserProgress>({
    queryKey: ["progress", userId, tutorialId],
    queryFn: () => fetchUserProgress(Number(userId), Number(tutorialId)),
    enabled: !!tutorialId && !!userId,
  });

  const updateProgressMutation = useMutation({
    mutationFn: (progressData: {
      userId: number;
      tutorialId: number;
      percentageCompleted: number;
    }) =>
      updateProgress(
        progressData.userId,
        progressData.tutorialId,
        progressData.percentageCompleted
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["progress", userId, tutorialId],
      });
    },
  });

  const hasCompletedQuizzes = tutorial?.quizzes.every(
    (quiz: { attempts: UserQuizAttempt[] }) => quiz.attempts.length > 0
  );

  const handleNext = () => {
    if (tutorial?.nextTutorialId) {
      router.push(`/tutorials/${tutorial?.nextTutorialId}`);
    }
  };

  const handleFinishTutorial = () => {
    const overallPercentageCompleted =
      tutorial &&
      (tutorial?.quizzes?.filter(
        (quiz: { attempts: UserQuizAttempt[] }) => quiz?.attempts?.length > 0
      ).length /
        tutorial?.quizzes.length) *
        100;

    updateProgressMutation.mutate({
      tutorialId: Number(tutorialId),
      userId: Number(userId),
      percentageCompleted: overallPercentageCompleted ?? 0,
    });
  };

  const isLastTutorial = !tutorial?.nextTutorialId;
  const nextButtonLabel = isLastTutorial
    ? progress?.interviewCompleted
      ? progress?.challengeCompleted || !tutorial?.hasChallenge
        ? "Finish Tutorial"
        : "Go to Code Challenge"
      : "Go to Interview Questions"
    : "Next Tutorial";

  if (isLoading && !tutorial && !tutorialId) {
    return (
      <div className="p-8 space-y-8">
        {/* Skeleton for Header */}
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-6 w-1/2" />

        {/* Skeleton for Content */}
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>

        {/* Skeleton for Quiz List */}
        <div className="mt-6">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-6 w-3/4 mt-2" />
          <Skeleton className="h-6 w-1/2 mt-2" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {tutorial?.isLocked ? (
        <LockedTutorial />
      ) : (
        <>
          <TutorialHeader
            handleNext={handleNext}
            handleFinishTutorial={handleFinishTutorial}
            hasCompletedQuizzes={hasCompletedQuizzes!}
            isLastTutorial={isLastTutorial}
            nextButtonLabel={nextButtonLabel}
            updateProgressMutation={updateProgressMutation}
            progress={progress!}
            tutorial={tutorial!}
          />

          <MarkdownRenderer content={tutorial?.content ?? ""} />

          <InterviewSection />

          <QuizList quizzes={tutorial?.quizzes ?? []} />
        </>
      )}
    </div>
  );
}
