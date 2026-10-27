import { NextRequest } from "next/server";
import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

export const dynamic = "force-dynamic";

const nextAuth = NextAuth(authOptions);

function withoutGitHubIssuer(req: NextRequest) {
    const isGitHubCallback = req.nextUrl.pathname.endsWith("/callback/github");
    if (!isGitHubCallback || !req.nextUrl.searchParams.has("iss")) {
        return req;
    }

    const url = req.nextUrl.clone();
    url.searchParams.delete("iss");
    return new NextRequest(url, {
        method: req.method,
        headers: req.headers,
    });
}

async function handler(
    req: NextRequest,
    context: { params: Promise<{ nextauth: string[] }> }
) {
    return nextAuth(withoutGitHubIssuer(req), context);
}

export { handler as GET, handler as POST };
