// components/SessionSync.tsx

"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useUserStore } from "../../store/useUserStore"; // Ensure correct path

const SessionSync = () => {
    const { data: session, status } = useSession();
    const setUser = useUserStore((state: any) => state.setUser);

    useEffect(() => {
        if (status === "authenticated" && session?.user) {
            setUser(session.user as any); // Cast if necessary
        } else {
            setUser(null);
        }
    }, [session, status, setUser]);

    return null;
};

export default SessionSync;
