// src/app/api/vendedores/route.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Vendedor } from "../../../../../types/vendedor";

// In-memory store for demonstration purposes
// Replace this with your database logic
let vendedores: Vendedor[] = [
    {
        id: "1",
        username: "Vendedor One",
        phoneNumber: "123-456-7890",
    },
    {
        id: "2",
        username: "Vendedor Two",
        phoneNumber: "987-654-3210",
    },
    // ... more vendedores
];

export async function GET(request: NextRequest) {
    return NextResponse.json(vendedores);
}

export async function POST(request: NextRequest) {
    try {
        const { username, email, phoneNumber } = await request.json();

        // Basic validation
        if (!username || !email) {
            return NextResponse.json({ message: "Name and Email are required." }, { status: 400 });
        }

        // Check for existing username
        const existingVendedor = vendedores.find((v) => v.username === username);
        if (existingVendedor) {
            return NextResponse.json(
                { message: "Vendedor with this email already exists." },
                { status: 409 }
            );
        }

        // Create new vendedor
        const newVendedor: Vendedor = {
            id: (vendedores.length + 1).toString(),
            username,
            phoneNumber: phoneNumber || "",
            // Add other fields if necessary
        };

        vendedores.push(newVendedor);

        return NextResponse.json(newVendedor, { status: 201 });
    } catch (error) {
        console.error("Error creating vendedor:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
