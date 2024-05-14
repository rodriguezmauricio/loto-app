// HEADER: Previous code fof routes.ts
/* import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function insertUser(username: string, password: string) {
  // const { searchParams } = new URL(request.url);

  try {
    if (!username || !password) throw new Error("Usuário ou senha inválidos.");
    await sql`INSERT INTO credentials (credential_id, user_id, username, password_hash, created_at)
    VALUES (${username}, ${password});`;
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  const usersCredentials = await sql`SELECT * FROM credentials;`;
  return NextResponse.json({ usersCredentials }, { status: 200 });
} */

import { NextApiRequest, NextApiResponse } from "next";
import { insertUser, deleteUser, updateUser, getUserById } from "./controller";

// Route handler to create a new user:
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      //extract user data from request body
      const {
        adminId,
        sellerId,
        name,
        username,
        email,
        password,
        wallet,
        pix,
        isComissionPercentual,
        comissionValue,
      } = req.body;

      //insert new user into the database
      const newUser = await insertUser(
        adminId,
        sellerId,
        name,
        username,
        email,
        password,
        wallet,
        pix,
        isComissionPercentual,
        comissionValue
      );

      res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
    }
  } else if (req.method === "GET") {
    try {
      //extract user Id from query parameters
      const userId = req.query.id as string;

      //fetch user ta from database
      const user = await getUserById(userId);

      //respond with user data
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: "Usuário não encontrado." });
      }
    } catch (error) {
      console.error("Erro ao buscar usuário: ", error);
      res.status(500).json({ error: "Não foi possível encontrar o usuário." });
    }
  } else if (req.method === "PUT") {
    //
    try {
      const userId = req.query.id as string;

      const { name, email } = req.body;

      const updatedUser = await updateUser(userId, { name, email });

      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Erro ao atualizar usuário: ", error);
      res.status(500).json({ error: "Falha ao atualizar usuário." });
    }
  } else if (req.method === "DELETE") {
    try {
      //extract user Id from query parameters
      const userId = req.query.id as string;
      await deleteUser(userId);
      res.status(204).end();
    } catch (error) {
      console.error("Erro ao deletar usuário: ", error);
      res.status(500).json({ error: "Falha ao remover usuário." });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
