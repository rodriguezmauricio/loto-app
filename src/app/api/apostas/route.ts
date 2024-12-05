// app/api/apostas/route.ts

import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@lib/authOptions";
import { Role } from "../../../types/roles";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { z } from "zod";
import { calculateAcertos } from "app/utils/calculateAcertos";

// Define the request body schema for creating a new bet
const createBetSchema = z.object({
    numbers: z
        .array(z.number().int().min(1))
        .min(1)
        .refine((nums) => new Set(nums).size === nums.length, {
            message: "Numbers must be unique.",
        }),
    loteria: z.string().min(1),
    modalidade: z.string().min(1),
    acertos: z.number().int().min(0).optional(), // Optional, will be calculated
    premio: z.number().nonnegative(),
    consultor: z.string().min(1),
    apostador: z.string().min(1),
    quantidadeDeDezenas: z.number().int().min(1),
    resultado: z
        .string()
        .refine((dateStr) => !isNaN(Date.parse(dateStr)), {
            message: "Invalid date format for 'resultado'.",
        })
        .optional(), // Optional
    data: z.string().refine((dateStr) => !isNaN(Date.parse(dateStr)), {
        message: "Invalid date format for 'data'.",
    }),
    hora: z.string().regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, "Hora must be in 'HH:mm' format."),
    lote: z.string().min(1),
    tipoBilhete: z.string().min(1),
    valorBilhete: z.number().nonnegative(),
    vendedorId: z.string().uuid().optional(),
});

// Schema for batch bet creation
const createBetsSchema = z.object({
    userId: z.string().uuid(),
    bets: z.array(createBetSchema).min(1),
    totalAmount: z.number().nonnegative(),
});

// Handle GET requests - Fetch all bets for a specific user
export async function GET(request: Request) {
    console.log("GET /api/apostas called");

    // Authenticate the user
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        console.log("Unauthorized access attempt.");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check user role
    const userRole = session.user.role as Role;

    // Parse query parameters
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");

    // Ensure that userId is provided
    if (!userId) {
        console.log("User ID is missing in the query parameters.");
        return NextResponse.json({ error: "User ID is required." }, { status: 400 });
    }

    // Authorization: Only admin can fetch bets for any user
    if (userRole !== "admin") {
        console.log(`Forbidden access attempt by user with role: ${userRole}`);
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        console.log(`Fetching all bets for userId: ${userId}`);

        const bets = await prisma.bet.findMany({
            where: { userId: userId },
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

        console.log(`Fetched ${bets.length} bets for userId: ${userId}`);

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

// Handle POST requests - Create new bets
export async function POST(request: Request) {
    console.log("POST /api/apostas called");

    // Authenticate the user
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        console.log("Unauthorized access attempt.");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check user role
    const userRole = session.user.role as Role;
    if (userRole !== "admin" && userRole !== "vendedor") {
        console.log(`Forbidden access attempt by user with role: ${userRole}`);
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const body = await request.json();

        // Validate the request body against the batch schema
        const parsedBody = createBetsSchema.safeParse(body);
        if (!parsedBody.success) {
            console.log("Validation failed:", parsedBody.error.errors);
            return NextResponse.json({ error: parsedBody.error.errors }, { status: 400 });
        }

        const { userId, bets, totalAmount } = parsedBody.data;

        // Additional Authorization: Ensure the authenticated user can create bets for this userId
        if (userRole === "vendedor") {
            // Verify that the userId belongs to a user managed by this vendedor
            const apostador = await prisma.user.findUnique({
                where: { id: userId },
                select: { seller_id: true },
            });

            if (!apostador || apostador.seller_id !== session.user.id) {
                console.log(
                    `Vendedor ${session.user.id} attempting to create bet for unauthorized user ${userId}`
                );
                return NextResponse.json(
                    { error: "Forbidden: Cannot create bets for this user." },
                    { status: 403 }
                );
            }
        }

        // Fetch winning numbers for the specific modalidade and loteria
        // Assuming you have a way to fetch winning numbers, e.g., from the Result model
        // For this example, we'll assume the latest Result for the modalidade and loteria

        const latestResult = await prisma.result.findFirst({
            where: {
                modalidade: bets[0].modalidade,
                loteria: bets[0].loteria,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        const winningNumbers = latestResult ? latestResult.winningNumbers : [];

        // Iterate over each bet, calculate acertos, and create them in the database
        const createdBets = [];
        for (const bet of bets) {
            const {
                numbers,
                modalidade,
                loteria,
                acertos, // Optional, will be calculated
                premio,
                consultor,
                apostador,
                quantidadeDeDezenas,
                resultado, // Optional
                data,
                hora,
                lote,
                tipoBilhete,
                valorBilhete,
                vendedorId,
            } = bet;

            // Calculate acertos based on winningNumbers
            const calculatedAcertos = calculateAcertos(numbers, winningNumbers);

            // If the authenticated user is a vendedor and vendedorId is not provided, assign it
            const finalVendedorId =
                vendedorId || (userRole === "vendedor" ? session.user.id : null);

            const newBet = await prisma.bet.create({
                data: {
                    numbers,
                    modalidade,
                    loteria, // Ensure 'loteria' is included
                    acertos: calculatedAcertos,
                    premio,
                    consultor,
                    apostador,
                    quantidadeDeDezenas,
                    resultado: resultado ? new Date(resultado) : "",
                    data: new Date(data),
                    hora, // Should be in 'HH:mm' format
                    lote,
                    tipoBilhete,
                    valorBilhete,
                    userId: userId, // Associate the bet with the specified userId
                    vendedorId: finalVendedorId,
                },
            });

            createdBets.push(newBet);
        }

        console.log(`Created ${createdBets.length} bets successfully.`);

        // Optionally, deduct the totalAmount from the user's wallet
        await prisma.wallet.update({
            where: { userId }, // Assuming one wallet per user
            data: { balance: { decrement: totalAmount } },
        });

        return NextResponse.json(
            { message: "Bets created successfully.", bets: createdBets },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Error creating bets:", error.message, error.stack);

        if (error instanceof PrismaClientKnownRequestError) {
            // Handle specific Prisma errors if needed
            return NextResponse.json({ error: "Database error." }, { status: 500 });
        }

        return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
    }
}
