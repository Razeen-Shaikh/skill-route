import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

import { NextRequest } from 'next/server';

const AUTH_REQUIRED_PREFIXES = ['/dashboard', '/roadmaps', '/settings', '/badges'];

export async function middleware(req: NextRequest) {
    const token = await getToken({ req });
    const { pathname } = req.nextUrl;
    const isAdminRoute = pathname.startsWith('/admin');
    const isAuthRequired = AUTH_REQUIRED_PREFIXES.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    );

    if (isAdminRoute && (!token || token.role !== 'ADMIN')) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    if (isAuthRequired && !token) {
        const loginUrl = new URL('/auth/login', req.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/dashboard',
        '/dashboard/:path*',
        '/roadmaps',
        '/roadmaps/:path*',
        '/settings',
        '/settings/:path*',
        '/badges',
        '/badges/:path*',
    ],
};
