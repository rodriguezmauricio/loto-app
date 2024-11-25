// src/app/api/vendedores/route.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// import { prisma } from "../../../../lib/prisma"; // Prisma client
import prisma from "../../../../../prisma/client";

export async function GET(request: NextRequest) {
    try {
        const vendedores = await prisma.vendedor.findMany();
        return NextResponse.json(vendedores);
    } catch (error) {
        console.error("Error fetching vendedores:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { name, email, phoneNumber } = await request.json();

        // Basic validation
        if (!name || !email) {
            return NextResponse.json({ message: "Name and Email are required." }, { status: 400 });
        }

        // Create new vendedor
        const newVendedor = await prisma.vendedor.create({
            data: {
                name,
                email,
                phoneNumber,
            },
        });

        return NextResponse.json(newVendedor, { status: 201 });
    } catch (error: any) {
        console.error("Error creating vendedor:", error);
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
