import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const themes = await prisma.theme.findMany();
    return NextResponse.json(themes);
}
