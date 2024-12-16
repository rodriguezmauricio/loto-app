import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/authOptions";
import { Role } from "../../../types/roles";
import { Prisma } from "@prisma/client"; // Import Prisma types
import { parseISO } from "date-fns"; // for parsing YYYY-MM-DD string if needed

// Using Prisma's generated types for Bet and including the user relation
type BetWithUser = Prisma.BetGetPayload<{
    include: { user: true };
}>;

// Using Prisma's generated types for Result
type PrismaResult = Prisma.ResultGetPayload<{}>;

// Query schema for GET
const querySchema = z.object({
    modalidade: z.string().min(1),
    loteria: z.string().min(1),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
});

// POST body schema
const postSchema = z.object({
    modalidade: z.string().min(1),
    loteria: z.string().min(1),
    winningNumbers: z.string().min(1),
    resultDate: z.string().min(1),
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
    const sorteioDate = result.resultDate || result.createdAt;
    const sorteioDateStr = sorteioDate.toISOString().split("T")[0];

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

    const { modalidade, loteria, startDate, endDate } = parsedQuery.data;

    const dateFilters: any = {};
    if (startDate) dateFilters.gte = new Date(startDate);
    if (endDate) dateFilters.lte = new Date(endDate);

    const result = await prisma.result.findFirst({
        where: {
            modalidade,
            loteria,
            ...(startDate || endDate ? { resultDate: dateFilters } : {}),
        },
        orderBy: { resultDate: "desc" },
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
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = session.user.role as Role;
    if (userRole !== "admin" && userRole !== "vendedor") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const parsedBody = postSchema.safeParse(body);
    if (!parsedBody.success) {
        const errors = parsedBody.error.errors.map((err) => err.message);
        return NextResponse.json({ error: errors }, { status: 400 });
    }

    const { modalidade, loteria, winningNumbers, resultDate } = parsedBody.data;
    const numbersArray = winningNumbers
        .trim()
        .split(/\s+/)
        .map((num: string) => parseInt(num, 10))
        .filter((num: number) => !isNaN(num));

    if (numbersArray.length === 0) {
        return NextResponse.json(
            { error: "Please provide at least one valid winning number." },
            { status: 400 }
        );
    }

    const isValid = numbersArray.every((num) => Number.isInteger(num) && num > 0);
    if (!isValid) {
        return NextResponse.json(
            { error: "Please enter only valid numbers, separated by spaces." },
            { status: 400 }
        );
    }

    const parsedResultDate = parseISO(resultDate); // converts YYYY-MM-DD to Date
    if (isNaN(parsedResultDate.getTime())) {
        return NextResponse.json({ error: "Invalid resultDate." }, { status: 400 });
    }

    const newResult = await prisma.result.create({
        data: {
            modalidade,
            loteria,
            winningNumbers: numbersArray,
            createdBy: session.user.id,
            premio: 0,
            resultDate: parsedResultDate,
        },
    });

    let bets: BetWithUser[] = [];
    if (newResult.modalidade === "ERRE X") {
        bets = await prisma.bet.findMany({
            where: {
                modalidade: newResult.modalidade,
                loteria: newResult.loteria,
                NOT: { numbers: { hasSome: newResult.winningNumbers } },
            },
            include: { user: true },
            orderBy: { createdAt: "desc" },
        });
    } else {
        bets = await prisma.bet.findMany({
            where: {
                modalidade: newResult.modalidade,
                loteria: newResult.loteria,
                numbers: { hasEvery: newResult.winningNumbers },
            },
            include: { user: true },
            orderBy: { createdAt: "desc" },
        });
    }

    let filteredBets: BetWithUser[] = [];
    const userId = session.user.id as string;

    if (userRole === "admin") {
        const sellers = await prisma.user.findMany({
            where: { admin_id: userId, role: "vendedor" },
            select: { id: true },
        });
        const sellerIds = sellers.map((s) => s.id);

        filteredBets = bets.filter((bet) => {
            const u = bet.user;
            if (u.role !== "usuario") return false;
            const directByAdmin = u.admin_id === userId;
            const createdByAdminViaSeller = u.seller_id && sellerIds.includes(u.seller_id);
            return directByAdmin || createdByAdminViaSeller;
        });
    } else if (userRole === "vendedor") {
        filteredBets = bets.filter((bet) => {
            const u = bet.user;
            if (u.role !== "usuario") return false;
            return u.seller_id === userId;
        });
    } else {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (filteredBets.length === 0) {
        return NextResponse.json({ winners: [] }, { status: 201 });
    }

    const winners = formatWinners(filteredBets, newResult);
    return NextResponse.json({ winners }, { status: 201 });
}
