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
    const users = await sql`SELECT * FROM sellers WHERE id = ${id};`;
    return Response.json(users.rows.length > 0 ? users : null);
}

export async function POST(request: Request) {
    const { username, password, phone, adminId, saldo, tipoComissao, valorComissao } =
        await request.json();

    const insertVendedor = await sql`
    INSERT INTO sellers (username, password_hash, phone, admin_id, saldo, tipo_comissao, valor_comissao)
    VALUES (${username}, ${password}, ${phone}, ${adminId}, ${saldo}, ${tipoComissao}, ${valorComissao});
    `;

    return insertVendedor;
}
