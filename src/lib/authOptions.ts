// src/lib/authOptions.ts

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../prisma/client";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
    // Removed PrismaAdapter to ensure compatibility with JWT strategy
    // adapter: PrismaAdapter(prisma), // Remove this line
    adapter: PrismaAdapter(prisma),
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
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: { username: credentials.username },
                });

                if (!user) {
                    throw new Error("No user found with the given username");
                    return null;
                }

                const isValidPassword = await bcrypt.compare(
                    credentials.password,
                    user.password_hash
                );

                if (!isValidPassword) {
                    throw new Error("Invalid password");
                    return null;
                }

                return {
                    id: user.id,
                    username: user.username,
                    role: user.role,
                };
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (session.user && token) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                session.user.username = token.username as string;
            }
            return session;
        },
        async jwt({ token, user, account, profile, isNewUser }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.username = user.username;
            }
            return token;
        },
    },
    session: {
        strategy: "jwt", // Ensure this is set to 'jwt'
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET, // Ensure this is set in your .env file
};
