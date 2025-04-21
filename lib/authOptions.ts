import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

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
                    avatarUrl: user.avatarUrl,
                    role: user.role,
                    theme: user.profile ? user.profile.theme : null,
                };
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account }: { user: { email?: string; id?: string; name?: string; image?: string }; account: { provider?: string } }) {
            if (account?.provider === "google" || account?.provider === "github") {
                try {
                    const email = user.email || `${user.id}@${account.provider}.com`;

                    // Check if user exists
                    let existingUser = await prisma.user.findUnique({ where: { email } });

                    if (!existingUser) {
                        const baseUsername = user.name?.replace(/\s+/g, "").toLowerCase() || "user";
                        let username = baseUsername;
                        let counter = 1;

                        // Ensure unique username
                        while (await prisma.user.findUnique({ where: { username } })) {
                            username = `${baseUsername}${counter}`;
                            counter++;
                        }

                        existingUser = await prisma.user.create({
                            data: {
                                email,
                                username,
                                firstName: user.name?.split(" ")[0] || "User",
                                avatarUrl: user.image,
                                role: "USER",
                                emailVerified: true, // OAuth users are verified
                                profile: { create: { theme: "LIGHT" } },
                            },
                        });
                    }

                    return true;
                } catch (error) {
                    console.error("OAuth Sign-in Error:", error);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user }: { token: { id?: string; avatarUrl?: string; role?: string }; user?: { id: string; avatarUrl: string; role: string } }) {
            if (user) {
                token.id = user.id;
                token.avatarUrl = user.avatarUrl;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }: { session: { user?: { id?: string; image?: string; role?: string } }; token: { id?: string; avatarUrl?: string; role?: string } }) {
            if (session.user) {
                session.user.id = token.id?.toString();
                session.user.image = token.avatarUrl;
                session.user.role = token.role;
            }
            return session;
        },
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
