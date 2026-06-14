import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { Prisma } from '@/generated/prisma';
import { awardCoins, awardXp, COIN_REWARDS, ensureGamificationProfile, XP_REWARDS } from '@/lib/gamification';

export async function POST(request: NextRequest) {
    try {
        const user = await getAuthUser();
        const userId = user?.id;

        const { quizId, attempts } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!quizId) {
            return NextResponse.json({ error: 'quizId is required.' }, { status: 400 });
        }

        if (!attempts || !Array.isArray(attempts) || attempts.length === 0) {
            return NextResponse.json({ error: 'attempts is required.' }, { status: 400 });
        }

        await ensureGamificationProfile(userId);

        const quiz = await prisma.quiz.findUnique({
            where: { id: quizId },
            include: { questions: true },
        });

        if (!quiz) {
            return NextResponse.json({ error: 'Quiz not found.' }, { status: 404 });
        }

        const questionIds = attempts.map((attempt: { questionId: string }) => attempt.questionId);
        const questions = quiz.questions.filter((question) => questionIds.includes(question.id));
        const correctAnswersMap = new Map(
            questions.map((question) => [question.id, question.correctAnswer])
        );
        const questionXpMap = new Map(
            questions.map((question) => [question.id, question.xp || 5])
        );

        let totalScore = 0;
        let totalXpEarned = 0;
        const userQuestionAttempts = attempts.map(({ questionId, selectedOption }: { questionId: string; selectedOption: string }) => {
            const correctAnswer = correctAnswersMap.get(questionId);
            const isCorrect = selectedOption === correctAnswer;
            const xpEarned = isCorrect ? (questionXpMap.get(questionId) ?? 5) : 0;

            if (isCorrect) {
                totalScore += xpEarned;
                totalXpEarned += xpEarned;
            }

            return {
                questionId,
                selectedOption,
                isCorrect,
                xpEarned,
            };
        });

        const maxScore = quiz.questions.reduce((sum, question) => sum + (question.xp || 5), 0);
        const scorePercentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
        const isPassed = scorePercentage >= quiz.passPercentage;

        const existingAttempt = await prisma.userQuizAttempt.findUnique({
            where: { profileId_quizId: { profileId: userId, quizId } },
        });

        const isImprovement = !existingAttempt || totalScore > existingAttempt.score;
        const wasPreviouslyPassed = existingAttempt?.isPassed ?? false;

        const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            let userQuizAttempt;

            if (existingAttempt) {
                userQuizAttempt = await tx.userQuizAttempt.update({
                    where: { id: existingAttempt.id },
                    data: {
                        score: Math.max(existingAttempt.score, totalScore),
                        isPassed: wasPreviouslyPassed || isPassed,
                        completedAt: new Date(),
                        feedback: isPassed
                            ? `Passed with ${scorePercentage.toFixed(0)}%`
                            : `Scored ${scorePercentage.toFixed(0)}%. Need ${quiz.passPercentage}% to pass.`,
                    },
                });

                if (isImprovement) {
                    await tx.userQuestionAttempt.deleteMany({
                        where: { userQuizAttemptId: existingAttempt.id },
                    });

                    await tx.userQuestionAttempt.createMany({
                        data: userQuestionAttempts.map((attempt) => ({
                            userQuizAttemptId: existingAttempt.id,
                            ...attempt,
                        })),
                    });
                }
            } else {
                userQuizAttempt = await tx.userQuizAttempt.create({
                    data: {
                        profileId: userId,
                        quizId,
                        startedAt: new Date(),
                        completedAt: new Date(),
                        score: totalScore,
                        isPassed,
                        feedback: isPassed
                            ? `Passed with ${scorePercentage.toFixed(0)}%`
                            : `Scored ${scorePercentage.toFixed(0)}%. Need ${quiz.passPercentage}% to pass.`,
                    },
                });

                await tx.userQuestionAttempt.createMany({
                    data: userQuestionAttempts.map((attempt) => ({
                        userQuizAttemptId: userQuizAttempt.id,
                        ...attempt,
                    })),
                });
            }

            let xpResult = { xpAwarded: 0, leveledUp: false, level: 1, rank: "Beginner", totalXp: 0 };
            let coinsAwarded = 0;
            let passBonusAwarded = 0;

            if (isImprovement) {
                const previousBest = existingAttempt?.score ?? 0;
                const xpDelta = totalScore - previousBest;

                xpResult = await awardXp(tx, userId, xpDelta, {
                    type: "QUIZ",
                    description: `Quiz attempt: ${quiz.title} (+${xpDelta} XP)`,
                    quizId,
                    quizAttemptId: userQuizAttempt.id,
                });
            }

            if (isPassed && !wasPreviouslyPassed) {
                passBonusAwarded = XP_REWARDS.QUIZ_PASS_BONUS;
                const passBonus = await awardXp(tx, userId, passBonusAwarded, {
                    type: "QUIZ",
                    description: `Quiz passed: ${quiz.title} (+${passBonusAwarded} XP bonus)`,
                    quizId,
                    quizAttemptId: userQuizAttempt.id,
                });
                xpResult = passBonus;

                coinsAwarded = await awardCoins(
                    tx,
                    userId,
                    COIN_REWARDS.QUIZ_PASS,
                    `Passed quiz: ${quiz.title}`
                );

                const profile = await tx.userProfile.findUnique({
                    where: { userId },
                    select: { completedQuizzes: true },
                });

                if (profile && !profile.completedQuizzes.includes(quizId)) {
                    await tx.userProfile.update({
                        where: { userId },
                        data: { completedQuizzes: { push: quizId } },
                    });
                }
            }

            const tutorialProgress = await tx.userProgress.findUnique({
                where: { profileId_tutorialId: { profileId: userId, tutorialId: quiz.tutorialId } },
            });

            await tx.userProgress.upsert({
                where: { profileId_tutorialId: { profileId: userId, tutorialId: quiz.tutorialId } },
                update: {
                    bestScore: Math.max(tutorialProgress?.bestScore ?? 0, totalScore),
                    attempts: { increment: 1 },
                },
                create: {
                    profileId: userId,
                    tutorialId: quiz.tutorialId,
                    bestScore: totalScore,
                    attempts: 1,
                },
            });

            return {
                attemptId: userQuizAttempt.id,
                userId,
                quizId,
                totalScore,
                maxScore,
                scorePercentage: Math.round(scorePercentage),
                isPassed: wasPreviouslyPassed || isPassed,
                xpEarned: (isImprovement ? totalScore - (existingAttempt?.score ?? 0) : 0) + passBonusAwarded,
                coinsAwarded,
                leveledUp: xpResult.leveledUp,
                level: xpResult.level,
                rank: xpResult.rank,
                totalXp: xpResult.totalXp,
                isImprovement,
            };
        });

        return NextResponse.json({
            success: true,
            message: result.isPassed ? 'Quiz passed!' : 'Quiz submitted successfully.',
            data: result,
        });
    } catch (error) {
        console.error('Error submitting quiz:', error);
        return NextResponse.json(
            { error: 'An error occurred while submitting the quiz.' },
            { status: 500 }
        );
    }
}
