import { NextApiRequest, NextApiResponse } from "next";
import client from "../../../../../lib/db"; // Ensure the path is correct
import bcrypt from "bcrypt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { username, password } = req.body;

      await client.connect();
      const result = await client.query("SELECT * FROM users WHERE username = $1", [username]);
      await client.end();

      const user = result.rows[0];

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid password" });
      }

      res.status(200).json({ message: "Login successful", user });
    } catch (error) {
      console.error("Error authenticating user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
