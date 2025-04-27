"use client";

import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import InterviewSection from "@/components/tutorials/InterviewSection";
import { fetchTutorial, fetchUserProgress, updateProgress } from "@/lib/api";
import LockedTutorial from "@/components/tutorials/LockedTutorial";
import TutorialHeader from "@/components/tutorials/TutorialHeader";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import QuizList from "@/components/quiz/QuizList";

export default function TutorialPage() {
  const tutorialId = useParams().id as string;
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const isAuthenticated = status === "authenticated" && userId;

  const { data: tutorial, isLoading: isLoadingTutorial } = useQuery({
    queryKey: ["tutorial", tutorialId],
    queryFn: () => fetchTutorial(tutorialId),
    enabled: !!tutorialId,
    refetchOnWindowFocus: false,
  });

  const { data: progress, isLoading: isLoadingProgress } = useQuery({
    queryKey: ["progress", userId, tutorialId],
    queryFn: () => fetchUserProgress(userId!, tutorialId),
    enabled: !!tutorialId && !!userId,
    refetchOnWindowFocus: false,
  });

  const updateProgressMutation = useMutation({
    mutationFn: (progressData: { userId: string; tutorialId: string; percentageCompleted: number; }) =>
      updateProgress(progressData.userId, progressData.tutorialId, progressData.percentageCompleted),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["progress", userId, tutorialId],
      });
    },
  });

  const hasCompletedQuizzes = tutorial?.quizzes.every((quiz) => quiz.attempts.length > 0);

  const handleNext = () => {
    if (tutorial?.nextTutorialId) {
      router.push(`/tutorials/${tutorial?.nextTutorialId}`);
    }
  };

  const handleFinishTutorial = () => {
    const overallPercentageCompleted = tutorial && (tutorial?.quizzes?.filter((quiz) => quiz?.attempts?.length > 0).length / tutorial?.quizzes.length) * 100;

    if (userId) {
      updateProgressMutation.mutate({ tutorialId, userId, percentageCompleted: overallPercentageCompleted ?? 0, });
    }

  };

  const isLastTutorial = !tutorial?.nextTutorialId;
  const nextButtonLabel = isLastTutorial
    ? progress?.interviewCompleted
      ? progress?.challengeCompleted || !tutorial?.hasChallenge
        ? "Finish Tutorial"
        : "Go to Code Challenge"
      : "Go to Interview Questions"
    : "Next Tutorial";

  if (isLoadingTutorial || isLoadingProgress) {
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

          {isAuthenticated ? (
            <QuizList quizzes={tutorial?.quizzes ?? []} />
          ) : (
            <div>
              Your learning adventure starts here —{" "}
              <Link href="/auth/login" className="underline text-blue-500">
                log in
              </Link>{" "}
              or{" "}
              <Link href="/auth/register" className="underline text-blue-500">
                sign up
              </Link>{" "}
              to begin!
            </div>
          )}
        </>
      )}
    </div>
  );
}
