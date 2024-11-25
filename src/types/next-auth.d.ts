// src/types/next-auth.d.ts

import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            username: string;
            role: string; // Override role type
        } & DefaultSession["user"];
    }

    interface User {
        id: string;
        username: string;
        role: string;
        // Add other fields if necessary
    }

    interface JWT {
        id: string;
        role: string;
    }
}
