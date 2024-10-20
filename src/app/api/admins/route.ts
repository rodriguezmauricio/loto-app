import { sql } from "@vercel/postgres";
import { hashPassword } from "@/app/utils/utils";

export async function GET(
    request: Request,
    {
        params,
    }: {
        params: {
            id: string;
        };
    }
) {
    const { id } = params;
    const users = await sql`SELECT * FROM users WHERE id = ${id};`;
    return Response.json(users.rows.length > 0 ? users : null);
}

export async function POST(request: Request) {
    const { username, password, saldo } = await request.json();

    // const passwordHash = hashPassword(password);

    const insertAdmin = await sql`
        INSERT INTO admins (username, password_hash, saldo)
        VALUES (${username}, ${password}, ${saldo});
        `;

    return insertAdmin;
}
