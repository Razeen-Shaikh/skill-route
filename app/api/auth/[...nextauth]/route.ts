import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

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

                return { id: user.id.toString(), email: user.email, name: user.username };
            },
        }),
    ],
    callbacks: {
        async session({ session, token }: { session: any, token: any }) {
            if (token) {
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
