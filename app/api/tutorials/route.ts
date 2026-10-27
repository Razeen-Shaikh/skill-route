import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { listTutorialsForUser } from "@/lib/tutorialProgress";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");
        const user = await getAuthUser();
        const tutorials = await listTutorialsForUser(user?.id, category);

        return NextResponse.json(tutorials);
    } catch (error) {
        console.error("Error fetching tutorials:", error);
        return NextResponse.json(
            { error: "An error occurred while fetching tutorials." },
            { status: 500 }
        );
    }
}
