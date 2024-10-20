import { sql } from "@vercel/postgres";

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
    const { username, password, phone, adminId, sellerId, pix, saldo } = await request.json();

    const insertUsuario =
        await sql`INSERT INTO users (username, password_hash, phone, admin_id, seller_id, pix, saldo)
            VALUES (${username}, ${password}, ${phone}, ${adminId}, ${sellerId}, ${pix}, ${saldo});
            `;

    return insertUsuario;
}
