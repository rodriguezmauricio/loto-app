// src/app/api/admins/route.ts
import { sql } from "@vercel/postgres";
import { hashPassword } from "@/app/utils/utils"; // Import your hashing function

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
        const { username, password, saldo } = await request.json();

        // Hash the password using the external function
        const passwordHash = await hashPassword(password); // Ensure this returns a Promise<string>

        // Insert into admins table and return the new admin's id
        const result = await sql`
            INSERT INTO admins (username, password_hash, saldo)
            VALUES (${username}, ${passwordHash}, ${saldo})
            RETURNING id;  // Return the newly created admin's id
        `;

        const newAdminId = result.rows[0]?.id; // Retrieve the id from the result

        // Respond with a success message
        return Response.json(
            { message: "Admin created successfully", id: newAdminId },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error inserting admin:", error);
        return Response.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
