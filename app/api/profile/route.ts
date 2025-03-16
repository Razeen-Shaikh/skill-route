import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: Request) {
    try {
        const { userId, avatarUrl, theme } = await req.json();

        const updatedUser = await prisma.userProfile.update({
            where: { userId },
            data: { theme: { update: { name: theme } }, user: { update: { avatarUrl } } },
            include: { user: true },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }
}
