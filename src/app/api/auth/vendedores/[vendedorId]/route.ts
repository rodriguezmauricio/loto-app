// src/app/api/vendedores/[vendedorId]/route.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// import { prisma } from "../../../../../lib/prisma"; // Prisma client
import prisma from "../../../../../../prisma/client";

export async function GET(request: NextRequest, { params }: { params: { vendedorId: string } }) {
    const { vendedorId } = params;

    try {
        const vendedor = await prisma.vendedor.findUnique({
            where: { id: vendedorId },
        });

        if (!vendedor) {
            return NextResponse.json({ message: "Vendedor not found." }, { status: 404 });
        }

        return NextResponse.json(vendedor);
    } catch (error) {
        console.error("Error fetching vendedor:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: { vendedorId: string } }) {
    const { vendedorId } = params;
    const { name, email, phoneNumber } = await request.json();

    try {
        const updatedVendedor = await prisma.vendedor.update({
            where: { id: vendedorId },
            data: {
                name,
                email,
                phoneNumber,
            },
        });

        return NextResponse.json(updatedVendedor);
    } catch (error: any) {
        console.error("Error updating vendedor:", error);
        if (error.code === "P2025") {
            // Record not found
            return NextResponse.json({ message: "Vendedor not found." }, { status: 404 });
        }
        if (error.code === "P2002") {
            // Unique constraint failed
            return NextResponse.json(
                { message: "A Vendedor with this email already exists." },
                { status: 409 }
            );
        }
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { vendedorId: string } }) {
    const { vendedorId } = params;

    try {
        const deletedVendedor = await prisma.vendedor.delete({
            where: { id: vendedorId },
        });

        return NextResponse.json(deletedVendedor);
    } catch (error: any) {
        console.error("Error deleting vendedor:", error);
        if (error.code === "P2025") {
            // Record not found
            return NextResponse.json({ message: "Vendedor not found." }, { status: 404 });
        }
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
