// src/app/api/apostas/route.ts

import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { Role } from "../../../types/roles";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { z } from "zod";

// Define the request body schema for creating a new bet
const createBetSchema = z.object({
    numbers: z
        .array(z.number().int().min(1).max(60))
        .min(1)
        .refine((nums) => new Set(nums).size === nums.length, {
            message: "Numbers must be unique and between 1 and 60",
        }),
    modalidade: z.string().min(1),
    acertos: z.number().int().min(0),
    premio: z.number().nonnegative(),
    consultor: z.string().min(1),
    apostador: z.string().min(1),
    quantidadeDeDezenas: z.number().int().min(1),
    resultado: z.string().refine((dateStr) => !isNaN(Date.parse(dateStr)), {
        message: "Invalid date format for resultado",
    }),
    data: z.string().refine((dateStr) => !isNaN(Date.parse(dateStr)), {
        message: "Invalid date format for data",
    }),
    hora: z.string().regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, "Hora must be in 'HH:mm' format"),
    lote: z.string().min(1),
    tipoBilhete: z.string().min(1),
    valorBilhete: z.number().nonnegative(),
    vendedorId: z.string().uuid().optional(),
});

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

// Handle GET requests - Fetch all bets
export async function GET(request: Request) {
    // Authenticate the user
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
        console.log("Fetching all bets...");

        const bets = await prisma.bet.findMany({
            include: {
                user: {
                    select: { id: true, username: true },
                },
                vendedor: {
                    select: { id: true, username: true },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        console.log(`Fetched ${bets.length} bets.`);

        return NextResponse.json(bets, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching bets:", error.message, error.stack);

        if (error instanceof PrismaClientKnownRequestError) {
            // Handle specific Prisma errors if needed
            return NextResponse.json({ error: "Database error." }, { status: 500 });
        }

        return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
    }
}

// Handle POST requests - Create a new bet
export async function POST(request: Request) {
    // Authenticate the user
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        console.log("Unauthorized access attempt.");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the user has the required role
    const userRole = session.user.role as Role;
    if (userRole !== "admin" && userRole !== "vendedor") {
        console.log(`Forbidden access attempt by user with role: ${userRole}`);
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const body = await request.json();

        // Validate the request body
        const parsedBody = createBetSchema.safeParse(body);
        if (!parsedBody.success) {
            console.log("Validation failed:", parsedBody.error.errors);
            return NextResponse.json({ error: parsedBody.error.errors }, { status: 400 });
        }

        const {
            numbers,
            modalidade,
            acertos,
            premio,
            consultor,
            apostador,
            quantidadeDeDezenas,
            resultado,
            data,
            hora,
            lote,
            tipoBilhete,
            valorBilhete,
            vendedorId,
        } = parsedBody.data;

        // Create the new bet
        const newBet = await prisma.bet.create({
            data: {
                numbers,
                modalidade,
                acertos,
                premio,
                consultor,
                apostador,
                quantidadeDeDezenas,
                resultado: new Date(resultado),
                data: new Date(data),
                hora,
                lote,
                tipoBilhete,
                valorBilhete,
                userId: session.user.id, // Assuming the authenticated user's ID is used as bettor
                vendedorId: vendedorId || null,
            },
        });

        console.log("New bet created:", newBet);

        return NextResponse.json(newBet, { status: 201 });
    } catch (error: any) {
        console.error("Error creating bet:", error.message, error.stack);

        if (error instanceof PrismaClientKnownRequestError) {
            // Handle specific Prisma errors if needed
            return NextResponse.json({ error: "Database error." }, { status: 500 });
        }

        return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
    }
}
