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
    const { adminId, username, phone, saldo, tipoComissao, valorComissao, password } =
        await request.json();

    const insertVendedor = await sql`
    INSERT INTO sellers (admin_id, username, phone, saldo, tipo_comissao, valor_comissao, password_hash)
    VALUES (${adminId},${username}, ${phone}, ${saldo}, ${tipoComissao}, ${valorComissao}, ${tipoComissao}, ${valorComissao}, ${password}::text);
    `;

    return insertVendedor;
}
