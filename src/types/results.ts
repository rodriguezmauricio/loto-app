// types/results.ts

import { Role } from "../types/roles"; // Adjust the path as necessary

export interface User {
    id: string;
    username: string;
    name: string | null; // Reflects Prisma's nullable field
    role: Role;
    admin_id: string | null;
    seller_id: string | null;
}

export interface Bet {
    id: string;
    numbers: number[]; // Array of integers
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
    loteria: string;
    winningNumbers: number[]; // Array of integers
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
