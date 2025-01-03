// pages/api/auth/register.ts

import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../prisma/client";
import bcrypt from "bcrypt";

type Data = {
    message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    const { username, email, password, bancaName, role, name, image } = req.body;

    // Basic validation
    if (!username || !password || !bancaName || !role) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        // Check if username or email already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ username }, { email }],
            },
        });

        if (existingUser) {
            return res.status(409).json({ message: "Username or email already exists" });
        }

        // Hash the password
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        // Create the user along with the wallet using nested writes
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password_hash,
                bancaName,
                role,
                name,
                image,
                wallet: {
                    create: {
                        balance: 0.0, // Initialize wallet with a balance of 0
                    },
                },
            },
            include: {
                wallet: true, // Include wallet in the response if needed
            },
        });

        return res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
