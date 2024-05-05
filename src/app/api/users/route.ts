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
