// stores/useUserStore.ts

import { create } from "zustand";
import { DefaultSession, Session } from "next-auth";

type User = {
    id: string;
    username: string;
    role: string | null;
    adminId?: string | null;
    sellerId?: string | null;
    bancaName: string | null;
    email: string | null;
    name: string | null;
} & Session["user"];

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
