import { hashPassword } from "@/app/utils/crypt";
import { sql } from "@vercel/postgres";

export async function POST(request: Request) {
    const { username, password, saldo, saldoCarteira, phone } = await request.json();

    const hashedPassword = hashPassword(password);

    const insertUser =
        await sql`INSERT INTO users (username, password_hash, saldo, saldo_carteira, phone) VALUES
        (${username}, ${password}, ${saldo}, ${saldoCarteira}, ${phone})`;

    return Response.json(insertUser.rows.length > 0 ? insertUser.rows : null);
}
