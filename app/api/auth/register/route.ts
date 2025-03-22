import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
    try {
        const { username, email, password } = await req.json();

        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString("hex");

        await prisma.user.create({
            data: {
                username,
                email,
                passwordHash: hashedPassword,
                verificationToken,
                profile: { create: {} },
            },
        });

        const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken}`;
        await sendEmail(email, "Verify Your Email", `Click this link to verify your email: ${verificationUrl}`);

        return NextResponse.json({ message: "User registered! Check your email for verification." }, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Failed to register user" }, { status: 500 });
    }
}