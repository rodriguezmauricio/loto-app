// app/api/results/route.ts

import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/authOptions";
import { z } from "zod";
import { Role } from "../../../types/roles";

// Define the request body schema
const resultSchema = z.object({
    modalidade: z.string().min(1),
    winningNumbers: z.string().min(1), // Space-separated numbers
});

// Define the response schema
const betSchema = z.object({
    id: z.string(),
    numbers: z.array(z.number()),
    modalidade: z.string(),
    userId: z.string(),
    // Add other relevant fields as needed
});

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
        const { modalidade, winningNumbers } = parsed;

        // Parse winning numbers into an array of integers
        const winningNumsArray = winningNumbers
            .split(" ")
            .map((num: string) => parseInt(num, 10))
            .filter((num: number) => !isNaN(num));

        if (winningNumsArray.length === 0) {
            return NextResponse.json(
                { error: "Please provide valid winning numbers separated by spaces." },
                { status: 400 }
            );
        }

        // Assuming you have logic to determine the prize amount
        const calculatePremio = (): number => {
            // Your logic here
            return 1000.0;
        };

        const premioValue = calculatePremio();

        const newResult = await prisma.result.create({
            data: {
                modalidade: "Lotofácil",
                winningNumbers: [5, 6, 8, 9, 12, 13, 17, 20, 23, 25],
                premio: premioValue,
            },
        });
        // Fetch all bets for the modalidade
        const allBets = await prisma.bet.findMany({
            where: { modalidade },
            select: { id: true, numbers: true, modalidade: true, userId: true },
        });

        // Define winning criteria (e.g., all winning numbers must be in the bet)
        const winningBets = allBets.filter((bet) =>
            winningNumsArray.every((num) => bet.numbers.includes(num))
        );

        return NextResponse.json({ result: newResult, winners: winningBets }, { status: 201 });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        console.error("Error saving result:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
