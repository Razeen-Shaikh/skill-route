"use client";

import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import InterviewSection from "@/components/tutorials/InterviewSection";
import { fetchTutorial, updateProgress } from "@/lib/api";
import LockedTutorial from "@/components/tutorials/LockedTutorial";
import TutorialHeader from "@/components/tutorials/TutorialHeader";
import { TutorialPageSkeleton } from "@/components/skeletons";
import Link from "next/link";
import { AUTH_LOGIN_PATH, AUTH_REGISTER_PATH } from "@/lib/authNav";
import QuizList from "@/components/quiz/QuizList";
import { Tutorial } from "@/lib/interfaces";

export default function TutorialPage() {
  const tutorialId = useParams().id as string;
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const isAuthenticated = status === "authenticated" && userId;

  const { data: tutorial, isLoading: isLoadingTutorial } = useQuery({
    queryKey: ["tutorial", tutorialId, userId],
    queryFn: () => fetchTutorial(tutorialId),
    enabled: !!tutorialId,
    refetchOnWindowFocus: false,
  });

  const enrichedTutorial = tutorial as Tutorial & {
    allQuizzesPassed?: boolean;
    isCompleted?: boolean;
  };

  const updateProgressMutation = useMutation({
    mutationFn: () => updateProgress(userId!, enrichedTutorial!.id, 100),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tutorial", tutorialId, userId] });
      queryClient.invalidateQueries({ queryKey: ["tutorials", userId] });
    },
  });

  useEffect(() => {
    if (enrichedTutorial?.id && tutorialId !== enrichedTutorial.id) {
      router.replace(`/tutorials/${enrichedTutorial.id}`);
    }
  }, [enrichedTutorial, tutorialId, router]);

  const hasPassedAllQuizzes =
    enrichedTutorial?.allQuizzesPassed ??
    (enrichedTutorial?.quizzes?.length
      ? enrichedTutorial.quizzes.every((quiz) =>
          quiz.attempts?.some((attempt) => attempt.isPassed)
        )
      : false);

  const handleNext = async () => {
    if (!hasPassedAllQuizzes || !enrichedTutorial?.id) return;

    if (!enrichedTutorial.isCompleted && userId) {
      await updateProgressMutation.mutateAsync();
    }

    if (enrichedTutorial.nextTutorialId) {
      router.push(`/tutorials/${enrichedTutorial.nextTutorialId}`);
      return;
    }

    router.push("/roadmaps");
  };

  const isLastTutorial = !enrichedTutorial?.nextTutorialId;
  const nextButtonLabel = isLastTutorial ? "Finish & Return to Roadmap" : "Next Tutorial";

  if (isLoadingTutorial) {
    return <TutorialPageSkeleton />;
  }

  if (!enrichedTutorial) {
    return <p className="p-8">Tutorial not found.</p>;
  }

  return (
    <div className="p-8 space-y-8">
      {enrichedTutorial.isLocked ? (
        <LockedTutorial />
      ) : (
        <>
          <div>
            <h1 className="text-3xl font-bold">{enrichedTutorial.title}</h1>
            <p className="text-muted-foreground mt-2">{enrichedTutorial.description}</p>
          </div>

          {isAuthenticated && (
            <TutorialHeader
              handleNext={handleNext}
              hasCompletedQuizzes={hasPassedAllQuizzes}
              isLastTutorial={isLastTutorial}
              nextButtonLabel={nextButtonLabel}
              updateProgressMutation={updateProgressMutation}
              tutorial={enrichedTutorial}
            />
          )}

          <MarkdownRenderer content={enrichedTutorial.content ?? ""} />

          <InterviewSection />

          {isAuthenticated ? (
            <QuizList
              quizzes={enrichedTutorial.quizzes ?? []}
              tutorialId={enrichedTutorial.id}
            />
          ) : (
            <div>
              Your learning adventure starts here —{" "}
              <Link href={AUTH_LOGIN_PATH} className="underline text-blue-500">
                Login
              </Link>{" "}
              or{" "}
              <Link href={AUTH_REGISTER_PATH} className="underline text-blue-500">
                Register
              </Link>{" "}
              to begin!
            </div>
          )}
        </>
      )}
    </div>
  );
}
