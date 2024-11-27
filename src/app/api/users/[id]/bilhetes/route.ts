// app/api/users/[id]/bilhetes/route.ts

import { NextResponse } from "next/server";
import prisma from "../../../../../../prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@lib/authOptions";
import { Role } from "../../../../../types/roles";

const isAdmin = (role: Role): boolean => role === "admin";
const isVendedor = (role: Role): boolean => role === "vendedor";

// Helper function to get sellers' IDs for an admin
async function getSellersIds(adminId: string): Promise<string[]> {
    const sellers = await prisma.user.findMany({
        where: { admin_id: adminId, role: "vendedor" },
        select: { id: true },
    });
    return sellers.map((seller) => seller.id);
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        // Authenticate the user
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;
        const apostadorId = id; // Keep as string

        // Optional: Validate UUID format
        const uuidRegex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(apostadorId)) {
            return NextResponse.json({ error: "Invalid apostador ID format" }, { status: 400 });
        }

        // Authorization: Ensure the current user has access to this apostador's bilhetes
        const userRole = session.user.role as Role;
        const userId = session.user.id as string;

        let hasAccess = false;

        if (isAdmin(userRole)) {
            // Admins can access bilhetes of apostadores they created or those created by their sellers
            const isAdminOfApostador = await prisma.user.findFirst({
                where: {
                    id: apostadorId,
                    OR: [{ admin_id: userId }, { seller_id: { in: await getSellersIds(userId) } }],
                },
            });
            hasAccess = !!isAdminOfApostador;
        } else if (isVendedor(userRole)) {
            // Vendedores can access only their own apostadores
            const isOwnedApostador = await prisma.user.findFirst({
                where: {
                    id: apostadorId,
                    seller_id: userId,
                },
            });
            hasAccess = !!isOwnedApostador;
        }

        if (!hasAccess) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Fetch bilhetes for the apostador
        const bilhetes = await prisma.bet.findMany({
            where: { userId },
            orderBy: { id: "desc" }, // or any other ordering
            // Include related fields if necessary
        });

        return NextResponse.json({ bilhetes }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching bilhetes:", error);
        return NextResponse.json({ error: "Error fetching bilhetes." }, { status: 500 });
    }
}
