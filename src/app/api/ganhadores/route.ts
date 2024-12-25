// src/pages/api/ganhadores/route.ts

import { NextResponse, NextRequest } from "next/server";
import prisma from "../../../../prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/authOptions";
import { Role } from "../../../types/roles";
import { Prisma } from "@prisma/client";
import { z } from "zod";
// date-fns to help with day boundaries
import { startOfDay, endOfDay } from "date-fns";

/**
 * BetWithUser includes `user` and optionally `vendedor`.
 * Make sure your schema has the correct relation names.
 */
type BetWithUser = Prisma.BetGetPayload<{ include: { user: true; vendedor: true } }>;
type PrismaResult = Prisma.ResultGetPayload<{}>;

const querySchema = z.object({
    modalidade: z.string().min(1),
    loteria: z.string().min(1),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
});

/**
 * Convert the found bets + a single `Result` record into final shape
 * for the client.  We display `bet.resultado` as the “bet placed date,”
 * but that can be changed if you prefer `bet.createdAt`.
 */
function formatWinners(bets: BetWithUser[], result: PrismaResult) {
    // If resultDate is null, fallback to createdAt
    const resultDate = result.resultDate ?? result.createdAt;
    // Convert to string once
    const sorteioDateStr = resultDate.toISOString().split("T")[0];

    return bets.map((bet) => {
        const betPlacedDateObj = bet.resultado ?? bet.createdAt;
        return {
            id: bet.id,
            numbers: bet.numbers,
            modalidade: bet.modalidade,
            loteria: bet.loteria ?? "Default Loteria",
            userId: bet.userId,
            userName: bet.user?.name || bet.user?.username || "Desconhecido",
            // We'll pass the final date string to the client
            sorteioDate: sorteioDateStr,
            premio: bet.premio,
            // We'll show `bet.resultado` as the “bet placed date/time”:
            betPlacedDate: bet.createdAt.toISOString(),
        };
    });
}

export async function GET(request: NextRequest) {
    // 1) Validate session and role
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userRole = session.user.role as Role;
    if (userRole !== "admin" && userRole !== "vendedor") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        // 2) Parse and validate query
        const url = new URL(request.url);
        const query = Object.fromEntries(url.searchParams.entries());
        const parsed = querySchema.safeParse(query);
        if (!parsed.success) {
            const errors = parsed.error.errors.map((e) => e.message);
            return NextResponse.json({ error: errors }, { status: 400 });
        }
        const { modalidade, loteria, startDate, endDate } = parsed.data;

        // 3) Build date range for `Result.resultDate`
        const resultDateRange: Prisma.DateTimeFilter = {};
        if (startDate) {
            const sd = new Date(startDate);
            if (!isNaN(sd.getTime())) {
                resultDateRange.gte = sd;
            }
        }
        if (endDate) {
            const ed = new Date(endDate);
            if (!isNaN(ed.getTime())) {
                resultDateRange.lte = ed;
            }
        }

        // 4) Find all results in that date range + matching modalidade, loteria
        const manyResults = await prisma.result.findMany({
            where: {
                modalidade,
                loteria,
                ...(Object.keys(resultDateRange).length ? { resultDate: resultDateRange } : {}),
            },
            orderBy: { resultDate: "desc" },
        });

        if (manyResults.length === 0) {
            return NextResponse.json(
                {
                    error: `Nenhum resultado encontrado para modalidade='${modalidade}', loteria='${loteria}' no período [${
                        startDate || "-∞"
                    }, ${endDate || "+∞"}].`,
                },
                { status: 404 }
            );
        }

        /**
         * We'll store pairs of (bet, result) so we can
         * map them all to final winners array at the end.
         */
        type BetResultPair = { bet: BetWithUser; result: PrismaResult };
        const betResultPairs: BetResultPair[] = [];

        // 5) For each foundResult, find matching bets:
        //    - same day for `bet.resultado` as `result.resultDate`
        //    - if ERRE X => bet can't have winningNumbers
        //    - else => bet must have them
        //    - no filter on `bet.createdAt`
        //    - role-based filtering
        for (const foundResult of manyResults) {
            const winningNumbers = foundResult.winningNumbers;

            // We'll do day boundaries for `bet.resultado`.
            const dayStart = startOfDay(foundResult.resultDate);
            const dayEnd = endOfDay(foundResult.resultDate);

            let candidateWhere: Prisma.BetWhereInput;

            if (foundResult.modalidade.toUpperCase().includes("ERRE X")) {
                candidateWhere = {
                    modalidade: foundResult.modalidade,
                    loteria: foundResult.loteria,
                    NOT: { numbers: { hasSome: winningNumbers } },
                    resultado: {
                        gte: dayStart,
                        lte: dayEnd,
                    },
                };
            } else {
                // standard
                candidateWhere = {
                    modalidade: foundResult.modalidade,
                    loteria: foundResult.loteria,
                    numbers: { hasEvery: winningNumbers },
                    resultado: {
                        gte: dayStart,
                        lte: dayEnd,
                    },
                };
            }

            const candidateBets = await prisma.bet.findMany({
                where: candidateWhere,
                include: { user: true, vendedor: true },
                orderBy: { createdAt: "desc" },
            });

            // role-based filtering
            let filtered: BetWithUser[] = [];
            if (userRole === "admin") {
                const adminId = session.user.id;
                const sellers = await prisma.user.findMany({
                    where: { admin_id: adminId, role: "vendedor" },
                    select: { id: true },
                });
                const sellerIds = sellers.map((s) => s.id);

                filtered = candidateBets.filter((b) => {
                    const u = b.user;
                    if (u.role !== "usuario") return false;
                    const directByAdmin = u.admin_id === adminId;
                    const viaSeller = u.seller_id && sellerIds.includes(u.seller_id);
                    return directByAdmin || viaSeller;
                });
            } else {
                // userRole === 'vendedor'
                const vendedorId = session.user.id;
                filtered = candidateBets.filter((b) => {
                    const u = b.user;
                    if (u.role !== "usuario") return false;
                    return u.seller_id === vendedorId;
                });
            }

            // store the pairs
            for (const bet of filtered) {
                betResultPairs.push({ bet, result: foundResult });
            }
        }

        if (betResultPairs.length === 0) {
            return NextResponse.json({ winners: [] }, { status: 200 });
        }

        // 6) Format final output
        const winners = betResultPairs.flatMap(({ bet, result }) => {
            return formatWinners([bet], result);
        });

        return NextResponse.json({ winners }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching ganhadores:", error);
        return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
    }
}
