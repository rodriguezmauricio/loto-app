// src/app/api/users/route.ts

import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/authOptions";
import bcrypt from "bcrypt";
import { Role } from "../../../types/roles";
import { createUserSchema } from "../../../validation/userValidation";
import { ZodError } from "zod";

// Helper functions
const isAdmin = (role: Role): boolean => role === "admin";
const isVendedor = (role: Role): boolean => role === "vendedor";

/**
 * Handles GET and POST requests for /api/users
 */
export async function GET(request: Request) {
    try {
        // Authenticate the user using getServerSession
        const session = await getServerSession(authOptions);

        console.log("GET /api/users - Session:", session);

        if (!session) {
            console.log("GET /api/users - Unauthorized");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Extract user information from session
        const userRole = session.user.role as Role;
        const userId = session.user.id as string;

        // Extract query parameters
        const url = new URL(request.url);
        const search = url.searchParams.get("search") || "";
        const sortField = url.searchParams.get("sortField") || "username";
        const sortOrder = url.searchParams.get("sortOrder") || "asc";
        const page = parseInt(url.searchParams.get("page") || "1", 10);
        const limit = parseInt(url.searchParams.get("limit") || "10", 10);
        const role = url.searchParams.get("role");
        const skip = (page - 1) * limit;

        console.log("GET /api/users - Params:", {
            search,
            sortField,
            sortOrder,
            page,
            limit,
            role,
        });

        // Define allowed roles
        const allowedRoles = ["vendedor", "usuario"];
        if (!role || !allowedRoles.includes(role)) {
            return NextResponse.json({ error: "Invalid role specified." }, { status: 400 });
        }

        // Define sorting
        const validSortFields = ["username", "created_on"];
        const validSortOrders = ["asc", "desc"];

        const appliedSortField = validSortFields.includes(sortField) ? sortField : "username";
        const appliedSortOrder = validSortOrders.includes(sortOrder) ? sortOrder : "asc";

        // Define filtering
        const where: any = {
            role: role, // Filter by role
        };

        if (search) {
            where.username = { contains: search, mode: "insensitive" };
        }

        // Role-based access control
        let userFilter = {};

        if (isAdmin(userRole)) {
            // Admin can see all users or based on additional logic
            userFilter = {
                OR: [{ admin_id: userId }, { seller_id: { in: await getSellersIds(userId) } }],
            };
        } else if (isVendedor(userRole)) {
            // Vendedor can see only users they created
            userFilter = { seller_id: userId };
        } else {
            // Regular users shouldn't access this endpoint
            console.log("GET /api/users - Forbidden");
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Combine filters
        if (Object.keys(userFilter).length > 0) {
            where.AND = userFilter;
        }

        // Fetch total count for pagination
        const totalCount = await prisma.user.count({
            where,
        });

        const totalPages = Math.ceil(totalCount / limit);

        console.log("GET /api/users - Total Count:", totalCount, "Total Pages:", totalPages);

        // Fetch users
        const users = await prisma.user.findMany({
            where,
            orderBy: {
                [appliedSortField]: appliedSortOrder,
            },
            skip,
            take: limit,
            select: {
                id: true,
                username: true,
                name: true,
                email: true,
                image: true,
                phone: true,
                pix: true,
                role: true, // Include role for frontend use
                created_on: true,
            },
        });

        console.log("GET /api/users - Users Fetched:", users.length);

        // Modify response field based on role
        const responseData =
            role === "vendedor"
                ? { vendedores: users, totalPages }
                : { apostadores: users, totalPages };

        return NextResponse.json(responseData, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ error: "Error fetching users." }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        // Authenticate the user using getServerSession
        const session = await getServerSession(authOptions);

        console.log("POST /api/users - Session:", session);

        if (!session) {
            console.log("POST /api/users - Unauthorized");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Extract user information from session
        const userRole = session.user.role as Role;
        const userId = session.user.id as string;

        // Parse and validate the request body
        const body = await request.json();
        const parsed = createUserSchema.parse(body);

        const { username, password, phone, pix, role, valor_comissao } = parsed;

        console.log("POST /api/users - Body:", { username, phone, pix, role, valor_comissao });

        // Ensure the session user's role is allowed to create users with the specified role
        if (role === "admin" && !isAdmin(userRole)) {
            console.log("POST /api/users - Forbidden: Only admins can create admin users.");
            return NextResponse.json(
                { error: "Forbidden: Only admins can create admin users." },
                { status: 403 }
            );
        }

        if ((role === "vendedor" || role === "usuario") && !isAdmin(userRole)) {
            console.log(
                "POST /api/users - Forbidden: Only admins can create vendedores or apostadores."
            );
            return NextResponse.json(
                { error: "Forbidden: Only admins can create vendedores or apostadores." },
                { status: 403 }
            );
        }

        // If role is 'vendedor', 'valor_comissao' is required
        if (role === "vendedor" && (valor_comissao === undefined || valor_comissao === null)) {
            console.log("POST /api/users - Bad Request: Comissão é obrigatória para vendedores.");
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
            adminId = userId;
        } else if (isVendedor(userRole)) {
            sellerId = userId;
        }

        // Check if the username already exists
        const existingUser = await prisma.user.findUnique({
            where: { username },
        });

        if (existingUser) {
            console.log("POST /api/users - Conflict: Username already exists.");
            return NextResponse.json({ error: "Username already exists." }, { status: 409 });
        }

        // Create the user in the database with a Wallet if necessary
        const newUser = await prisma.user.create({
            data: {
                username,
                password_hash: hashedPassword,
                phone,
                pix: pix || "sem pix",
                name: body.name || null,
                email: body.email || null,
                image: body.picture || null,
                admin_id: adminId,
                seller_id: sellerId,
                role,
                valor_comissao: valor_comissao || null,
                // Assuming you have a wallet field or relation
                // wallet: {
                //     create: { balance: 0 },
                // },
            },
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

        console.log("POST /api/users - User Created:", newUser.username);

        return NextResponse.json(newUser, { status: 201 });
    } catch (error: any) {
        console.error("Error creating user:", error);
        if (error instanceof ZodError) {
            console.log("POST /api/users - Validation Error:", error.errors);
            return NextResponse.json(
                { error: error.errors.map((err) => err.message) },
                { status: 400 }
            );
        }
        // Handle unique constraint violation (e.g., duplicate username or wallet)
        if (error.code === "P2002") {
            if (error.meta.target.includes("username")) {
                console.log("POST /api/users - Conflict: Username already exists.");
                return NextResponse.json({ error: "Username already exists." }, { status: 409 });
            }
            console.log("POST /api/users - Conflict: Unique constraint failed.");
            return NextResponse.json({ error: "Unique constraint failed." }, { status: 409 });
        }
        console.log("POST /api/users - Internal Server Error.");
        return NextResponse.json({ error: "Error creating user." }, { status: 500 });
    }
}

// Helper function to get sellers' IDs for an admin
async function getSellersIds(adminId: string): Promise<string[]> {
    const sellers = await prisma.user.findMany({
        where: { admin_id: adminId, role: "vendedor" },
        select: { id: true },
    });
    return sellers.map((seller) => seller.id);
}
