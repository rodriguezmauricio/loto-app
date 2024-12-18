import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import prisma from "../../../../../../../prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@lib/authOptions"; // Adjust the path if necessary

function isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
}

export async function GET(
    request: Request,
    { params }: { params: { id: string; walletId: string } }
) {
    try {
        // Get the session to identify the current user
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id, walletId } = params;
        console.log(`Fetching wallet with ID: ${walletId} for user ID: ${id}`);

        if (!isValidUUID(id)) {
            console.log(`Invalid UUID format for id: ${id}`);
            return NextResponse.json({ error: "Invalid user ID format." }, { status: 400 });
        }

        if (!isValidUUID(walletId)) {
            console.log(`Invalid UUID format for walletId: ${walletId}`);
            return NextResponse.json({ error: "Invalid wallet ID format." }, { status: 400 });
        }

        // Fetch the wallet from the database
        const wallet = await prisma.wallet.findUnique({
            where: { id: walletId },
            select: {
                id: true,
                balance: true,
                transactions: true, // Adjust fields as necessary
                user: true, // added instead of using the include param
                // Add other fields as necessary
            },
        });

        if (!wallet) {
            return NextResponse.json({ error: "Carteira não encontrada." }, { status: 404 });
        }

        // Authorization: Ensure the wallet belongs to the apostador
        const apostador = await prisma.user.findUnique({
            where: { id },
            select: { id: true, admin_id: true, seller_id: true },
        });

        if (!apostador) {
            return NextResponse.json({ error: "Apostador não encontrado." }, { status: 404 });
        }

        // Check if the current user is authorized to view the wallet
        if (session.user.role === "admin") {
            // Admin can view wallets of apostadores they manage
            const sellers = await prisma.user.findMany({
                where: { admin_id: session.user.id, role: "vendedor" },
                select: { id: true },
            });
            const sellerIds = sellers.map((seller) => seller.id);

            if (
                apostador.admin_id !== session.user.id &&
                !sellerIds.includes(apostador.seller_id!) // added ! here
            ) {
                return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
            }
        } else if (session.user.role === "vendedor") {
            // Sellers can only view wallets of apostadores they created
            if (apostador.seller_id !== session.user.id) {
                return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
            }
        } else {
            // Regular users should not access this endpoint
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        return NextResponse.json(wallet, { status: 200 });
    } catch (error) {
        console.error("Error fetching carteira apostador:", error);
        return NextResponse.json({ error: "Erro ao buscar carteira apostador." }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { id: string; walletId: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id, walletId } = params;

        const body = await request.json();
        const { amount, operation } = body;

        const numericAmount = new Prisma.Decimal(amount);
        if (numericAmount.isNaN() || numericAmount.lte(0)) {
            return NextResponse.json({ error: "Invalid amount value." }, { status: 400 });
        }

        // Fetch the wallet to ensure it exists and belongs to the user
        const wallet = await prisma.wallet.findUnique({
            where: { id: walletId },
            include: {
                user: {
                    select: { id: true, admin_id: true, seller_id: true },
                },
            },
        });

        if (!wallet) {
            return NextResponse.json({ error: "Wallet not found." }, { status: 404 });
        }

        const user = wallet.user;

        // Authorization logic
        if (session.user.role === "admin") {
            // Admins can update wallets of users they manage
            if (user.admin_id !== session.user.id) {
                return NextResponse.json({ error: "Access denied." }, { status: 403 });
            }
        } else if (session.user.role === "vendedor") {
            // Sellers can update wallets of users they created
            if (user.seller_id !== session.user.id) {
                return NextResponse.json({ error: "Access denied." }, { status: 403 });
            }
        } else {
            // Regular users cannot update wallets
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Calculate the new balance
        let newBalance = wallet.balance; // newBalance is of type Prisma.Decimal

        if (operation === "add") {
            newBalance = newBalance.add(numericAmount);
        } else if (operation === "subtract") {
            newBalance = newBalance.sub(numericAmount);
        } else {
            return NextResponse.json({ error: "Invalid operation." }, { status: 400 });
        }

        // Optional: Prevent negative balance
        if (newBalance.lt(0)) {
            return NextResponse.json({ error: "Balance cannot be negative." }, { status: 400 });
        }

        // Update the wallet balance
        const updatedWallet = await prisma.wallet.update({
            where: { id: walletId },
            data: { balance: newBalance },
        });

        // Convert Decimal fields to strings before sending response
        const updatedWalletData = {
            ...updatedWallet,
            balance: updatedWallet.balance,
        };

        return NextResponse.json(updatedWalletData, { status: 200 });
    } catch (error) {
        console.error("Error updating wallet balance:", error);
        return NextResponse.json({ error: "Error updating wallet balance." }, { status: 500 });
    }
}
