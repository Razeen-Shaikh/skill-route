import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000;

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing email or password");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                    include: { profile: true },
                });

                if (!user) {
                    throw new Error("User not found");
                }

                // Check if the account is locked
                if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
                    const remainingTime = Math.ceil((new Date(user.lockedUntil).getTime() - new Date().getTime()) / 60000);
                    throw new Error(`Too many failed attempts. Try again in ${remainingTime} minutes.`);
                }

                // Check if the email is verified
                if (!user.emailVerified) {
                    throw new Error("Please verify your email before logging in.");
                }

                const passwordMatch = await bcrypt.compare(credentials.password, user.passwordHash);

                if (!passwordMatch) {
                    await prisma.user.update({
                        where: { id: user.id },
                        data: {
                            failedAttempts: user.failedAttempts + 1,
                            lockedUntil: user.failedAttempts + 1 >= MAX_ATTEMPTS ? new Date(Date.now() + LOCKOUT_DURATION) : null,
                        },
                    });

                    throw new Error(`Invalid credentials. ${MAX_ATTEMPTS - (user.failedAttempts + 1)} attempts left.`);
                }

                // Reset failed attempts after successful login
                await prisma.user.update({
                    where: { id: user.id },
                    data: { failedAttempts: 0, lockedUntil: null },
                });

                return {
                    id: user.id.toString(),
                    email: user.email,
                    name: user.username,
                    avatarUrl: user.avatarUrl,
                    role: user.role,
                    theme: user.profile ? user.profile.theme : null,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }: { token: Record<string, unknown>; user?: { id: string; avatarUrl: string; role: string } }) {
            if (user) {
                return {
                    ...token,
                    id: user.id,
                    avatarUrl: user.avatarUrl,
                    role: user.role,
                };
            }
            return token;
        },
        async session({ session, token }: { session: import("next-auth").Session; token: { id: string; avatarUrl: string; role: string } }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.image = token.avatarUrl;
                session.user.role = token.role;
            }
            return session;
        }
    },
    session: {
        strategy: "jwt",
        maxAge: 60 * 60 * 24 * 7, // 7 days
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/auth/login",
        error: "/auth/error",
    },
};
