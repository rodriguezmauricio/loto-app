import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/authOptions";
import { Role } from "../../../../types/roles";

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = session.user.role as Role;
    if (userRole !== "admin" && userRole !== "vendedor") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const url = new URL(request.url);
    const modalidade = url.searchParams.get("modalidade");
    const loteria = url.searchParams.get("loteria");

    if (!modalidade || !loteria) {
        return NextResponse.json({ error: "modalidade and loteria are required" }, { status: 400 });
    }

    try {
        const results = await prisma.result.findMany({
            where: { modalidade, loteria },
            orderBy: { createdAt: "desc" },
            select: { createdAt: true },
        });

        const dates = Array.from(
            new Set(results.map((r) => r.createdAt.toISOString().split("T")[0]))
        );

        return NextResponse.json({ dates }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching dates:", error);
        return NextResponse.json({ error: "Erro ao buscar datas disponíveis." }, { status: 500 });
    }
}
