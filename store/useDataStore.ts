import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Apostador, Aposta } from "../src/types/apostador";
import { User, Bet, Result, Wallet, Transaction, Prize } from "../src/types/roles";

interface FetchedData {
    users?: User[];
    bets?: Bet[];
    results?: Result[];
    wallets?: Wallet[];
    transactions?: Transaction[];
    prizes?: Prize[];
}

interface DataStore {
    // **Global State**
    users: User[];
    bets: Bet[];
    results: Result[];
    wallets: Wallet[];
    transactions: Transaction[];
    prizes: Prize[];

    // **Apostadores State**
    apostadores: Apostador[];
    loading: boolean;
    error: string | null;
    totalPages: number;
    currentPage: number;

    // **Tickets State**
    tickets: Aposta[];
    loadingTickets: boolean;
    errorTickets: string | null;
    totalPagesTickets: number;
    currentPageTickets: number;

    // Wallet State
    walletBalance: number;
    loadingWallet: boolean;
    errorWallet: string | null;

    // Wallet Methods
    fetchWalletBalance: (userId: string) => Promise<void>;

    // **Set Data Method**
    setData: (data: Partial<FetchedData>) => void;

    // **Apostadores Methods**
    fetchApostadores: (
        search?: string,
        sort?: string,
        page?: number,
        limit?: number
    ) => Promise<void>;
    deleteApostador: (id: string) => Promise<void>;
    getApostadorById: (id: string) => Apostador | null;

    // **Tickets Methods**
    fetchTickets: (userId: string, page?: number, limit?: number) => Promise<void>;
    deleteTicket: (id: string) => Promise<void>;
}

export const useDataStore = create<DataStore>()(
    devtools(
        (set, get) => ({
            // **Global State Initialization**
            users: [],
            bets: [],
            results: [],
            wallets: [],
            transactions: [],
            prizes: [],

            // **Apostadores State Initialization**
            apostadores: [],
            loading: false,
            error: null,
            totalPages: 1,
            currentPage: 1,

            // **Tickets State Initialization**
            tickets: [],
            loadingTickets: false,
            errorTickets: null,
            totalPagesTickets: 1,
            currentPageTickets: 1,

            // Wallet State Initialization
            walletBalance: 0,
            loadingWallet: false,
            errorWallet: null,

            /**
             * setData - merges fetched data into the store if present,
             * or keeps existing state otherwise.
             */
            setData: (data: Partial<FetchedData>) =>
                set((state) => ({
                    users: data.users ?? state.users,
                    bets: data.bets ?? state.bets,
                    results: data.results ?? state.results,
                    wallets: data.wallets ?? state.wallets,
                    transactions: data.transactions ?? state.transactions,
                    prizes: data.prizes ?? state.prizes,
                })),

            // **Apostadores Methods**

            async fetchApostadores(search = "", sort = "name_asc", page = 1, limit = 10) {
                console.log(
                    `Fetching apostadores: search="${search}", sort="${sort}", page=${page}, limit=${limit}`
                );
                set({ loading: true, error: null });

                try {
                    let sortField = "username";
                    let sortOrder: "asc" | "desc" = "asc";

                    // Determine sort field and order based on sort option
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

                    // Construct the API URL with query parameters
                    const url = `/api/users?search=${encodeURIComponent(
                        search
                    )}&role=usuario&sortField=${sortField}&sortOrder=${sortOrder}&page=${page}&limit=${limit}`;

                    const response = await fetch(url);

                    console.log(`GET ${url} - Status: ${response.status}`);

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || "Erro ao buscar apostadores.");
                    }

                    const data = await response.json();

                    // Validate response structure
                    if (!Array.isArray(data.apostadores) || typeof data.totalPages !== "number") {
                        throw new Error("Formato de dados inesperado.");
                    }

                    console.log("Fetched apostadores:", data.apostadores);
                    console.log("Total Pages:", data.totalPages);

                    set({
                        apostadores: data.apostadores,
                        totalPages: data.totalPages,
                        currentPage: data.currentPage || page,
                        error: null,
                    });
                } catch (err: any) {
                    console.error("Error fetching apostadores:", err);
                    set({
                        error: err.message || "Erro desconhecido.",
                        apostadores: [],
                        totalPages: 1,
                    });
                } finally {
                    set({ loading: false });
                }
            },

            async deleteApostador(id: string) {
                console.log(`Deleting apostador with ID: ${id}`);
                try {
                    const response = await fetch(`/api/users/${id}`, {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" },
                    });

                    console.log(`DELETE /api/users/${id} - Status: ${response.status}`);

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || "Erro ao deletar apostador.");
                    }

                    // Remove the deleted apostador from the store
                    const updatedApostadores = get().apostadores.filter((a) => a.id !== id);
                    set({ apostadores: updatedApostadores });

                    console.log(`Apostador with ID ${id} deleted successfully.`);
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

            // **Tickets Methods**

            async fetchTickets(userId: string, page = 1, limit = 10) {
                console.log(
                    `Fetching tickets for userId: ${userId}, page: ${page}, limit: ${limit}`
                );
                set({ loadingTickets: true, errorTickets: null });

                try {
                    const url = `/api/apostas?userId=${userId}&page=${page}&limit=${limit}`;
                    const response = await fetch(url, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                    });

                    console.log(`GET ${url} - Status: ${response.status}`);

                    if (!response.ok) {
                        let errorData;
                        try {
                            errorData = await response.json();
                        } catch (jsonError) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        throw new Error(errorData.error || "Erro ao buscar bilhetes.");
                    }

                    const data = await response.json();
                    console.log("API Response:", data);

                    // Validate response structure
                    if (
                        !data ||
                        !Array.isArray(data.bets) ||
                        typeof data.totalItems !== "number" ||
                        typeof data.totalPages !== "number" ||
                        typeof data.currentPage !== "number"
                    ) {
                        console.error("Unexpected data format:", data);
                        throw new Error("Formato de dados inesperado.");
                    }

                    console.log("Fetched tickets:", data.bets);
                    console.log("Total Pages:", data.totalPages);

                    set({
                        tickets: data.bets,
                        totalPagesTickets: data.totalPages,
                        currentPageTickets: data.currentPage,
                        errorTickets: null,
                    });
                } catch (err: any) {
                    console.error("Error fetching tickets:", err);
                    set({
                        errorTickets: err.message || "Erro desconhecido.",
                        tickets: [],
                        totalPagesTickets: 1,
                        currentPageTickets: 1,
                    });
                } finally {
                    set({ loadingTickets: false });
                }
            },

            async deleteTicket(id: string) {
                console.log(`Deleting ticket with ID: ${id}`);
                try {
                    const response = await fetch(`/api/apostas/${id}`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                    });

                    console.log(`DELETE /api/apostas/${id} - Status: ${response.status}`);

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || "Erro ao deletar bilhete.");
                    }

                    // Remove the deleted ticket from the store
                    const updatedTickets = get().tickets.filter((ticket) => ticket.id !== id);
                    set({ tickets: updatedTickets });

                    console.log(`Ticket with ID ${id} deleted successfully.`);
                    alert("Bilhete deletado com sucesso.");
                } catch (err: any) {
                    console.error("Error deleting ticket:", err);
                    alert(err.message || "Erro desconhecido ao deletar bilhete.");
                }
            },

            // Wallet Methods
            async fetchWalletBalance(userId: string) {
                console.log(`Fetching wallet balance for userId: ${userId}`);
                set({ loadingWallet: true, errorWallet: null });

                try {
                    const url = `/api/wallet?userId=${userId}`;
                    const response = await fetch(url, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                    });

                    console.log(`GET ${url} - Status: ${response.status}`);

                    if (!response.ok) {
                        let errorData;
                        try {
                            errorData = await response.json();
                        } catch (jsonError) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        throw new Error(errorData.error || "Erro ao buscar saldo da carteira.");
                    }

                    const data = await response.json();
                    console.log("Fetched wallet balance:", data);

                    // Validate response structure
                    if (!data || typeof data.balance !== "number") {
                        console.error("Unexpected wallet data format:", data);
                        throw new Error("Formato de dados inesperado para carteira.");
                    }

                    set({
                        walletBalance: data.balance,
                        errorWallet: null,
                    });
                } catch (err: any) {
                    console.error("Error fetching wallet balance:", err);
                    set({
                        errorWallet: err.message || "Erro desconhecido.",
                        walletBalance: 0,
                    });
                } finally {
                    set({ loadingWallet: false });
                }
            },
        }),
        {
            name: "DataStore", // Unique name for Zustand Devtools
        }
    )
);
