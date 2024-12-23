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
    acertos: number;
    premio: number;
    consultor: string;
    apostador: string;
    quantidadeDeDezenas: number;
    resultado: string; // ISO string
    data: string; // ISO string
    hora: string;
    lote: string;
    tipoBilhete: string;
    valorBilhete: number;
    createdAt: string; // ISO string
    userId: string;
    vendedorId?: string;
    loteria?: string;
    user: User;
    vendedor?: User;
}

export interface Result {
    id: string;
    modalidade: string;
    winningNumbers: number[];
    createdAt: string; // ISO string
    premio: number;
    createdBy: string;
    loteria?: string;
    resultDate?: string; // ISO string
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
