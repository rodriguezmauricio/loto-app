import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
import { z } from "zod";

const querySchema = z.object({
    modalidade: z.string().min(1),
    loteria: z.string().min(1),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
});

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());

    const parsedQuery = querySchema.safeParse(query);
    if (!parsedQuery.success) {
        const errors = parsedQuery.error.errors.map((err) => err.message);
        return NextResponse.json({ error: errors }, { status: 400 });
    }

    const { modalidade, loteria, startDate, endDate } = parsedQuery.data;

    try {
        // Fetch the latest result for the given modalidade/loteria
        const result = await prisma.result.findFirst({
            where: { modalidade, loteria },
            orderBy: { createdAt: "desc" },
        });

        if (!result) {
            return NextResponse.json(
                { error: "Nenhum resultado encontrado para os filtros fornecidos." },
                { status: 404 }
            );
        }

        const winningNumbers = result.winningNumbers;

        // Build conditions for bets that must include all winning numbers
        const andConditions = winningNumbers.map((num) => ({
            numbers: { has: num },
        }));

        const betWhere: any = {
            modalidade,
            loteria,
            AND: andConditions,
        };

        if (startDate && endDate) {
            betWhere.createdAt = {
                gte: new Date(startDate),
                lte: new Date(endDate),
            };
        }

        const bets = await prisma.bet.findMany({
            where: betWhere,
            include: {
                user: {
                    select: { username: true },
                },
            },
        });

        const winners = bets.map((bet) => ({
            id: bet.id,
            numbers: bet.numbers,
            modalidade: bet.modalidade,
            loteria: bet.loteria,
            userId: bet.userId,
            userName: bet.user?.username || "Usuário Desconhecido",
            sorteioDate: result.createdAt.toISOString().split("T")[0],
            premio: bet.premio,
        }));

        return NextResponse.json({ winners }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching ganhadores:", error);
        return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
    }
}
