import { ActivityType } from "@prisma/client";
import prisma from "./prisma";

export async function logActivity(
  userId: string,
  type: ActivityType,
  xpAwarded?: number,
  description?: string,
  quizId?: string,
  tutorialId?: string,
  roadmapId?: string,
  roadmapStepId?: string,
  quizAttemptId?: string,
  questionAttemptId?: string,
) {
  await prisma.lastActivity.create({
    data: { userId, type, xpAwarded, description, quizId, tutorialId, roadmapId, roadmapStepId, quizAttemptId, questionAttemptId },
  });
}
