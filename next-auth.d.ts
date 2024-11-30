// types/next-auth.d.ts

import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
    interface User extends DefaultUser {
        id: string;
        username: string;
        adminId?: string;
        sellerId?: string;
        bancaName?: string | null; // Allow 'null' and 'undefined'
        role: string | null; // Allow 'null' for role
    }

    interface Session {
        user: {
            id: string;
            username: string;
            adminId?: string | null;
            sellerId?: string | null;
            bancaName?: string | null;
            role: string | null; // Allow 'null' for role
        } & DefaultSession["user"];
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role?: string | null;
        username?: string;
        bancaName?: string | null;
    }
}
