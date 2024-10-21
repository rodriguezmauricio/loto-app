import { create } from "zustand";

interface AuthState {
    loggedInAdminId: string;
    setLoggedInAdminId: (id: string) => void;
    loggedInSellerId: string;
    setLoggedInSellerId: (id: string) => void;
    loggedInUserId: string;
    setLoggedInUserId: (id: string) => void;
}

const useStore = create<AuthState>((set) => ({
    loggedInAdminId: "",
    setLoggedInAdminId: (id) => set({ loggedInAdminId: id }),
    loggedInSellerId: "",
    setLoggedInSellerId: (id) => set({ loggedInSellerId: id }),
    loggedInUserId: "",
    setLoggedInUserId: (id) => set({ loggedInUserId: id }),
}));

export default useStore;
