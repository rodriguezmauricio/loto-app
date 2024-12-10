// src/types/roles.ts

export type Role = "admin" | "vendedor" | "usuario";

export interface Transaction {
    id: string;
    type: "add" | "subtract";
    amount: number;
    date: string; // ISO date string
    description?: string;
}
export interface Wallet {
    id: string;
    balance: number;
    transactions: Transaction[];
}

// Optionally, define a User interface
export interface User {
    id: string;
    username: string;
    name: string;
    email: string;
    phone: string;
    pix: string;
    role: Role;
    admin_id: string | null;
    seller_id: string | null;
    created_on: string | number | Date;
    updated_on: string; // ISO date string
    wallet: Wallet | null;
    // Add other relevant fields
}

export interface Bilhete {
    id: string;
    numbers: string;
    created_at: Date;
    apostadorId: string;
    // Other fields as necessary
}

export interface Bet {
    id: string;
    numbers: number[];
    modalidade: string;
    loteria: string;
    userId: string;
    premio: number;
    createdAt: Date;
    vendedorId: string | null;
    user: User;
}

export interface Result {
    id: string;
    modalidade: string;
    loteria?: string;
    winningNumbers: number[];
    createdAt: Date;
    premio: number;
    createdBy: string;
}

export interface Winner {
    id: string;
    numbers: number[];
    modalidade: string;
    loteria: string;
    userId: string;
    userName: string;
    sorteioDate: string;
    premio: number;
    betPlacedDate: string;
}
