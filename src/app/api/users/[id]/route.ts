// app/api/users/[id]/route.ts

import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../app/api/auth/[...nextauth]/route"; // Adjust the path if necessary

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        // Get the session to identify the current user
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;
        console.log(`Fetching apostador with ID: ${id}`);

        // Fetch the apostador from the database
        const apostador = await prisma.user.findUnique({
            where: { id },
            include: {
                wallet: true,
            },
        });

        if (!apostador) {
            return NextResponse.json({ error: "Apostador não encontrado." }, { status: 404 });
        }

        // Authorization: Check if the current user can view this apostador
        if (session.user.role === "admin") {
            // Admin can view apostadores they created or created by their sellers
            const sellers = await prisma.user.findMany({
                where: { admin_id: session.user.id, role: "vendedor" },
                select: { id: true },
            });
            const sellerIds = sellers.map((seller) => seller.id);

            if (
                apostador.admin_id !== session.user.id &&
                !(apostador.seller_id && sellerIds.includes(apostador.seller_id))
            ) {
                return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
            }
        } else if (session.user.role === "vendedor") {
            // Sellers can only view apostadores they created
            if (apostador.seller_id !== session.user.id) {
                return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
            }
        } else {
            // Regular users should not access this endpoint
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        return NextResponse.json(apostador, { status: 200 });
    } catch (error) {
        console.error("Error fetching apostador:", error);
        return NextResponse.json({ error: "Erro ao buscar apostador." }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        // Get the session to identify the current user
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;

        // Fetch the apostador to verify existence and permissions
        const apostador = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                role: true,
                admin_id: true,
                seller_id: true,
            },
        });

        if (!apostador) {
            return NextResponse.json({ error: "Apostador não encontrado." }, { status: 404 });
        }

        // Authorization: Check if the current user can delete this apostador
        if (session.user.role === "admin") {
            // Admin can delete apostadores they created or created by their sellers
            const sellers = await prisma.user.findMany({
                where: { admin_id: session.user.id, role: "vendedor" },
                select: { id: true },
            });
            const sellerIds = sellers.map((seller) => seller.id);

            if (
                apostador.admin_id !== session.user.id &&
                !sellerIds.includes(apostador.seller_id!) // added the ! here too
            ) {
                return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
            }
        } else if (session.user.role === "vendedor") {
            // Sellers can only delete apostadores they created
            if (apostador.seller_id !== session.user.id) {
                return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
            }
        } else {
            // Regular users should not access this endpoint
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Delete the apostador
        await prisma.user.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Apostador excluído com sucesso." }, { status: 200 });
    } catch (error) {
        console.error("Error deleting apostador:", error);
        return NextResponse.json({ error: "Erro ao excluir apostador." }, { status: 500 });
    }
}

// app/api/users/[id]/route.ts

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        // Get the session to identify the current user
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;
        const body = await request.json();

        // Fetch the apostador to verify existence and permissions
        const apostador = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                role: true,
                admin_id: true,
                seller_id: true,
            },
        });

        if (!apostador) {
            return NextResponse.json({ error: "Apostador não encontrado." }, { status: 404 });
        }

        // Authorization: Similar to DELETE
        if (session.user.role === "admin") {
            const sellers = await prisma.user.findMany({
                where: { admin_id: session.user.id, role: "vendedor" },
                select: { id: true },
            });
            const sellerIds = sellers.map((seller) => seller.id);

            if (
                apostador.admin_id !== session.user.id &&
                !sellerIds.includes(apostador.seller_id!) // added ! here too
            ) {
                return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
            }
        } else if (session.user.role === "vendedor") {
            if (apostador.seller_id !== session.user.id) {
                return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
            }
        } else {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Update the apostador
        const updatedApostador = await prisma.user.update({
            where: { id },
            data: {
                username: body.username,
                phone: body.phone,
                pix: body.pix,
                // Add other fields as necessary
            },
        });

        return NextResponse.json(updatedApostador, { status: 200 });
    } catch (error) {
        console.error("Error updating apostador:", error);
        return NextResponse.json({ error: "Erro ao atualizar apostador." }, { status: 500 });
    }
}
