import { NextApiRequest, NextApiResponse } from "next";
import { sql } from "@vercel/postgres"; // Import the Vercel Postgres client
import bcrypt from "bcryptjs"; // Import bcrypt for password verification

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { username, password } = req.body;

        try {
            const adminResult = await sql`SELECT * FROM admins WHERE username = ${username};`;
            if (adminResult.rowCount && adminResult.rowCount > 0) {
                const admin = adminResult.rows[0];
                const isValidPassword = await bcrypt.compare(password, admin.password_hash);
                if (isValidPassword) {
                    return res.status(200).json({ id: admin.id, adminType: "admin" });
                }
            }

            // Check in sellers table
            const sellerResult = await sql`SELECT * FROM sellers WHERE username = ${username};`;
            if (sellerResult.rowCount && sellerResult.rowCount > 0) {
                const seller = sellerResult.rows[0];
                const isValidPassword = await bcrypt.compare(password, seller.password_hash);
                if (isValidPassword) {
                    return res.status(200).json({ id: seller.id, userType: "vendedor" });
                }
            }

            // Check in users table
            const userResult = await sql`SELECT * FROM users WHERE username = ${username};`;
            if (userResult.rowCount && userResult.rowCount > 0) {
                const user = userResult.rows[0];
                const isValidPassword = await bcrypt.compare(password, user.password_hash);
                if (isValidPassword) {
                    return res.status(200).json({ id: user.id, userType: "usuario" });
                }
            }

            // If no valid user is found
            return res.status(401).json({ message: "Invalid credentials" });
        } catch (error) {
            console.error("Error logging in:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    // Handle any other HTTP methods
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
}