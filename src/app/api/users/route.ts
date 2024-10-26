// route.ts

import { hashPassword } from "@/app/utils/crypt";
import { sql } from "@vercel/postgres";

// Function to create an Admin
async function POSTADMIN(data: any) {
    const { username, password, saldo, saldoCarteira, phone, pix, tipoComissao, valorComissao } =
        data;
    const hashedPassword = await hashPassword(password);

    const insertAdmin = await sql`
        INSERT INTO users (username, password_hash, saldo, saldo_carteira, phone, pix, tipo_comissao, valor_comissao, role)
        VALUES (${username}, ${hashedPassword}, ${saldo}, ${saldoCarteira}, ${phone}, ${pix}, ${tipoComissao}, ${valorComissao}, 'admin')
        RETURNING *;
    `;

    return Response.json(insertAdmin.rows.length > 0 ? insertAdmin.rows : null);
}

// Function to create a Seller
async function POSTSELLER(data: any) {
    const {
        username,
        password,
        saldo,
        saldoCarteira,
        phone,
        pix,
        tipoComissao,
        valorComissao,
        adminId,
    } = data;
    const hashedPassword = await hashPassword(password);

    const insertSeller = await sql`
        INSERT INTO users (username, password_hash, saldo, saldo_carteira, phone, admin_id, pix, tipo_comissao, valor_comissao, role)
        VALUES (${username}, ${hashedPassword}, ${saldo}, ${saldoCarteira}, ${phone}, ${adminId}, ${pix}, ${tipoComissao}, ${valorComissao}, 'vendedor')
        RETURNING *;
    `;

    return Response.json(insertSeller.rows.length > 0 ? insertSeller.rows : null);
}

// Function to create a User
async function POSTUSER(data: any) {
    const {
        username,
        password,
        saldo,
        saldoCarteira,
        phone,
        pix,
        tipoComissao,
        valorComissao,
        adminId,
        sellerId,
    } = data;
    const hashedPassword = await hashPassword(password);

    const insertUser = await sql`
        INSERT INTO users (username, password_hash, saldo, saldo_carteira, phone, admin_id, seller_id, pix, tipo_comissao, valor_comissao, role)
        VALUES (${username}, ${hashedPassword}, ${saldo}, ${saldoCarteira}, ${phone}, ${adminId}, ${sellerId}, ${pix}, ${tipoComissao}, ${valorComissao}, 'usuario')
        RETURNING *;
    `;

    return Response.json(insertUser.rows.length > 0 ? insertUser.rows : null);
}

// Main POST handler that routes to the appropriate function based on user type
export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { type } = data;

        switch (type) {
            case "admin":
                return POSTADMIN(data);
            case "vendedor":
                return POSTSELLER(data);
            case "usuario":
                return POSTUSER(data);
            default:
                return Response.json({ error: "Invalid user type" }, { status: 400 });
        }
    } catch (error) {
        console.error("Error in POST handler:", error);
        return Response.json({ error: "Server error. Please try again later." }, { status: 500 });
    }
}
