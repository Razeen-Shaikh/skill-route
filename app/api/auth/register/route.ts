import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { username, email, password } = await req.json();

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        await prisma.user.create({
            data: {
                username,
                email,
                passwordHash: hashedPassword,
                profile: { create: {} },
                coinWallet: { create: {} },
            },
        });

        return NextResponse.json({ message: "User registered successfully!" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to register user" }, { status: 500 });
    }
}
