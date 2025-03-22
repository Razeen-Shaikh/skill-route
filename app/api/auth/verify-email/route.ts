import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = new URL(request.url).searchParams;
    const token = searchParams.get('token');

    const user = await prisma.user.findUnique({ where: { verificationToken: token as string } });

    if (!user) {
        return NextResponse.json({ error: "Invalid token or user not found" }, { status: 400 });
    }

    await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: true, verificationToken: null },
    });

    return NextResponse.json({ message: "Email verified successfully!" }, { status: 200 });
}