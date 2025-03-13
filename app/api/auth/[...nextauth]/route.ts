import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { compare } from "bcryptjs";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "example@example.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing email or password");
                }

                const user = await prisma.user.findUnique({ where: { email: credentials.email } });

                if (!user) {
                    throw new Error("No user found");
                }

                const passwordMatch = await compare(credentials.password, user.password);
                if (!passwordMatch) {
                    throw new Error("Incorrect password");
                }

                return { id: user.id, name: user.name, email: user.email };
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async session({ session, user, token }) {
            if (token) {
                session.user.id = token.id; // Ensure `id` is set
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id; // Ensure `id` is included in token
            }
            return token;
        },
    },
    session: {
        strategy: "jwt",
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
