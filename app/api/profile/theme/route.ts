import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const profile = await prisma.userProfile.findUnique({ where: { userId: parseInt(userId) }, select: { theme: true } });

    return profile
        ? NextResponse.json(profile)
        : NextResponse.json({ error: "User not found" }, { status: 404 });
}

export async function PUT(req: Request) {
    const { userId, theme } = await req.json();

    if (!userId) {
        return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    if (!theme) {
        return NextResponse.json({ error: "Theme required" }, { status: 400 });
    }

    const updatedUser = await prisma.userProfile.update({
        where: { userId: parseInt(userId) },
        data: { theme },
    });

    if (!updatedUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
}