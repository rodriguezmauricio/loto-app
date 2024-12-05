// app/api/ganhadores/route.ts

import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/authOptions";
import { z } from "zod";
import { Role } from "../../../types/roles";

// Define the query schema using Zod
const ganhadoresQuerySchema = z.object({
    modalidade: z.string().optional(),
    startDate: z.string().optional(), // ISO date string
    endDate: z.string().optional(), // ISO date string
});

// Define the response schema for winners
interface WinnerBet {
    id: string;
    numbers: number[];
    modalidade: string;
    userId: string;
    userName: string;
    sorteioDate: string;
    premio: number;
}

export async function GET(request: Request) {
    // Authenticate the user
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = session.user.role as Role;

    // Only allow admin and vendedor roles
    if (userRole !== "admin" && userRole !== "vendedor") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Parse query parameters
    const url = new URL(request.url);
    const queryParams = {
        modalidade: url.searchParams.get("modalidade") || undefined,
        startDate: url.searchParams.get("startDate") || undefined,
        endDate: url.searchParams.get("endDate") || undefined,
    };

    // Validate query parameters
    const parsedQuery = ganhadoresQuerySchema.safeParse(queryParams);
    if (!parsedQuery.success) {
        return NextResponse.json({ error: parsedQuery.error.errors }, { status: 400 });
    }

    const { modalidade, startDate, endDate } = parsedQuery.data;

    try {
        // Build the where clause based on filters
        const whereClause: any = {};

        if (modalidade) {
            whereClause.modalidade = modalidade;
        }

        if (startDate || endDate) {
            whereClause.createdAt = {};
            if (startDate) {
                whereClause.createdAt.gte = new Date(startDate);
            }
            if (endDate) {
                whereClause.createdAt.lte = new Date(endDate);
            }
        }

        // Fetch the latest sorteios based on filters
        const sorteios = await prisma.result.findMany({
            where: whereClause,
            orderBy: { createdAt: "desc" },
            take: 10, // Adjust the number as needed for "latest sorteios"
        });

        if (sorteios.length === 0) {
            return NextResponse.json({ winners: [] }, { status: 200 });
        }

        // Extract modalidades from sorteios
        const modalidades = sorteios.map((sorteio) => sorteio.modalidade);

        // Fetch all bets related to these modalidades, including user names
        const bets = await prisma.bet.findMany({
            where: { modalidade: { in: modalidades } },
            select: {
                id: true,
                numbers: true,
                modalidade: true,
                userId: true,
                user: { select: { username: true } }, // Fetch user's name
            },
        });

        // Determine winners
        const winners: WinnerBet[] = [];

        sorteios.forEach((sorteio) => {
            // Find bets corresponding to the sorteio's modalidade
            const betsForModalidade = bets.filter((bet) => bet.modalidade === sorteio.modalidade);

            // Determine winning bets: all winning numbers are in the bet's numbers
            const winningBets = betsForModalidade.filter((bet) =>
                sorteio.winningNumbers.every((num) => bet.numbers.includes(num))
            );

            // Map winners with additional details
            const mappedWinners = winningBets.map((bet) => ({
                id: bet.id,
                numbers: bet.numbers,
                modalidade: bet.modalidade,
                userId: bet.userId,
                userName: bet.user?.username || "Unknown",
                sorteioDate: sorteio.createdAt.toISOString().split("T")[0],
                premio: sorteio.premio || 0,
            }));

            winners.push(...mappedWinners);
        });

        return NextResponse.json({ winners }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching winners:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
