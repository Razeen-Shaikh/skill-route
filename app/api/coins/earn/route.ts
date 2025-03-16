import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { userId, amount, description } = await req.json();

        await prisma.userCoins.update({
            where: { userId },
            data: { coinsEarned: { increment: amount } },
        });

        await prisma.coinTransaction.create({
            data: { userId, type: "earn", amount, description },
        });

        return NextResponse.json({ message: "Coins awarded!" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to award coins" }, { status: 500 });
    }
}
