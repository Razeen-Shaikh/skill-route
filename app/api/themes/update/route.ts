import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authMiddleware } from "@/lib/middleware/auth";

export async function POST(req: NextRequest) {
    const authResponse = await authMiddleware(req);
    if (authResponse.status !== 200) {
        return authResponse;
    }

    try {
        const { userId, theme } = await req.json();

        await prisma.userProfile.update({
            where: { userId },
            data: { theme },
        });

        return NextResponse.json({ message: "Theme updated!" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update theme" }, { status: 500 });
    }
}
