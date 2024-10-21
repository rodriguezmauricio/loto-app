// src/app/api/users/route.ts
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
    try {
        const { username, password, phone, adminId, sellerId, pix, saldo } = await request.json();

        // Insert into users table and return the new user's id
        const result = await sql`
            INSERT INTO users (username, password_hash, phone, admin_id, seller_id, pix, saldo)
            VALUES (${username}, ${password}, ${phone}, ${adminId}, ${sellerId}, ${pix}, ${saldo})
            RETURNING id;  // Add RETURNING clause to get the newly created user's id
        `;

        const newUserId = result.rows[0]?.id; // Access the id of the newly created user

        // Respond with a success message
        return Response.json(
            { message: "User created successfully", id: newUserId },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error inserting user:", error);
        return Response.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
