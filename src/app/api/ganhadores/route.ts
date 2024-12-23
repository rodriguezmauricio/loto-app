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

type BetWithUser = Prisma.BetGetPayload<{ include: { user: true; vendedor: true } }>;
type PrismaResult = Prisma.ResultGetPayload<{}>;

const querySchema = z.object({
    modalidade: z.string().min(1),
    loteria: z.string().min(1),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
});

/**
 * Convert each filtered Bet to the final shape you want
 */
function formatWinners(bets: BetWithUser[], result: PrismaResult) {
    // We'll rely on `result.resultDate` if present, else fallback to `result.createdAt`.
    const resultDateToUse = result.resultDate ?? result.createdAt;
    const sorteioDateStr = resultDateToUse.toISOString().split("T")[0];

    return bets.map((bet) => ({
        id: bet.id,
        numbers: bet.numbers,
        modalidade: bet.modalidade,
        loteria: bet.loteria ?? "Default Loteria",
        userId: bet.userId,
        userName: bet.user?.name || bet.user?.username || "Desconhecido",
        sorteioDate: sorteioDateStr, // i.e. the day from `result.resultDate`
        premio: bet.premio,
        betPlacedDate: bet.resultado ? bet.resultado.toISOString() : bet.createdAt.toISOString(),
    }));
}

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userRole = session.user.role as Role;
    if (userRole !== "admin" && userRole !== "vendedor") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        // 1. Parse and validate query params
        const url = new URL(request.url);
        const query = Object.fromEntries(url.searchParams.entries());
        const parsed = querySchema.safeParse(query);
        if (!parsed.success) {
            const errors = parsed.error.errors.map((e) => e.message);
            return NextResponse.json({ error: errors }, { status: 400 });
        }

        const { modalidade, loteria, startDate, endDate } = parsed.data;

        // 2. Build date range for `Result.resultDate` if provided
        const resultDateRange: any = {};
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

        // 3. Find **all** results in [startDate, endDate], matching modalidade & loteria
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

        // 4. For each found result, gather the matching bets
        //    Then combine everything in an array
        let allFilteredBets: BetWithUser[] = [];

        for (const foundResult of manyResults) {
            const winningNumbers = foundResult.winningNumbers;

            // We'll gather bets whose `bet.resultado` is the *same day* as foundResult.resultDate
            const dayStart = startOfDay(foundResult.resultDate);
            const dayEnd = endOfDay(foundResult.resultDate);

            let candidateBets: BetWithUser[] = [];
            if (foundResult.modalidade.toUpperCase().includes("ERRE X")) {
                // "ERRE X" => bet cannot contain ANY winningNumbers
                candidateBets = await prisma.bet.findMany({
                    where: {
                        modalidade: foundResult.modalidade,
                        loteria: foundResult.loteria,
                        NOT: { numbers: { hasSome: winningNumbers } },
                        resultado: {
                            gte: dayStart,
                            lte: dayEnd,
                        },
                    },
                    include: { user: true, vendedor: true },
                    orderBy: { createdAt: "desc" },
                });
            } else {
                // Standard => bet.numbers must contain ALL winningNumbers
                candidateBets = await prisma.bet.findMany({
                    where: {
                        modalidade: foundResult.modalidade,
                        loteria: foundResult.loteria,
                        numbers: { hasEvery: winningNumbers },
                        resultado: {
                            gte: dayStart,
                            lte: dayEnd,
                        },
                    },
                    include: { user: true, vendedor: true },
                    orderBy: { createdAt: "desc" },
                });
            }

            // 5. Role-based filtering for these candidate bets
            let filteredBets: BetWithUser[] = [];
            if (userRole === "admin") {
                const adminId = session.user.id;
                // Grab all sellers that belong to the current Admin
                const sellers = await prisma.user.findMany({
                    where: { admin_id: adminId, role: "vendedor" },
                    select: { id: true },
                });
                const sellerIds = sellers.map((s) => s.id);

                filteredBets = candidateBets.filter((b) => {
                    const u = b.user;
                    if (u.role !== "usuario") return false;
                    const directByAdmin = u.admin_id === adminId;
                    const viaSeller = u.seller_id && sellerIds.includes(u.seller_id);
                    return directByAdmin || viaSeller;
                });
            } else if (userRole === "vendedor") {
                const vendedorId = session.user.id;
                filteredBets = candidateBets.filter((b) => {
                    const u = b.user;
                    if (u.role !== "usuario") return false;
                    return u.seller_id === vendedorId;
                });
            }

            // Combine them
            allFilteredBets.push(...filteredBets);
        }

        // 6. If no bets found overall, return empty
        if (allFilteredBets.length === 0) {
            return NextResponse.json({ winners: [] }, { status: 200 });
        }

        // 7. Build final output
        //    We have multiple results. We also want to keep track of "which result" each bet matched.
        //    Because you want a single array, let's produce them all.
        //    We'll just do "formatWinners" for each result, as we loop above? Or we can do it now:
        //    BUT to know which result the bet matched, we might need more logic (like a map).
        //    For simplicity, let's keep the code short: we already have "foundResult" above,
        //    but we had multiple results. We must do "formatWinners" inside the loop if you want them separate.
        //    If you want them combined, we can store a map: resultId -> foundResult
        //    We'll do a simpler approach: store them as an array of (bet, result)

        // Instead, let's store pairs: { bet, result } in an array
        // so we can do a single "formatWinners" pass at the end.
        // We'll keep track of them with a small changes:

        // We'll need an intermediate array
        type BetResultPair = { bet: BetWithUser; result: PrismaResult };
        const betResultPairs: BetResultPair[] = [];

        // We re-do the loop, but store pairs
        allFilteredBets = []; // reset to fill again with a stable approach

        for (const foundResult of manyResults) {
            // For each result, do the same find:
            const dayStart = startOfDay(foundResult.resultDate);
            const dayEnd = endOfDay(foundResult.resultDate);
            const winningNumbers = foundResult.winningNumbers;

            let candidateBets: BetWithUser[] = [];
            if (foundResult.modalidade.toUpperCase().includes("ERRE X")) {
                candidateBets = await prisma.bet.findMany({
                    where: {
                        modalidade: foundResult.modalidade,
                        loteria: foundResult.loteria,
                        NOT: { numbers: { hasSome: winningNumbers } },
                        resultado: {
                            gte: dayStart,
                            lte: dayEnd,
                        },
                    },
                    include: { user: true, vendedor: true },
                    orderBy: { createdAt: "desc" },
                });
            } else {
                candidateBets = await prisma.bet.findMany({
                    where: {
                        modalidade: foundResult.modalidade,
                        loteria: foundResult.loteria,
                        numbers: { hasEvery: winningNumbers },
                        resultado: {
                            gte: dayStart,
                            lte: dayEnd,
                        },
                    },
                    include: { user: true, vendedor: true },
                    orderBy: { createdAt: "desc" },
                });
            }

            // role-based filtering
            let filteredBets: BetWithUser[] = [];
            if (userRole === "admin") {
                const adminId = session.user.id;
                const sellers = await prisma.user.findMany({
                    where: { admin_id: adminId, role: "vendedor" },
                    select: { id: true },
                });
                const sellerIds = sellers.map((s) => s.id);

                filteredBets = candidateBets.filter((b) => {
                    const u = b.user;
                    if (u.role !== "usuario") return false;
                    const directByAdmin = u.admin_id === adminId;
                    const viaSeller = u.seller_id && sellerIds.includes(u.seller_id);
                    return directByAdmin || viaSeller;
                });
            } else {
                const vendedorId = session.user.id;
                filteredBets = candidateBets.filter((b) => {
                    const u = b.user;
                    if (u.role !== "usuario") return false;
                    return u.seller_id === vendedorId;
                });
            }

            // For each filtered bet, store the pair
            for (const bet of filteredBets) {
                betResultPairs.push({ bet, result: foundResult });
            }
        }

        if (betResultPairs.length === 0) {
            return NextResponse.json({ winners: [] }, { status: 200 });
        }

        // Now produce final array
        const winners = betResultPairs.flatMap((pair) => {
            return formatWinners([pair.bet], pair.result);
        });

        return NextResponse.json({ winners }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching ganhadores:", error);
        return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
    }
}
