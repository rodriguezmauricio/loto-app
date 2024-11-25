// app/api/auth/[...nextauth]/route.ts

import NextAuth, { NextAuthOptions, Session, User as NextAuthUser } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

// Temporary log to verify the secret
console.log("NEXTAUTH_SECRET:", process.env.NEXTAUTH_SECRET);
