import { getAuthUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const user = await getAuthUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user?.id;

    if (!userId) {
        return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const profile = await prisma.userProfile.findUnique({ where: { userId }, select: { theme: true } });

    return profile
        ? NextResponse.json(profile.theme)
        : NextResponse.json({ error: "User not found" }, { status: 404 });
}

export async function PUT(req: NextRequest) {
    const user = await getAuthUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user?.id;

    if (!userId) {
        return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const { theme } = await req.json();

    if (!theme) {
        return NextResponse.json({ error: "Theme required" }, { status: 400 });
    }

    const updatedUser = await prisma.userProfile.update({
        where: { userId },
        data: { theme },
    });

    if (!updatedUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser.theme);
}