import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const userId = new URL(request.url).searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const quiz = await prisma.question.findMany({
        where: { userId },
        orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(quiz);
}