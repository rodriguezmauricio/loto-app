// types/next-auth.d.ts

import NextAuth from "next-auth";

declare module "next-auth" {
    interface User {
        id: string;
        username: string;
        role: string;
        // Add other custom fields here if necessary
    }

    interface Session {
        user: {
            id: string;
            username: string;
            role: string;
            // Include other custom fields if necessary
        } & DefaultSession["user"];
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        username: string;
        role: string;
        // Add other custom fields here if necessary
    }
}
