import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId, tutorialId } = await req.json();

    await prisma.userProgress.upsert({
      where: { userId_tutorialId: { userId, tutorialId } },
      update: { isCompleted: true, completedAt: new Date() },
      create: { userId, tutorialId, isCompleted: true, completedAt: new Date() },
    });

    return NextResponse.json({ message: "Progress updated" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update progress" }, { status: 500 });
  }
}
