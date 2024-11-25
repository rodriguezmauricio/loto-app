// middleware.ts

import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;

    if (!token) {
        // Redirect to login page if not authenticated
        return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
        jwt.verify(token, JWT_SECRET);
        // Token is valid, proceed to the requested page
        return NextResponse.next();
    } catch (error) {
        // Invalid token
        return NextResponse.redirect(new URL("/login", request.url));
    }
}

// Define protected routes
export const config = {
    matcher: ["/dashboard/:path*", "/another-protected-route/:path*"],
};
