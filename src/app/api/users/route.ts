// src/app/api/users/route.ts

import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
import { getToken } from "next-auth/jwt";
import { authOptions } from "../../../lib/authOptions";
import bcrypt from "bcrypt";
import { Role } from "../../../types/roles";
import { createUserSchema } from "../../../validation/userValidation";
import { ZodError } from "zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

// Helper functions
const isAdmin = (role: Role): boolean => role === "admin";
const isVendedor = (role: Role): boolean => role === "vendedor";

/**
 * Type Guard to check if a string is a valid Role
 */
const isValidRole = (role: string): role is Role => {
    return role === "admin" || role === "vendedor" || role === "usuario";
};

/**
 * Creates a new user with role-based access control.
 */
export async function POST(request: Request) {
    try {
        // Authenticate the user using getToken
        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check if the user has the required role
        const userRole = token.role as Role;
        if (!userRole) {
            return NextResponse.json({ error: "Forbidden: Role not defined." }, { status: 403 });
        }

        // Parse and validate the request body
        const body = await request.json();
        const parsed = createUserSchema.parse(body);

        const { username, password, phone, pix, role, valor_comissao } = parsed;

        // Ensure the session user's role is allowed to create users with the specified role
        if (role === "admin" && !isAdmin(userRole)) {
            return NextResponse.json(
                { error: "Forbidden: Only admins can create admin users." },
                { status: 403 }
            );
        }

        if (role === "vendedor" && !isAdmin(userRole)) {
            return NextResponse.json(
                { error: "Forbidden: Only admins can create vendedores." },
                { status: 403 }
            );
        }

        // If role is 'vendedor', 'valor_comissao' is required
        if (role === "vendedor" && (valor_comissao === undefined || valor_comissao === null)) {
            return NextResponse.json(
                { error: "Comissão é obrigatória para vendedores." },
                { status: 400 }
            );
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Determine adminId or sellerId based on the current user's role
        let adminId: string | null = null;
        let sellerId: string | null = null;

        if (isAdmin(userRole)) {
            adminId = token.id as string;
        } else if (isVendedor(userRole)) {
            sellerId = token.id as string;
        }

        // Check if the username already exists
        const existingUser = await prisma.user.findUnique({
            where: { username },
        });

        if (existingUser) {
            return NextResponse.json({ error: "Username already exists." }, { status: 409 });
        }

        // Create the user in the database with a Wallet
        const newUser = await prisma.user.create({
            data: {
                username,
                password_hash: hashedPassword,
                phone,
                pix: pix || "sem pix",
                admin_id: adminId,
                seller_id: sellerId,
                role,
                valor_comissao: valor_comissao, // Store comissao if applicable
                wallet: {
                    create: {
                        balance: 0, // Initialize wallet with a balance of 0
                    },
                },
            },
            include: {
                wallet: true, // Include the wallet in the response if needed
            },
        });

        return NextResponse.json(newUser, { status: 201 });
    } catch (error: any) {
        console.error("Error creating user:", error);
        if (error instanceof ZodError) {
            return NextResponse.json(
                { error: error.errors.map((err) => err.message) },
                { status: 400 }
            );
        }
        // Handle unique constraint violation (e.g., duplicate username or wallet)
        if (error.code === "P2002") {
            if (error.meta.target.includes("userId")) {
                return NextResponse.json(
                    { error: "A Wallet already exists for this user." },
                    { status: 409 }
                );
            }
            return NextResponse.json({ error: "Username already exists." }, { status: 409 });
        }
        return NextResponse.json({ error: "Error creating user." }, { status: 500 });
    }
}
