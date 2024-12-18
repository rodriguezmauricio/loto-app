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

export interface User {
    id: string;
    username: string;
    name: string | null; // Changed to allow null
    email: string;
    phone: string;
    pix: string;
    role: Role;
    admin_id: string | null;
    seller_id: string | null;
    created_on: string | number | Date;
    updated_on: string; // ISO date string
    wallet: Wallet | null;
    valor_comissao?: number;
    image?: string;
    emailVerified?: Date;
    bancaName?: string;
}

export interface Bilhete {
    id: string;
    numbers: string;
    created_at: Date;
    apostadorId: string;
}

export interface Bet {
    id: string;
    numbers: number[];
    modalidade: string;
    loteria: string | null; // Allow null
    userId: string;
    premio: number;
    createdAt: Date;
    vendedorId: string | null;
    user: User;
}

export interface Result {
    id: string;
    modalidade: string;
    loteria: string | null;
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

export interface Prize {
    id: string;
    amount: number;
    awarded_at: string;
    userId: string;
}
