import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/authOptions";
import { Role } from "../../../types/roles";

const querySchema = z.object({
    modalidade: z.string().min(1),
    loteria: z.string().min(1),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
});

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

    const actualModalidade = loteria;
    const actualLoteria = modalidade;

    try {
        // Fetch the LATEST result for the given modalidade/loteria (like first snippet)
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

        let bets: any[] = [];

        if (result.modalidade === "ERRE X") {
            bets = await prisma.bet.findMany({
                where: {
                    modalidade,
                    loteria,
                    NOT: {
                        numbers: {
                            hasSome: winningNumbers,
                        },
                    },
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                            name: true,
                            role: true,
                            admin_id: true,
                            seller_id: true,
                        },
                    },
                },
            });
        } else {
            bets = await prisma.bet.findMany({
                where: betWhere,
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                            name: true,
                            role: true,
                            admin_id: true,
                            seller_id: true,
                        },
                    },
                },
            });
        }

        // Role-based filtering (from second snippet):
        if (userRole === "admin") {
            const adminId = session.user.id;
            const sellers = await prisma.user.findMany({
                where: { admin_id: adminId, role: "vendedor" },
                select: { id: true },
            });
            const sellerIds = sellers.map((s) => s.id);

            // Filter bets for apostadores linked to this admin
            const filteredBets = bets.filter((bet) => {
                const u = bet.user;
                if (u.role !== "usuario") return false;
                const directByAdmin = u.admin_id === adminId;
                const createdByAdminViaSeller = u.seller_id && sellerIds.includes(u.seller_id);
                return directByAdmin || createdByAdminViaSeller;
            });

            return formatWinners(filteredBets, result);
        } else if (userRole === "vendedor") {
            const vendedorId = session.user.id;
            const filteredBets = bets.filter((bet) => {
                const u = bet.user;
                if (u.role !== "usuario") return false;
                return u.seller_id === vendedorId;
            });

            return formatWinners(filteredBets, result);
        }

        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    } catch (error: any) {
        console.error("Error fetching ganhadores:", error);
        return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
    }
}

// Helper to format winners as in the first snippet, using bet.premio and single result
function formatWinners(bets: any[], result: any) {
    // The first snippet used bet.premio directly, so we keep that.
    const winners = bets.map((bet) => ({
        id: bet.id,
        numbers: bet.numbers,
        modalidade: bet.modalidade,
        loteria: bet.loteria,
        userId: bet.userId,
        userName: bet.user?.name ? bet.user.name : bet.user?.username || "Usuário Desconhecido",
        sorteioDate: result.createdAt.toISOString().split("T")[0],
        premio: bet.premio, // Using bet.premio as per first snippet logic
        betPlacedDate: bet.createdAt,
    }));

    return NextResponse.json({ winners }, { status: 200 });
}
