import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { userId, amount } = await req.json();

        const wallet = await prisma.userCoins.findUnique({ where: { userId } });

        if (!wallet || wallet.coinsEarned - wallet.coinsSpent < amount) {
            return NextResponse.json({ error: "Insufficient coins" }, { status: 400 });
        }

        await prisma.userCoins.update({
            where: { userId },
            data: { coinsSpent: { increment: amount } },
        });

        return NextResponse.json({ message: "Coins deducted!" });
    } catch (error) {
        return NextResponse.json({ error: "Transaction failed" }, { status: 500 });
    }
}
