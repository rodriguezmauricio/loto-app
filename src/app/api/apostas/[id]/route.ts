// app/api/apostas/[id]/route.ts

import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@lib/authOptions";
import { Role } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

// Handle DELETE requests - Delete a specific bet by ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    console.log(`DELETE /api/apostas/${id} called`);

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
        // Fetch the bet to verify ownership or permissions
        const bet = await prisma.bet.findUnique({
            where: { id },
        });

        if (!bet) {
            console.log(`Bet with ID ${id} not found.`);
            return NextResponse.json({ error: "Bilhete não encontrado." }, { status: 404 });
        }

        // If the user is a 'vendedor', ensure they own the bet
        if (userRole === "vendedor" && bet.vendedorId !== session.user.id) {
            console.log(`Vendedor ${session.user.id} attempting to delete bet they do not own.`);
            return NextResponse.json(
                { error: "Forbidden: Você não possui permissão para deletar este bilhete." },
                { status: 403 }
            );
        }

        // Proceed to delete the bet
        await prisma.bet.delete({
            where: { id },
        });

        console.log(`Bet with ID ${id} deleted successfully.`);

        return NextResponse.json({ message: "Bilhete deletado com sucesso." }, { status: 200 });
    } catch (error: any) {
        console.error("Error deleting bet:", error.message, error.stack);

        if (error instanceof PrismaClientKnownRequestError) {
            // Handle specific Prisma errors if needed
            return NextResponse.json({ error: "Erro no banco de dados." }, { status: 500 });
        }

        return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
    }
}
