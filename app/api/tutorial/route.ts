import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { enrichTutorialForUser } from "@/lib/tutorialProgress";
import { findTutorialByIdentifier } from "@/lib/resolveTutorial";

export async function GET(req: NextRequest) {
    try {
        const tutorialParam = req.nextUrl.searchParams.get("tutorialId");

        if (!tutorialParam) {
            return NextResponse.json({ error: "tutorialId is required" }, { status: 400 });
        }

        const user = await getAuthUser();
        const tutorial = await findTutorialByIdentifier(tutorialParam);

        if (!tutorial) {
            return NextResponse.json({ error: "Tutorial not found." }, { status: 404 });
        }

        const enrichedTutorial = await enrichTutorialForUser(user?.id, tutorial);

        return NextResponse.json(enrichedTutorial);
    } catch (error) {
        console.error("Error fetching tutorial:", error);
        return NextResponse.json(
            { error: "An error occurred while fetching the tutorial." },
            { status: 500 }
        );
    }
}
