// app/api/apostas/route.ts

import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/authOptions";
import { Role } from "../../../types/roles";
import { z } from "zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const createBetSchema = z.object({
    numbers: z
        .array(z.number().int().min(1))
        .min(1)
        .refine((nums) => new Set(nums).size === nums.length, {}),
    modalidade: z.string().min(1),
    loteria: z.string().min(1),
    acertos: z.number().int().min(0),
    premio: z.number().nonnegative(),
    consultor: z.string().min(1),
    apostador: z.string().min(1),
    quantidadeDeDezenas: z.number().int().min(1),
    resultado: z
        .string()
        .refine((dateStr) => !isNaN(Date.parse(dateStr)), {
            message: "Invalid date format for 'resultado'.",
        })
        .optional(), // Optional, may not be known yet
    data: z.string().refine((dateStr) => !isNaN(Date.parse(dateStr)), {
        message: "Invalid date format for 'data'.",
    }),
    hora: z.string().regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, "Hora must be in 'HH:mm' format."),
    lote: z.string().min(1),
    tipoBilhete: z.string().min(1),
    valorBilhete: z.number().nonnegative(),
    vendedorId: z.string().uuid().optional(),
});

const createBetsSchema = z.object({
    userId: z.string().uuid(),
    bets: z.array(createBetSchema).min(1),
    totalAmount: z.number().nonnegative(),
});

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        console.log("Unauthorized access attempt.");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = session.user.role as Role;
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

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
        const [bets, totalItems] = await prisma.$transaction([
            prisma.bet.findMany({
                where: { userId: userId },
                include: {
                    user: { select: { id: true, username: true } },
                    vendedor: { select: { id: true, username: true } },
                },
                orderBy: { createdAt: "desc" },
                skip: skip,
                take: limit,
            }),
            prisma.bet.count({ where: { userId: userId } }),
        ]);

        const totalPages = Math.ceil(totalItems / limit);

        return NextResponse.json(
            {
                bets,
                totalItems,
                totalPages,
                currentPage: page,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error fetching bets:", error);
        if (error instanceof PrismaClientKnownRequestError) {
            return NextResponse.json({ error: "Database error." }, { status: 500 });
        }
        return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        console.log("Unauthorized access attempt.");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = session.user.role as Role;
    if (userRole !== "admin" && userRole !== "vendedor") {
        console.log(`Forbidden access attempt by user with role: ${userRole}`);
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const body = await request.json();
        const parsedBody = createBetsSchema.safeParse(body);
        if (!parsedBody.success) {
            console.log("Validation failed:", parsedBody.error.errors);
            return NextResponse.json({ error: parsedBody.error.errors }, { status: 400 });
        }

        const { userId, bets, totalAmount } = parsedBody.data;

        if (userRole === "vendedor") {
            const apostador = await prisma.user.findUnique({
                where: { id: userId },
                select: { seller_id: true },
            });
            if (!apostador || apostador.seller_id !== session.user.id) {
                return NextResponse.json(
                    { error: "Forbidden: Cannot create bets for this user." },
                    { status: 403 }
                );
            }
        }

        const createdBets = [];
        for (const bet of bets) {
            const {
                numbers,
                modalidade,
                loteria,
                acertos,
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

            const finalVendedorId =
                vendedorId || (userRole === "vendedor" ? session.user.id : null);

            const newBet = await prisma.bet.create({
                data: {
                    numbers,
                    modalidade,
                    loteria,
                    acertos,

                    premio,
                    consultor,
                    apostador,
                    quantidadeDeDezenas,
                    resultado: resultado ? new Date(resultado) : "",
                    data: new Date(data),
                    hora,
                    lote,
                    tipoBilhete,
                    valorBilhete,
                    userId: userId,
                    vendedorId: finalVendedorId,
                },
            });

            createdBets.push(newBet);
        }

        await prisma.wallet.update({
            where: { userId },
            data: { balance: { decrement: totalAmount } },
        });

        return NextResponse.json(
            { message: "Bets created successfully.", bets: createdBets },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Error creating bets:", error);
        if (error instanceof PrismaClientKnownRequestError) {
            return NextResponse.json({ error: "Database error." }, { status: 500 });
        }
        return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
    }
}
