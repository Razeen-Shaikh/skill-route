import { getAuthUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const user = await getAuthUser();
    const userId = user?.id;

    if (!userId) {
        return NextResponse.json({ error: 'userId is required.' }, { status: 400 });
    }

    const coinWallet = await prisma.coinWallet.findUnique({ where: { profileId: userId } });

    if (!coinWallet) {
        return NextResponse.json({ error: 'Coin wallet not found.' }, { status: 404 });
    }

    return NextResponse.json(coinWallet);
}