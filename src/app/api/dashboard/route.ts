// src/app/api/dashboard/route.ts

import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/authOptions";
import { Role } from "../../../types/roles";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

// Define the response type
interface DashboardData {
    saldoBancaHoje: number;
    vendas: number;
    comissoes: number;
    premiacoes: number;
    creditosVendedores: number;
    creditosApostadores: number;
    apostadores?: {
        id: string;
        username: string;
        balance: number;
        bets: {
            id: string;
            valorBilhete: number;
            createdAt: Date;
            // Add other fields as needed
        }[];
    }[];
}

export async function GET(request: Request) {
    // Authenticate the user using getServerSession
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        console.log("Unauthorized access attempt.");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the user has the required role
    const userRole = session.user.role as Role;
    if (userRole !== "admin") {
        console.log(`Forbidden access attempt by user with role: ${userRole}`);
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        console.log("Fetching dashboard data...");

        // Define the start of today
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        // 1. Saldo da Banca Hoje: Total balance in the admin's wallet(s)
        console.log("Fetching admin wallets...");
        const adminWallets = await prisma.wallet.findMany({
            where: {
                user: {
                    role: "admin",
                },
            },
            select: {
                balance: true,
            },
        });
        console.log("Admin wallets fetched:", adminWallets);
        const saldoBancaHoje = adminWallets.reduce(
            (acc, wallet) => acc + Number(wallet.balance),
            0
        );

        // 2. Vendas: Total bets placed today
        console.log("Fetching vendas data...");
        const vendasData = await prisma.bet.aggregate({
            _sum: {
                valorBilhete: true,
            },
            where: {
                createdAt: {
                    gte: startOfToday,
                },
            },
        });
        console.log("Vendas data fetched:", vendasData);
        const vendas = vendasData._sum?.valorBilhete ? Number(vendasData._sum.valorBilhete) : 0;

        // 3. Comissões: Total commissions owed based on today's bets
        const COMISSAO_RATE = 0.1;
        const comissoes = vendas * COMISSAO_RATE;

        // 4. Premiações: Total prizes awarded today
        console.log("Fetching premiacoes data...");
        const premiacoesData = await prisma.prize.aggregate({
            _sum: {
                amount: true,
            },
            where: {
                awarded_at: {
                    gte: startOfToday,
                },
            },
        });
        console.log("Premiacoes data fetched:", premiacoesData);
        const premiacoes = premiacoesData._sum?.amount ? Number(premiacoesData._sum.amount) : 0;

        // 5. Créditos Vendedores: Total balance held by all sellers
        console.log("Fetching creditosVendedores data...");
        const vendedoresWallets = await prisma.wallet.findMany({
            where: {
                user: {
                    role: "vendedor",
                },
            },
            select: {
                balance: true,
            },
        });
        console.log("Vendedores wallets fetched:", vendedoresWallets);
        const creditosVendedores = vendedoresWallets.reduce(
            (acc, wallet) => acc + Number(wallet.balance),
            0
        );

        // 6. Créditos Apostadores: Total balance held by all bettors
        console.log("Fetching creditosApostadores data...");
        const apostadoresWallets = await prisma.wallet.findMany({
            where: {
                user: {
                    role: "usuario",
                },
            },
            select: {
                balance: true,
            },
        });
        console.log("Apostadores wallets fetched:", apostadoresWallets);
        const creditosApostadores = apostadoresWallets.reduce(
            (acc, wallet) => acc + Number(wallet.balance),
            0
        );

        // 7. Apostadores: Fetch detailed bets per apostador (optional)
        console.log("Fetching detailed apostadores data...");
        const apostadoresData = await prisma.user.findMany({
            where: {
                role: "usuario",
            },
            select: {
                id: true,
                username: true,
                wallet: {
                    select: {
                        balance: true,
                    },
                },
                bets: {
                    select: {
                        id: true,
                        valorBilhete: true,
                        createdAt: true,
                        // Add other fields as needed
                    },
                },
            },
        });

        const detailedApostadores = apostadoresData.map((user) => ({
            id: user.id,
            username: user.username,
            balance: Number(user.wallet?.balance || 0),
            bets: user.bets.map((bet) => ({
                id: bet.id,
                valorBilhete: bet.valorBilhete,
                createdAt: bet.createdAt,
                // ... other fields
            })),
        }));

        console.log("Detailed apostadores data fetched:", detailedApostadores);

        // Prepare the response data
        const dashboardData: DashboardData & { apostadores: any[] } = {
            saldoBancaHoje,
            vendas,
            comissoes,
            premiacoes,
            creditosVendedores,
            creditosApostadores,
            apostadores: detailedApostadores, // Optional: Include if needed
        };

        console.log("Dashboard data prepared:", dashboardData);

        return NextResponse.json(dashboardData, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching dashboard data:", error.message, error.stack);

        if (error instanceof PrismaClientKnownRequestError) {
            // Handle specific Prisma errors if needed
            return NextResponse.json({ error: "Database error." }, { status: 500 });
        }

        return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
    }
}
