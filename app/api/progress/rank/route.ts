import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = Number(searchParams.get("userId"));

    const profile = await prisma.userProfile.findUnique({ where: { userId } });

    return profile
        ? NextResponse.json(profile)
        : NextResponse.json({ error: "User not found" }, { status: 404 });
}
