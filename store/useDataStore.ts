// src/store/useDataStore.ts

import { create } from "zustand";
import { Apostador } from "../src/types/apostador"; // Corrected path

// Define other interfaces based on your Prisma schema
interface AppUser {
    id: string;
    username: string;
    role: "admin" | "vendedor" | "usuario";
    admin_id?: string | null;
    seller_id?: string | null;
    bancaName?: string | null;
    email?: string | null;
    name?: string | null;
    phone?: string | null;
    pix?: string | null;
}

interface Bet {
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
    createdAt: string; // ISO string date
    userId: string;
    vendedorId?: string | null;
    loteria?: string | null;
    user: AppUser;
    vendedor?: AppUser;
}

interface Result {
    id: string;
    modalidade: string;
    winningNumbers: number[];
    createdAt: string; // ISO date string
    premio: number;
    createdBy: string;
    loteria?: string | null;
    resultDate?: string | null; // ISO date
}

interface Wallet {
    id: string;
    userId: string;
    balance: number;
    createdAt: string;
    updatedAt: string;
}

interface Transaction {
    id: string;
    walletId: string;
    type: string;
    amount: number;
    description?: string;
    createdAt: string;
}

interface Prize {
    id: string;
    amount: number;
    awarded_at: string;
    userId: string;
}

interface FetchedData {
    users?: AppUser[];
    bets?: Bet[];
    results?: Result[];
    wallets?: Wallet[];
    transactions?: Transaction[];
    prizes?: Prize[];
}

// Merged store interface
interface DataStore {
    // Global arrays
    users: AppUser[];
    bets: Bet[];
    results: Result[];
    wallets: Wallet[];
    transactions: Transaction[];
    prizes: Prize[];

    // Apostadores state
    apostadores: Apostador[];
    loading: boolean;
    error: string | null;
    totalPages: number;

    setData: (data: Partial<FetchedData>) => void;

    // Bet methods
    updateBet: (updatedBet: Bet) => void;
    addBet: (newBet: Bet) => void;
    removeBet: (id: string) => void;

    // Result methods
    updateResult: (updatedResult: Result) => void;
    addResult: (newResult: Result) => void;
    removeResult: (id: string) => void;

    // Apostadores methods
    fetchApostadores: (search?: string, sort?: string, page?: number) => Promise<void>;
    deleteApostador: (id: string) => Promise<void>;
    getApostadorById: (id: string) => Apostador | null;
}

export const useDataStore = create<DataStore>((set, get) => ({
    users: [],
    bets: [],
    results: [],
    wallets: [],
    transactions: [],
    prizes: [],

    apostadores: [],
    loading: false,
    error: null,
    totalPages: 1,

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

    // Apostadores methods
    async fetchApostadores(search = "", sort = "name_asc", page = 1) {
        set({ loading: true, error: null });
        try {
            let sortField = "username";
            let sortOrder: "asc" | "desc" = "asc";
            switch (sort) {
                case "name_asc":
                    sortField = "username";
                    sortOrder = "asc";
                    break;
                case "name_desc":
                    sortField = "username";
                    sortOrder = "desc";
                    break;
                case "date_newest":
                    sortField = "created_on";
                    sortOrder = "desc";
                    break;
                case "date_oldest":
                    sortField = "created_on";
                    sortOrder = "asc";
                    break;
                default:
                    break;
            }

            const response = await fetch(
                `/api/users?search=${encodeURIComponent(
                    search
                )}&role=usuario&sortField=${sortField}&sortOrder=${sortOrder}&page=${page}&limit=10`
            );
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Erro ao buscar apostadores.");
            }
            const data = await response.json();
            if (!Array.isArray(data.apostadores)) {
                throw new Error("Formato de dados inesperado.");
            }

            set({
                apostadores: data.apostadores,
                totalPages: data.totalPages ?? 1,
                error: null,
            });
        } catch (err: any) {
            console.error("Error fetching apostadores:", err);
            set({ error: err.message || "Erro desconhecido.", apostadores: [], totalPages: 1 });
        } finally {
            set({ loading: false });
        }
    },

    async deleteApostador(id: string) {
        try {
            const response = await fetch(`/api/users/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Erro ao deletar apostador.");
            }
            // Remove from store
            const updated = get().apostadores.filter((a) => a.id !== id);
            set({ apostadores: updated });
            alert("Apostador deletado com sucesso.");
        } catch (err: any) {
            console.error("Error deleting apostador:", err);
            alert(err.message || "Erro desconhecido ao deletar apostador.");
        }
    },

    getApostadorById(id: string): Apostador | null {
        const apostador = get().apostadores.find((a) => a.id === id) || null;
        return apostador;
    },
}));
