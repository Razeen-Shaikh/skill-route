import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function authMiddleware(req: NextRequest) {
    const token = req.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET!);
        return NextResponse.next();
    } catch {
        return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }
}