// src/types/next-auth.d.ts

import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            username: string;
            role: string | null;
            bancaName: string | null | undefined;
            adminId?: string | null;
            sellerId?: string | null;
            email: string | null | undefined;
            name: string | null | undefined;
        } & DefaultSession["user"];
    }

    interface User extends DefaultUser {
        id: string;
        username: string;
        role: string | null;
        bancaName: string | null | undefined;
        adminId?: string | null;
        sellerId?: string | null;
        email: string | null | undefined;
        name: string | null | undefined;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        username: string;
        role: string | null;
        bancaName: string | null | undefined;
        adminId?: string | null;
        sellerId?: string | null;
        email: string | null | undefined;
        name: string | null | undefined;
    }
}
