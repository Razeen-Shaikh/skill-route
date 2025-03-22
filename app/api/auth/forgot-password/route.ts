import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { sendEmail } from "@/lib/email";
import prisma from "@/lib/prisma";


export async function POST(req: NextRequest) {
    const { email } = await req.json();

    if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry

    await prisma.user.update({
        where: { id: user.id },
        data: { resetToken, resetTokenExpiry: expiry },
    });

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;
    await sendEmail(email, "Reset Your Password", `Click this link to reset your password: ${resetUrl}`);

    return NextResponse.json({ message: "Password reset email sent!" }, { status: 200 });
}