// src/types/roles.ts

export type Role = "admin" | "vendedor" | "usuario";

// Optionally, define a User interface
export interface User {
    name: string;
    phone: string;
    pix: string;
    created_on: string | number | Date;
    id: string;
    username: string;
    email: string;
    role: Role;
    // Add other relevant fields
}

export interface Bilhete {
    id: string;
    numbers: string;
    created_at: Date;
    apostadorId: string;
    // Other fields as necessary
}
