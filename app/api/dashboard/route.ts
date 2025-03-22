import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const emailParam = url.searchParams.get("email");

        if (!emailParam) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: emailParam },
            include: {
                profile: {
                    include: {
                        transactions: true,
                    }
                },
                progress: {
                    include: {
                        tutorial: true,
                    },
                },
                quizAttempts: {
                    include: {
                        quiz: true,
                    },
                },
                badges: {
                    include: {
                        badge: true,
                    },
                },
                streaks: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
