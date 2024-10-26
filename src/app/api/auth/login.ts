// pages/api/auth/login.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { username, password } = req.body;

        try {
            // Retrieve the user from the database
            const user = await prisma.users.findUnique({
                where: { username },
            });

            if (!user) {
                return res.status(401).json({ error: "Invalid credentials" });
            }

            // Check the password
            const isPasswordValid = await bcrypt.compare(password, user.password_hash);
            if (!isPasswordValid) {
                return res.status(401).json({ error: "Invalid credentials" });
            }

            // Return user data without sensitive information
            const { password_hash, ...userData } = user;
            return res.status(200).json(userData);
        } catch (error) {
            return res.status(500).json({ error: "Server error" });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
