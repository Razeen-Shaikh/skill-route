import { getAuthUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const user = await getAuthUser();
    const userId = Number(user?.id);

    if (!userId) {
        return NextResponse.json({ error: 'userId is required.' }, { status: 400 });
    }

    const userProfile = await prisma.userProfile.findUnique({ where: { userId: userId } });
    if (!userProfile) {
        return NextResponse.json({ error: 'User profile not found.' }, { status: 404 });
    }

    return NextResponse.json({ coins: userProfile.coins });
}