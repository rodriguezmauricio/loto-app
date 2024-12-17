// src/types/apostador.ts

export interface Wallet {
    id: string;
    balance: number;
    transactions: any[]; // Replace with a proper type if available
}

export interface Apostador {
    id: string;
    username: string;
    phone?: string;
    pix?: string | null; // Allows string, null, or undefined
    role: "admin" | "vendedor" | "usuario";
    admin_id?: string | null;
    seller_id?: string | null;
    created_on: string; // ISO date string
    wallet?: Wallet | null;
}
