// src/app/api/users/[Id]/route.ts

import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@lib/authOptions";
import bcrypt from "bcrypt";
import { Role } from "../../../../types/roles";
import { ZodError } from "zod";
import { updateUserSchema } from "validation/userValidation";

// Helper functions
const isAdmin = (role: Role): boolean => role === "admin";
const isVendedor = (role: Role): boolean => role === "vendedor";

/**
 * Handles GET, PUT, DELETE requests for /api/users/[userId]
 */
export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        // Authenticate the user using getServerSession
        const session = await getServerSession(authOptions);
        console.log("Session:", session);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Extract user information from session
        const userRole = session.user?.role as Role;
        const currentUserId = session.user?.id as string;

        if (!userRole || !currentUserId) {
            return NextResponse.json({ error: "Invalid session data" }, { status: 401 });
        }

        // Fetch the user by ID
        const user = await prisma.user.findUnique({
            where: { id: params.id },
            select: {
                id: true,
                username: true,
                name: true,
                email: true,
                image: true,
                phone: true,
                pix: true,
                role: true,
                valor_comissao: true,
                created_on: true,
                updated_on: true,
                wallet: {
                    // Include wallet data
                    select: {
                        id: true,
                        balance: true,
                        transactions: true, // Adjust based on your schema
                    },
                },
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Authorization: Only admins or the user themselves can view
        if (userRole !== "admin" && user.id !== currentUserId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching user:", error);
        return NextResponse.json({ error: "Error fetching user." }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: { userId: string } }) {
    try {
        // Authenticate the user using getServerSession
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Extract user information from session
        const userRole = session.user.role as Role;
        const userId = session.user.id as string;

        // Fetch the user by ID
        const user = await prisma.user.findUnique({
            where: { id: params.userId },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Authorization: Only admins or the user themselves can update
        if (userRole !== "admin" && user.id !== userId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Parse and validate the request body
        const body = await request.json();

        // Validate using Zod
        const parsed = updateUserSchema.safeParse(body);
        if (!parsed.success) {
            const errors = parsed.error.errors.map((err: any) => err.message).join(", ");
            return NextResponse.json({ error: errors }, { status: 400 });
        }

        const { username, phone, name, email, image, pix, valor_comissao, password, role } =
            parsed.data;

        // Prepare update data
        const updateData: any = {
            username,
            phone,
            name: name || null,
            email: email || null,
            image: image || null,
            pix: pix || null,
            updated_on: new Date(),
        };

        // Only admins can change roles
        if (role && userRole === "admin") {
            updateData.role = role;
        }

        // Include valor_comissao only if the role is vendedor
        if (role === "vendedor" || user.role === "vendedor") {
            updateData.valor_comissao = valor_comissao || 0;
        }

        // Include password if it's provided
        if (password && password.trim() !== "") {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password_hash = hashedPassword;
        }

        // Update the user
        const updatedUser = await prisma.user.update({
            where: { id: params.userId },
            data: updateData,
            select: {
                id: true,
                username: true,
                name: true,
                email: true,
                image: true,
                phone: true,
                pix: true,
                role: true,
                valor_comissao: true,
                created_on: true,
                updated_on: true,
                wallet: {
                    // Include wallet data
                    select: {
                        id: true,
                        balance: true,
                        transactions: true, // Adjust based on your schema
                    },
                },
            },
        });

        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error: any) {
        console.error("Error updating user:", error);
        if (error instanceof ZodError) {
            const errors = error.errors.map((err) => err.message).join(", ");
            return NextResponse.json({ error: errors }, { status: 400 });
        }
        // Handle unique constraint violation (e.g., duplicate username)
        if (error.code === "P2002") {
            if (error.meta.target.includes("username")) {
                return NextResponse.json({ error: "Username already exists." }, { status: 409 });
            }
            return NextResponse.json({ error: "Unique constraint failed." }, { status: 409 });
        }
        return NextResponse.json({ error: "Error updating user." }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { userId: string } }) {
    try {
        // Authenticate the user using getServerSession
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Extract user information from session
        const userRole = session.user.role as Role;
        const userId = session.user.id as string;

        // Only admins can delete users
        if (userRole !== "admin") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Fetch the user by ID
        const user = await prisma.user.findUnique({
            where: { id: params.userId },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Delete the user
        const deletedUser = await prisma.user.delete({
            where: { id: params.userId },
            select: {
                id: true,
                username: true,
                name: true,
                email: true,
                image: true,
                phone: true,
                pix: true,
                role: true,
                valor_comissao: true,
                created_on: true,
                updated_on: true,
            },
        });

        return NextResponse.json(deletedUser, { status: 200 });
    } catch (error: any) {
        console.error("Error deleting user:", error);
        return NextResponse.json({ error: "Error deleting user." }, { status: 500 });
    }
}
