import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { JWT } from "next-auth/jwt";
import { Account, Session, User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";

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

                if (!user.emailVerified) {
                    throw new Error("Please verify your email before logging in.");
                }

                const passwordMatch = await bcrypt.compare(credentials.password, user.passwordHash!);

                if (!passwordMatch) {
                    throw new Error("Invalid credentials.");
                }

                return {
                    id: user.id.toString(),
                    email: user.email,
                    name: user.username,
                    image: user.profile?.avatar || undefined,
                    role: user.role,
                } as unknown as User;
            },
        }),
    ],
    callbacks: {
        /**
         * @param {object} sessionInfo
         * @param {User} sessionInfo.user
         * @param {Account} sessionInfo.account
         * @returns {Promise<boolean>}
         */
        async signIn({ user, account }: { user: User | AdapterUser; account: Account | null }): Promise<boolean> {
            if (!account) {
                return false;
            }
            if (account?.provider === "google" || account?.provider === "github") {
                const userEmail = user.email || `${user.id}@${account.provider}.com`;

                // Check if user exists
                let existingUser = await prisma.user.findUnique({ where: { email: userEmail } });

                if (!existingUser) {
                    const baseUsername = (user.name?.replace(/\s+/g, "").toLowerCase() || "user");
                    let username = baseUsername;
                    let counter = 1;

                    // Ensure unique username
                    while (await prisma.user.findUnique({ where: { username } })) {
                        username = `${baseUsername}${counter}`;
                        counter++;
                    }

                    existingUser = await prisma.user.create({
                        data: {
                            email: userEmail,
                            username,
                            firstName: user.name?.split(" ")[0] || "User",
                            role: "USER",
                            emailVerified: true,
                            profile: { create: { theme: "LIGHT", avatar: user.image } },
                        },
                    });
                }

                return true;
            }
            return true;
        },
        async jwt({ token, user }: { token: JWT; user: User | AdapterUser }) {
            if (user) {
                token.id = user.id;
                token.avatar = user.image;
                token.role = user.role;
            }
            return token;
        },
        async session({
            session,
            token,
        }: {
            session: Session;
            token: JWT;
        }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.image = token.avatarUrl as string;
                session.user.role = token.role as string;
            }
            return session;
        },
    },
    session: {
        strategy: "jwt" as const,
        maxAge: 60 * 60 * 24 * 7, // 7 days
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/auth/login",
        error: "/auth/error",
    },
};
