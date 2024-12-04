// app/api/results/route.ts

import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/authOptions";
import { z } from "zod";
import { Role } from "../../../types/roles";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

// Define the request body schema
const resultSchema = z.object({
    modalidade: z.string().min(1, { message: "Modalidade é obrigatória." }),
    loteria: z.string().min(1, { message: "Loteria é obrigatória." }),
    winningNumbers: z
        .array(z.number())
        .min(1, { message: "Insira pelo menos um número vencedor." }), // Array of numbers
});

// Define the response schema
const betSchema = z.object({
    id: z.string(),
    numbers: z.array(z.number()),
    modalidade: z.string(),
    userId: z.string(),
    // Add other relevant fields as needed
});

interface WinnerBet {
    id: string;
    numbers: number[];
    modalidade: string;
    loteria: string; // Ensure this field exists
    userId: string;
    // Add other fields as needed
}

export async function POST(request: Request) {
    // Authenticate the user
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = session.user.role as Role;

    // Only allow admin and vendedor roles
    if (userRole !== "admin" && userRole !== "vendedor") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        // Parse and validate the request body
        const body = await request.json();
        const parsed = resultSchema.parse(body);
        const { modalidade, loteria, winningNumbers } = parsed;

        // Calculate the prize (premio)
        const calculatePremio = (): number => {
            // Implement your prize calculation logic here
            return 1000.0; // Example fixed prize
        };

        const premioValue = calculatePremio();

        // Create the new result in the database
        const newResult = await prisma.result.create({
            data: {
                modalidade, // From request body
                loteria, // From request body
                winningNumbers, // From request body
                premio: premioValue,
                createdBy: session.user.id, // From session
            },
        });

        // Fetch all bets for the modalidade and loteria
        const allBets = await prisma.bet.findMany({
            where: { modalidade, loteria },
            select: { id: true, numbers: true, modalidade: true, userId: true },
        });

        // Define winning criteria (e.g., all winning numbers must be in the bet)
        const winningBets = allBets.filter((bet) =>
            winningNumbers.every((num) => bet.numbers.includes(num))
        );

        return NextResponse.json({ result: newResult, winners: winningBets }, { status: 201 });
    } catch (error: any) {
        console.error("Error saving result:", error);

        if (error instanceof z.ZodError) {
            const errors = error.errors.map((err) => err.message);
            return NextResponse.json({ error: errors }, { status: 400 });
        }

        if (error instanceof PrismaClientKnownRequestError) {
            // Handle known Prisma errors (e.g., unique constraint violations)
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
