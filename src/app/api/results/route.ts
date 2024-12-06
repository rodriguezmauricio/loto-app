import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/authOptions";
import { z } from "zod";
import { Role } from "../../../types/roles";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const resultSchema = z.object({
    modalidade: z.string().min(1, { message: "Modalidade é obrigatória." }),
    loteria: z.string().min(1, { message: "Loteria é obrigatória." }),
    winningNumbers: z.string().min(1),
});

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = session.user.role as Role;
    if (userRole !== "admin" && userRole !== "vendedor") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const body = await request.json();
        const parsed = resultSchema.parse(body);
        const { modalidade, loteria, winningNumbers } = parsed;

        const winningNumsArray = winningNumbers
            .split(" ")
            .map((num: string) => parseInt(num, 10))
            .filter((n) => !isNaN(n));

        if (winningNumsArray.length === 0) {
            return NextResponse.json(
                { error: "Please provide valid winning numbers." },
                { status: 400 }
            );
        }

        const premioValue = 1000.0;

        const newResult = await prisma.result.create({
            data: {
                modalidade,
                loteria,
                winningNumbers: winningNumsArray,
                premio: premioValue,
                createdBy: session.user.id,
            },
        });

        return NextResponse.json({ result: newResult }, { status: 201 });
    } catch (error: any) {
        console.error("Error saving result:", error);

        if (error instanceof z.ZodError) {
            const errors = error.errors.map((err) => err.message);
            return NextResponse.json({ error: errors }, { status: 400 });
        }

        if (error instanceof PrismaClientKnownRequestError) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
