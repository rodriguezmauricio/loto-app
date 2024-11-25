// stores/useUserStore.ts

import { create } from "zustand";
import { DefaultSession } from "next-auth";

type User = {
    id: string;
    username: string;
    role: string | null;
    adminId?: string | null | undefined;
    sellerId?: string | null | undefined;
} & DefaultSession["user"]; // Include name, email, image

interface UserStore {
    user: User | null;
    setUser: (user: User | null) => void;
    logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    logout: () => set({ user: null }),
}));
