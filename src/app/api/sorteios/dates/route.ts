import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
import { z } from "zod";

const querySchema = z.object({
    modalidade: z.string().min(1),
    loteria: z.string().min(1),
});

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());

    const parsedQuery = querySchema.safeParse(query);
    if (!parsedQuery.success) {
        const errors = parsedQuery.error.errors.map((err) => err.message);
        return NextResponse.json({ error: errors }, { status: 400 });
    }

    const { modalidade, loteria } = parsedQuery.data;

    try {
        const results = await prisma.result.findMany({
            where: { modalidade, loteria },
            select: { createdAt: true },
            orderBy: { createdAt: "desc" },
        });

        const dates = Array.from(
            new Set(results.map((r) => r.createdAt.toISOString().split("T")[0]))
        );

        return NextResponse.json({ dates }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching available dates:", error);
        return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
    }
}
