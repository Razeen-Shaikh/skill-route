import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const { userId, quizId, attempts } = await request.json();

        if (!userId) {
            return NextResponse.json(
                { error: 'userId is required.' },
                { status: 400 }
            );
        }

        if (!quizId) {
            return NextResponse.json(
                { error: 'quizId is required.' },
                { status: 400 }
            );
        }

        if (!attempts || !Array.isArray(attempts) || attempts.length === 0) {
            return NextResponse.json(
                { error: 'attempts is required.' },
                { status: 400 }
            );
        }

        const questionIds = attempts.map((a) => a.questionId);

        // Fetch all related questions in a single query
        const questions = await prisma.quizQuestion.findMany({
            where: { id: { in: questionIds } },
        });

        // Map questionId to correct answers for quick lookup
        const correctAnswersMap = new Map(
            questions.map((q) => [q.id, q.correctAnswer])
        );

        let totalScore = 0;
        const userQuestionAttempts = attempts.map(({ questionId, selectedOption }) => {
            const correctAnswer = correctAnswersMap.get(questionId);
            const isCorrect = selectedOption === correctAnswer;
            const xpEarned = isCorrect ? 2 : 0;

            if (isCorrect) { totalScore += xpEarned; }

            return {
                questionId,
                selectedOption,
                isCorrect,
                xpEarned,
            };
        });

        console.log('userQuestionAttempts', userQuestionAttempts);

        // Perform the transaction to ensure consistency
        const result = await prisma.$transaction(async (tx) => {
            // Create UserQuizAttempt
            const userQuizAttempt = await tx.userQuizAttempt.create({
                data: {
                    profileId: userId,
                    quizId,
                    startedAt: new Date(),
                    completedAt: new Date(),
                },
            });

            console.log('userQuizAttempt', userQuizAttempt);

            if (!userQuestionAttempts || userQuestionAttempts.length === 0) {
                throw new Error("No valid attempts to insert");
            }

            // Create all UserQuestionAttempt records in bulk
            await tx.userQuestionAttempt.createMany({
                data: userQuestionAttempts.map((attempt) => ({
                    userQuizAttemptId: userQuizAttempt.id,
                    ...attempt,
                })),
            });

            // Update UserQuizAttempt with the final score
            await tx.userQuizAttempt.update({
                where: { id: userQuizAttempt.id },
                data: { score: totalScore },
            });

            return {
                attemptId: userQuizAttempt.id,
                userId,
                quizId,
                totalScore,
            };
        });

        return NextResponse.json({
            success: true,
            message: 'Quiz submitted successfully.',
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
