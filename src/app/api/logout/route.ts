// app/api/logout/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const response = NextResponse.json({ message: "Logged out" });
    response.cookies.set("token", "", { maxAge: -1 });
    return response;
}
