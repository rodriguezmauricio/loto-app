// next-auth.d.ts

import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
    interface User extends DefaultUser {
        id: string;
        username: string;
        adminId?: string;
        sellerId?: string;
        role: string;
    }

    interface Session {
        user: {
            id: string;
            username: string;
            adminId?: string | null;
            sellerId?: string | null;
            role: string;
            // Add any other custom fields you need
        } & DefaultSession["user"];
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role?: string | null;
    }
}
