/**
 * Handles GET requests to retrieve all attempts for a particular quiz by a specified user.
 * 
 * @param req - The incoming request object, expected to contain quizId as a route parameter
 *              and userId as a query parameter.
 * @returns A JSON response containing a list of attempts ordered by creation date,
 *          or an error message if the userId is missing.
 */

import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { quizId: string } }): Promise<NextResponse> {
    const { quizId } = params;
    const userId = new URL(req.url).searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const attempts = await prisma.attempt.findMany({
        where: { quizId, userId },
        orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(attempts);
}

/**
 * Handles POST requests to create a new attempt for a particular quiz by a specified user.
 * 
 * @param req - The incoming request object, expected to contain quizId as a route parameter
 *              and userId as a query parameter, and the attempt data in the request body.
 * @returns A JSON response containing the created attempt, or an error message if the userId is missing.
 */
export async function POST(req: NextRequest, { params }: { params: { quizId: string } }): Promise<NextResponse> {
    const { quizId } = params;
    const userId = new URL(req.url).searchParams.get("userId");
    const { answers } = await req.json();

    if (!userId) {
        return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const attempt = await prisma.attempt.create({
        data: {
            quizId,
            userId,
            answers: {
                createMany: {
                    data: answers,
                },
            },
        },
    });

    return NextResponse.json(attempt);
}

/**
 * Handles PUT requests to update an existing attempt for a particular quiz by a specified user.
 * 
 * @param req - The incoming request object, expected to contain quizId as a route parameter,
 *              userId as a query parameter, and the attempt data in the request body.
 * @returns A JSON response containing the updated attempt, or an error message if the userId is missing.
 */
export async function PUT(req: NextRequest, { params }: { params: { quizId: string } }): Promise<NextResponse> {
    const { quizId } = params;
    const userId = new URL(req.url).searchParams.get("userId");
    const { answers } = await req.json();

    if (!userId) {
        return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const attempt = await prisma.attempt.updateMany({
        where: { quizId, userId },
        data: {
            answers: {
                deleteMany: {},
                createMany: {
                    data: answers,
                },
            },
        },
    });

    return NextResponse.json(attempt);
}

/**
 * Handles DELETE requests to delete an existing attempt for a particular quiz by a specified user.
 * 
 * @param req - The incoming request object, expected to contain quizId as a route parameter
 *              and userId as a query parameter.
 * @returns A JSON response containing the deleted attempt, or an error message if the userId is missing.
 */
export async function DELETE(req: NextRequest, { params }: { params: { quizId: string } }): Promise<NextResponse> {
    const { quizId } = params;
    const userId = new URL(req.url).searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const attempt = await prisma.attempt.deleteMany({
        where: { quizId, userId },
    });

    return NextResponse.json(attempt);
}