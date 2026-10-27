import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendEmail } from "@/lib/email";
import { isUsernameTaken, normalizeUsername, usernameValidationError } from "@/lib/username";

export async function POST(req: Request) {
    try {
        const { username, name, email, password } = await req.json();
        const normalizedUsername = normalizeUsername(typeof username === "string" ? username : name ?? "");
        const validationError = usernameValidationError(normalizedUsername);

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
        }

        if (validationError) {
            return NextResponse.json({ error: validationError }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            return NextResponse.json({ error: "An account with this email already exists." }, { status: 400 });
        }

        if (await isUsernameTaken(normalizedUsername)) {
            return NextResponse.json({ error: "That username is already taken." }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString("hex");
        const displayName = (typeof name === "string" && name.trim()) || normalizedUsername;

        await prisma.user.create({
            data: {
                username: normalizedUsername,
                email,
                firstName: displayName.split(" ")[0] || normalizedUsername,
                passwordHash: hashedPassword,
                verificationToken,
                profile: {
                    create: {
                        coinWallet: { create: {} },
                        streaks: { create: {} },
                    },
                },
            },
        });

        const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken}`;
        await sendEmail(email, "Verify Your Email", `Click this link to verify your email: ${verificationUrl}`);

        return NextResponse.json({ message: "User registered! Check your email for verification." }, { status: 201 });
    } catch (error) {
        if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
            return NextResponse.json({ error: "That username or email is already taken." }, { status: 400 });
        }
        return NextResponse.json({ error: "Failed to register user" }, { status: 500 });
    }
}