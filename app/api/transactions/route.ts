import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { TransactionType } from "@prisma/client";

export async function GET(req: NextRequest) {
    const user = await getAuthUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user?.id;

    if (!userId) {
        return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const limit = Number(url.searchParams.get("limit")) || 5;
    const filter = url.searchParams.get("filter") as unknown as TransactionType;

    if (!Number.isInteger(page) || page <= 0) {
        return NextResponse.json({ error: "Invalid page number" }, { status: 400 });
    }

    if (!Number.isInteger(limit) || limit <= 0) {
        return NextResponse.json({ error: "Invalid limit" }, { status: 400 });
    }

    if (filter && !Object.values(TransactionType).includes(filter)) {
        return NextResponse.json({ error: "Invalid filter" }, { status: 400 });
    }

    const whereClause = {
        profileId: userId,
        ...(filter && Object.values(TransactionType).includes(filter) && { type: filter }),
    };

    const transactions = await prisma.coinTransaction.findMany({
        where: whereClause,
        orderBy: { transactionAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
    });

    if (!transactions) {
        return NextResponse.json({ error: "Transactions not found" }, { status: 404 });
    }

    const totalTransactions = await prisma.coinTransaction.count({ where: whereClause });
    const totalPages = Math.ceil(totalTransactions / limit);

    return NextResponse.json({ transactions, totalPages });
}


export async function POST(req: NextRequest) {
    try {
        const user = await getAuthUser();

        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const userId = user?.id?.toString();

        if (!userId) return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });

        const { type, amount, description } = await req.json();

        if (!amount || amount <= 0) {
            return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
        }

        // Ensure enough coins are available for spending
        const profile = await prisma.userProfile.findUnique({ where: { userId }, include: { coinWallet: true } });

        if (!profile) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 });
        }

        if (type === "SPENT" && profile!.coinWallet!.coins < amount) {
            return NextResponse.json({ error: "Insufficient coins" }, { status: 400 });
        }

        const transaction = await prisma.coinTransaction.create({
            data: {
                profileId: userId,
                type,
                amount,
                description,
            },
        });

        await prisma.coinWallet.update({
            where: { profileId: profile!.coinWallet!.profileId },
            data: {
                coins: type === "EARNED" ? profile!.coinWallet!.coins + amount : profile!.coinWallet!.coins - amount,
            },
        });

        return NextResponse.json(transaction, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 });
    }
}
