// src/pages/api/ganhadores/route.ts

import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/authOptions";
import { Role } from "../../../types/roles";
import { Prisma } from "@prisma/client"; // Import Prisma types

// Using Prisma's generated types for Bet and including the user relation
type BetWithUser = Prisma.BetGetPayload<{
    include: { user: true };
}>;

// Using Prisma's generated types for Result
type PrismaResult = Prisma.ResultGetPayload<{}>;

// Extended Query schema for GET with userName
const querySchema = z.object({
    modalidade: z.string().min(1),
    loteria: z.string().min(1),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    userName: z.string().min(1).optional(), // New filter
});

// POST body schema remains the same
const postSchema = z.object({
    modalidade: z.string().min(1),
    loteria: z.string().min(1),
    winningNumbers: z.string().min(1),
});

interface Winner {
    id: string;
    numbers: number[];
    modalidade: string;
    loteria: string;
    userId: string;
    userName: string;
    sorteioDate: string;
    premio: number;
    betPlacedDate: string;
}

function formatWinners(bets: BetWithUser[], result: PrismaResult): Winner[] {
    const sorteioDateStr = result.createdAt.toISOString().split("T")[0];

    return bets.map((bet) => ({
        id: bet.id,
        numbers: bet.numbers,
        modalidade: bet.modalidade,
        loteria: bet.loteria || "Default Loteria",
        userId: bet.userId,
        userName: bet.user.name ? bet.user.name : bet.user.username,
        sorteioDate: sorteioDateStr,
        premio: bet.premio,
        betPlacedDate: bet.createdAt.toISOString(),
    }));
}

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = session.user.role as Role;
    if (userRole !== "admin" && userRole !== "vendedor") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());
    const parsedQuery = querySchema.safeParse(query);
    if (!parsedQuery.success) {
        const errors = parsedQuery.error.errors.map((err) => err.message);
        return NextResponse.json({ error: errors }, { status: 400 });
    }

    const { modalidade, loteria, startDate, endDate, userName } = parsedQuery.data;

    const dateFilters: any = {};
    if (startDate) dateFilters.gte = new Date(startDate);
    if (endDate) dateFilters.lte = new Date(endDate);

    // Build additional filters
    const additionalFilters: any = {};
    if (userName) {
        additionalFilters.user = {
            OR: [
                { name: { contains: userName, mode: "insensitive" } },
                { username: { contains: userName, mode: "insensitive" } },
            ],
        };
    }

    const result = await prisma.result.findFirst({
        where: {
            modalidade,
            loteria,
            ...(startDate || endDate ? { createdAt: dateFilters } : {}),
        },
        orderBy: { createdAt: "desc" },
    });

    if (!result) {
        return NextResponse.json(
            { error: `No result found for modalidade '${modalidade}' and loteria '${loteria}'.` },
            { status: 404 }
        );
    }

    let bets: BetWithUser[] = [];
    const winningNumbers = result.winningNumbers;

    if (result.modalidade === "ERRE X") {
        bets = await prisma.bet.findMany({
            where: {
                modalidade: result.modalidade,
                loteria: result.loteria,
                NOT: { numbers: { hasSome: winningNumbers } },
                ...additionalFilters, // Apply additional filters
            },
            include: { user: true },
            orderBy: { createdAt: "desc" },
        });
    } else {
        bets = await prisma.bet.findMany({
            where: {
                modalidade: result.modalidade,
                loteria: result.loteria,
                numbers: { hasEvery: winningNumbers },
                ...additionalFilters, // Apply additional filters
            },
            include: { user: true },
            orderBy: { createdAt: "desc" },
        });
    }

    let filteredBets: BetWithUser[] = [];
    if (userRole === "admin") {
        const adminId = session.user.id;
        const sellers = await prisma.user.findMany({
            where: { admin_id: adminId, role: "vendedor" },
            select: { id: true },
        });
        const sellerIds = sellers.map((s) => s.id);

        filteredBets = bets.filter((bet) => {
            const u = bet.user;
            if (u.role !== "usuario") return false;
            const directByAdmin = u.admin_id === adminId;
            const createdByAdminViaSeller = u.seller_id && sellerIds.includes(u.seller_id);
            return directByAdmin || createdByAdminViaSeller;
        });
    } else if (userRole === "vendedor") {
        const vendedorId = session.user.id;
        filteredBets = bets.filter((bet) => {
            const u = bet.user;
            if (u.role !== "usuario") return false;
            return u.seller_id === vendedorId;
        });
    } else {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (filteredBets.length === 0) {
        return NextResponse.json({ winners: [] }, { status: 200 });
    }

    const winners = formatWinners(filteredBets, result);
    return NextResponse.json({ winners }, { status: 200 });
}

export async function POST(request: Request) {
    // Existing POST handler remains the same
    // ...
}
