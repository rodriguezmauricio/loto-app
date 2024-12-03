// src/lib/authOptions.ts

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "../../prisma/client";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "username" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    throw new Error("Missing username or password");
                }

                const user = await prisma.user.findUnique({
                    where: { username: credentials.username },
                });

                if (!user) {
                    throw new Error("No user found with the given username");
                }

                const isValidPassword = await bcrypt.compare(
                    credentials.password,
                    user.password_hash
                );

                if (!isValidPassword) {
                    throw new Error("Invalid password");
                }

                return {
                    id: user.id,
                    username: user.username,
                    bancaName: user.bancaName,
                    role: user.role,
                    name: user.name || null,
                    email: user.email || null,
                    image: user.image || null,
                };
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (session.user && token) {
                // Type assertion to extend the session user
                (session.user as any).id = token.id as string;
                (session.user as any).role = token.role as string;
                (session.user as any).username = token.username as string;
                (session.user as any).bancaName = token.bancaName as string;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.username = user.username;
                token.bancaName = user.bancaName;
            }
            return token;
        },
    },
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET, // Ensure this is set in your .env file
};
