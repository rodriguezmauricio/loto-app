// stores/useUserStore.ts

import { create } from "zustand";
import { DefaultSession } from "next-auth";

type User = {
    id: string;
    username: string;
    role: string | null;
    adminId?: string | null;
    sellerId?: string | null;
    bancaName?: string | null; // Include bancaName here
} & DefaultSession["user"]; // Include name, email, image

interface UserStore {
    user: User | null;
    // Remove separate bancaName property
    // bancaName?: string;
    setUser: (user: User | null) => void;
    logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    logout: () => set({ user: null }),
}));
