import NextAuth, { Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { JWT } from "next-auth/jwt";

const authOptions = {
    providers: [
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

                const passwordMatch = await bcrypt.compare(
                    credentials.password,
                    user.passwordHash
                );

                if (!passwordMatch) {
                    throw new Error("Invalid password");
                }

                return {
                    id: user.id.toString(),
                    email: user.email,
                    name: user.username,
                    avatarUrl: user.avatarUrl,
                    theme: user.profile ? user.profile.theme : null
                };
            },
        }),
    ],
    callbacks: {
        async session({ session, token }: { session: Session, token: JWT }) {
            if (token && session.user) {
                session.user.id = token.sub;
            }

            return session;
        },
    },
    session: {
        strategy: "jwt" as const,
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/auth/login",
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
