// app/api/results/route.ts

import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/authOptions";
import { Role } from "../../../types/roles";
import { Bet, Result, Winner } from "../../../types/roles"; // Adjust the path as necessary

const querySchema = z.object({
    modalidade: z.string().min(1),
    loteria: z.string().min(1),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
});

export async function GET(request: Request) {
    console.log("Results API route accessed");

    const session = await getServerSession(authOptions);
    console.log("Session retrieved:", session);

    if (!session || !session.user) {
        console.log("Unauthorized access attempt");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = session.user.role as Role;
    console.log("User role:", userRole);

    if (userRole !== "admin" && userRole !== "vendedor") {
        console.log("Forbidden access for user role:", userRole);
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());
    console.log("Received query params:", query);

    const parsedQuery = querySchema.safeParse(query);
    if (!parsedQuery.success) {
        const errors = parsedQuery.error.errors.map((err) => err.message);
        console.log("Query parsing failed:", errors);
        return NextResponse.json({ error: errors }, { status: 400 });
    }

    const { modalidade, loteria, startDate, endDate } = parsedQuery.data;
    console.log("Parsed query data:", parsedQuery.data);

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
            console.log(
                `Nenhum resultado encontrado para modalidade '${actualModalidade}' e loteria '${actualLoteria}'.`
            );
            return NextResponse.json(
                {
                    error: `Nenhum resultado encontrado para modalidade '${actualModalidade}' e loteria '${actualLoteria}'.`,
                },
                { status: 404 }
            );
        }

        console.log("Fetched result:", result);

        // Check if result.createdAt falls within the selected date range
        const resultDate = result.createdAt;
        if (startDate) {
            const start = new Date(startDate);
            if (resultDate < start) {
                console.log("Result date is before the start date");
                return NextResponse.json({ winners: [] }, { status: 200 });
            }
        }

        if (endDate) {
            const end = new Date(endDate);
            if (resultDate > end) {
                console.log("Result date is after the end date");
                return NextResponse.json({ winners: [] }, { status: 200 });
            }
        } else if (startDate && !endDate) {
            // If only startDate is provided, consider up to the current date
            const now = new Date();
            const start = new Date(startDate);
            if (resultDate > now || resultDate < start) {
                console.log("Result date is outside the start and current date range");
                return NextResponse.json({ winners: [] }, { status: 200 });
            }
        }

        const winningNumbers = result.winningNumbers;
        console.log("Winning numbers:", winningNumbers);

        let bets: any[] = [];

        if (result.modalidade === "ERRE X") {
            // **"ERRE X" Logic:** Fetch bets where none of the bet numbers are in winningNumbers
            bets = await prisma.bet.findMany({
                where: {
                    modalidade: actualModalidade,
                    loteria: actualLoteria,
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
                orderBy: { createdAt: "desc" },
            });

            console.log(
                `Fetched ${bets.length} bets where none of the numbers are in the winning numbers for "ERRE X"`
            );
        } else {
            // **Standard Logic:** Fetch bets where all winningNumbers are present
            bets = await prisma.bet.findMany({
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
                orderBy: { createdAt: "desc" },
            });

            console.log(`Fetched ${bets.length} bets matching the winning numbers`);
        }

        console.log("Sample fetched bets:", bets.slice(0, 5));

        let filteredBets: Bet[] = [];

        if (userRole === "admin") {
            const adminId = session.user.id;
            const sellers = await prisma.user.findMany({
                where: { admin_id: adminId, role: "vendedor" },
                select: { id: true },
            });
            const sellerIds = sellers.map((s) => s.id);
            console.log("Seller IDs for admin:", sellerIds);

            filteredBets = bets.filter((bet) => {
                const u = bet.user;
                if (u.role !== "usuario") return false;
                const directByAdmin = u.admin_id === adminId;
                const createdByAdminViaSeller = u.seller_id && sellerIds.includes(u.seller_id);
                return directByAdmin || createdByAdminViaSeller;
            });
            console.log(`Filtered bets for admin: ${filteredBets.length}`);
        } else if (userRole === "vendedor") {
            const vendedorId = session.user.id;
            filteredBets = bets.filter((bet) => {
                const u = bet.user;
                if (u.role !== "usuario") return false;
                return u.seller_id === vendedorId;
            });
            console.log(`Filtered bets for vendedor: ${filteredBets.length}`);
        } else {
            console.log("Forbidden user role detected");
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        console.log("Filtered bets:", filteredBets);

        if (filteredBets.length === 0) {
            console.log("No winners found based on the current criteria.");
            return NextResponse.json({ winners: [] }, { status: 200 });
        }

        return formatWinners(filteredBets, result);
    } catch (error: any) {
        console.error("Error fetching results:", error);
        return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
    }
}

function formatWinners(bets: Bet[], result: Result) {
    console.log("Inside formatWinners");

    const sorteioDateStr = result.createdAt.toISOString().split("T")[0];
    console.log("sorteioDateStr:", sorteioDateStr);

    const winners: Winner[] = bets.map((bet) => ({
        id: bet.id,
        numbers: bet.numbers, // Directly assign the number array
        modalidade: bet.modalidade,
        loteria: bet.loteria,
        userId: bet.userId,
        userName: bet.user?.name ? bet.user.name : bet.user?.username || "Usuário Desconhecido",
        sorteioDate: sorteioDateStr, // Using result.createdAt as the displayed date
        premio: bet.premio,
        betPlacedDate: bet.createdAt.toISOString(), // Ensure it's a string in ISO format
    }));

    console.log("Formatted winners:", winners);

    return NextResponse.json({ winners }, { status: 200 });
}
