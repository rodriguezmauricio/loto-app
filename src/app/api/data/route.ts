// src/app/api/data/route.ts
import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/authOptions";

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Fetch all necessary data: bets, results, users, etc.
        const [bets, results, users] = await Promise.all([
            prisma.bet.findMany({ include: { user: true } }),
            prisma.result.findMany(),
            prisma.user.findMany({}),
        ]);

        return NextResponse.json({ bets, results, users }, { status: 200 });
    } catch (error) {
        console.error("Error fetching data:", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
