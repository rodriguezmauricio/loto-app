import { sql } from "@vercel/postgres";
import { NextApiResponse, NextApiRequest } from "next";

export default async function handlerAddAdmins(request: NextApiRequest, response: NextApiResponse) {
  try {
    const username = request.query.username as string;
    const password = request.query.password as string;
    if (!username || !password) throw new Error("username and password are required");
    await sql`INSERT INTO admins (username, password) VALUES (${username}, ${password});`;
  } catch (error) {
    return response.status(500).json({ error });
  }

  const admins = await sql`SELECT * FROM admins;`;
  return response.status(200).json({ admins });
}
