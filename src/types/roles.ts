// src/types/roles.ts

export type Role = "admin" | "vendedor" | "usuario";

// Optionally, define a User interface
export interface User {
    id: string;
    username: string;
    email: string;
    role: Role;
    // Add other relevant fields
}
