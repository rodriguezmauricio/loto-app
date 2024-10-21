// src/app/api/sellers/route.ts
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
    const sellers = await sql`SELECT * FROM sellers WHERE id = ${id};`;
    return Response.json(sellers.rows.length > 0 ? sellers : null);
}

export async function POST(request: Request) {
    try {
        const { adminId, username, phone, saldo, tipoComissao, valorComissao, password } =
            await request.json();

        // Insert into sellers table and return the new seller's id
        const result = await sql`
            INSERT INTO sellers (admin_id, username, phone, saldo, tipo_comissao, valor_comissao, password_hash)
            VALUES (${adminId}, ${username}, ${phone}, ${saldo}, ${tipoComissao}, ${valorComissao}, ${password})
            RETURNING id;  // Add RETURNING clause to get the newly created seller's id
        `;

        const newSellerId = result.rows[0]?.id; // Access the id of the newly created seller

        // Respond with a success message
        return Response.json(
            { message: "Seller created successfully", id: newSellerId },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error inserting seller:", error);
        return Response.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
