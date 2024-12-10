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

    // Swap modalidade and loteria if needed
    const actualModalidade = loteria;
    const actualLoteria = modalidade;

    try {
        // Fetch the latest result for the given modalidade/loteria
        const result = await prisma.result.findFirst({
            where: { modalidade: actualModalidade, loteria: actualLoteria },
            orderBy: { createdAt: "desc" },
        });

        if (!result) {
            return NextResponse.json(
                {
                    error: `Nenhum resultado encontrado para modalidade '${actualModalidade}' e loteria '${actualLoteria}'.`,
                },
                { status: 404 }
            );
        }

        // Check if result.createdAt falls within the selected date range
        const resultDate = result.createdAt;
        if (startDate) {
            const start = new Date(startDate);
            if (resultDate < start) {
                // result date is before the start date
                return NextResponse.json({ winners: [] }, { status: 200 });
            }
        }

        if (endDate) {
            const end = new Date(endDate);
            if (resultDate > end) {
                // result date is after the end date
                return NextResponse.json({ winners: [] }, { status: 200 });
            }
        } else if (startDate && !endDate) {
            // If only startDate is provided, consider up to the current date
            const now = new Date();
            const start = new Date(startDate);
            if (resultDate > now || resultDate < start) {
                return NextResponse.json({ winners: [] }, { status: 200 });
            }
        }

        const winningNumbers = result.winningNumbers
            .split(",")
            .map((num: string) => parseInt(num.trim(), 10));

        // Assuming `numbers` is stored as an array of numbers in the database
        // If stored as a string, you might need to adjust the query accordingly

        const bets = await prisma.bet.findMany({
            where: {
                modalidade: actualModalidade,
                loteria: actualLoteria,
                numbers: {
                    hasEvery: winningNumbers,
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

        let filteredBets: any[] = [];

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

        return formatWinners(filteredBets, result);
    } catch (error: any) {
        console.error("Error fetching ganhadores:", error);
        return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
    }
}

function formatWinners(bets: any[], result: any) {
    const sorteioDateStr = result.createdAt.toISOString().split("T")[0];

    const winners = bets.map((bet) => ({
        id: bet.id,
        numbers: bet.numbers.split(",").map((num: string) => parseInt(num.trim(), 10)),
        modalidade: bet.modalidade,
        loteria: bet.loteria,
        userId: bet.userId,
        userName: bet.user?.name ? bet.user.name : bet.user?.username || "Usuário Desconhecido",
        sorteioDate: sorteioDateStr, // Using result.createdAt as the displayed date
        premio: bet.premio,
        betPlacedDate: bet.createdAt, // Include the bet placement date
    }));

    return NextResponse.json({ winners }, { status: 200 });
}
