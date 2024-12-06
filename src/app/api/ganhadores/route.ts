import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/authOptions";
import { z } from "zod";
import { Role } from "../../../types/roles";

const ganhadoresQuerySchema = z.object({
    modalidade: z.string().min(1),
    loteria: z.string().min(1),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
});

interface WinnerBet {
    id: string;
    numbers: number[];
    modalidade: string;
    loteria: string;
    userId: string;
    userName: string;
    sorteioDate: string;
    premio: number;
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

    const url = new URL(request.url);
    const queryParams = {
        modalidade: url.searchParams.get("modalidade") || undefined,
        loteria: url.searchParams.get("loteria") || undefined,
        startDate: url.searchParams.get("startDate") || undefined,
        endDate: url.searchParams.get("endDate") || undefined,
    };

    const parsedQuery = ganhadoresQuerySchema.safeParse(queryParams);
    if (!parsedQuery.success) {
        return NextResponse.json({ error: parsedQuery.error.errors }, { status: 400 });
    }

    const { modalidade, loteria, startDate, endDate } = parsedQuery.data;

    try {
        const whereClause: any = { modalidade, loteria };

        if (startDate || endDate) {
            whereClause.createdAt = {};
            if (startDate) {
                whereClause.createdAt.gte = new Date(startDate);
            }
            if (endDate) {
                whereClause.createdAt.lte = new Date(endDate);
            }
        }

        const sorteios = await prisma.result.findMany({
            where: whereClause,
            orderBy: { createdAt: "desc" },
            take: 10,
        });

        if (sorteios.length === 0) {
            return NextResponse.json({ winners: [] }, { status: 200 });
        }

        const allBets = await prisma.bet.findMany({
            where: { modalidade, loteria },
            include: { user: { select: { name: true } } },
        });

        const winners: WinnerBet[] = [];

        sorteios.forEach((sorteio) => {
            const betsForLoteria = allBets.filter(
                (b) => b.modalidade === sorteio.modalidade && b.loteria === sorteio.loteria
            );

            const winningBets = betsForLoteria.filter((bet) =>
                sorteio.winningNumbers.every((num: number) => bet.numbers.includes(num))
            );

            const mappedWinners = winningBets.map((bet) => ({
                id: bet.id,
                numbers: bet.numbers,
                modalidade: bet.modalidade,
                loteria: bet.loteria,
                userId: bet.userId,
                userName: bet.user?.name || "Unknown",
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
