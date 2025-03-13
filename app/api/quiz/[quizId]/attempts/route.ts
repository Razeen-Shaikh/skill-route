import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { quizId: string } }) {
    const session = await getServerSession(authOptions);
    const { quizId } = params;
    let body;

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
    }

    const userId = session.user.id;

    try {
        const { score } = body;

        const attempt = await prisma.attempt.create({
            data: {
                score,
                userId,
                quizId: parseInt(quizId),
            },
        });

        return NextResponse.json(attempt);
    } catch (error) {
        console.error("Error creating attempt:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}