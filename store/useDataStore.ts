// src/store/useDataStore.ts
import { create } from "zustand";

// Define TypeScript interfaces based on your Prisma schema

// Basic User interface (client-side)
interface AppUser {
    id: string;
    username: string;
    role: "admin" | "vendedor" | "usuario";
    admin_id?: string | null;
    seller_id?: string | null;
    bancaName?: string | null;
    // Add fields as needed: email, name, etc.
    email?: string | null;
    name?: string | null;
    phone?: string | null;
    pix?: string | null;
}

// Bet interface
interface Bet {
    id: string;
    numbers: number[];
    modalidade: string;
    acertos: number;
    premio: number;
    consultor: string;
    apostador: string;
    quantidadeDeDezenas: number;
    resultado: string; // Date as ISO string in the frontend
    data: string; // Date as ISO string
    hora: string;
    lote: string;
    tipoBilhete: string;
    valorBilhete: number;
    createdAt: string; // ISO string date
    userId: string;
    vendedorId?: string | null;
    loteria?: string | null;
    user: AppUser;
    vendedor?: AppUser;
}

// Result interface
interface Result {
    id: string;
    modalidade: string;
    winningNumbers: number[];
    createdAt: string; // ISO date string
    premio: number;
    createdBy: string;
    loteria?: string | null;
    resultDate?: string | null; // new field as ISO date string
}

// Wallet interface
interface Wallet {
    id: string;
    userId: string;
    balance: number;
    createdAt: string;
    updatedAt: string;
}

// Transaction interface
interface Transaction {
    id: string;
    walletId: string;
    type: string;
    amount: number;
    description?: string;
    createdAt: string;
}

// Prize interface
interface Prize {
    id: string;
    amount: number;
    awarded_at: string;
    userId: string;
}

// Data fetched from the DB (example structure)
// Adjust depending on what you actually return from your API
interface FetchedData {
    users: AppUser[];
    bets: Bet[];
    results: Result[];
    wallets: Wallet[];
    transactions: Transaction[];
    prizes: Prize[];
}

interface DataStore {
    users: AppUser[];
    bets: Bet[];
    results: Result[];
    wallets: Wallet[];
    transactions: Transaction[];
    prizes: Prize[];

    setData: (data: Partial<FetchedData>) => void;

    // Update methods
    updateBet: (updatedBet: Bet) => void;
    addBet: (newBet: Bet) => void;
    removeBet: (id: string) => void;

    updateResult: (updatedResult: Result) => void;
    addResult: (newResult: Result) => void;
    removeResult: (id: string) => void;

    // Similar methods can be created for users, wallets, etc.
}

// Create the store
export const useDataStore = create<DataStore>((set) => ({
    users: [],
    bets: [],
    results: [],
    wallets: [],
    transactions: [],
    prizes: [],

    setData: (data) =>
        set((state) => ({
            users: data.users ?? state.users,
            bets: data.bets ?? state.bets,
            results: data.results ?? state.results,
            wallets: data.wallets ?? state.wallets,
            transactions: data.transactions ?? state.transactions,
            prizes: data.prizes ?? state.prizes,
        })),

    // Bet methods
    updateBet: (updatedBet) =>
        set((state) => ({
            bets: state.bets.map((b) => (b.id === updatedBet.id ? updatedBet : b)),
        })),
    addBet: (newBet) =>
        set((state) => ({
            bets: [...state.bets, newBet],
        })),
    removeBet: (id) =>
        set((state) => ({
            bets: state.bets.filter((b) => b.id !== id),
        })),

    // Result methods
    updateResult: (updatedResult) =>
        set((state) => ({
            results: state.results.map((r) => (r.id === updatedResult.id ? updatedResult : r)),
        })),
    addResult: (newResult) =>
        set((state) => ({
            results: [...state.results, newResult],
        })),
    removeResult: (id) =>
        set((state) => ({
            results: state.results.filter((r) => r.id !== id),
        })),
}));
