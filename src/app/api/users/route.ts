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
    const {
        userType,
        username,
        password,
        phone,
        adminId,
        sellerId,
        pix,
        saldo,
        tipoComissao,
        valorComissao,
    } = await request.json();

    // const passwordHash = hashPassword(password);

    const insertAdmin = await sql`
        INSERT INTO admins (username, password_hash, saldo)
        VALUES (${username}, ${password}, ${saldo});
        `;

    const insertVendedor = await sql`
            INSERT INTO sellers (username, password_hash, phone, admin_id, saldo, tipo_comissao, valor_comissao)
            VALUES (${username}, ${password}, ${phone}, ${adminId}, ${saldo}, ${tipoComissao}, ${valorComissao});
            `;

    const insertUsuario =
        await sql`INSERT INTO users (username, password_hash, phone, admin_id, seller_id, pix, saldo)
            VALUES (${username}, ${password}, ${phone}, ${adminId}, ${sellerId}, ${pix}, ${saldo});
            `;

    if (userType === "admin") {
        return insertAdmin;
    } else if (userType === "vendedor") {
        return insertVendedor;
    } else if (userType === "usuario") {
        return insertUsuario;
    } else {
        throw new Error("Invalid user type");
    }
}
