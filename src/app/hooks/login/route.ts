import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import { prisma } from "@/lib/prisma"; // Adjust the import path as needed
import prisma from "../../../../prisma/client";

// Secret key for JWT (store this in your environment variables)
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json();

        // Fetch user from the database
        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (!user) {
            alert("usuário ou senha incorretos.");
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            alert("usuário ou senha incorretos.");
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // Create JWT payload
        const payload = {
            id: user.id,
            username: user.username,
            bancaName: user.bancaName,
            role: user.role,
        };

        // Sign JWT token
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

        // Set token in cookie (optional)
        const response = NextResponse.json({ message: "Login successful" });
        response.cookies.set("token", token, { httpOnly: true, maxAge: 3600 });

        return response;
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
