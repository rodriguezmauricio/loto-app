// app/(authenticated)/layout.tsx

"use client";

import Menu from "components/menu/Menu";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUserStore } from "../../../store/useUserStore";
import "../../app/globals.css";
import LoadingSpinner from "components/loadingSpinner/LoadingSpinner";

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const setUser = useUserStore((state) => state.setUser);

    useEffect(() => {
        if (status === "authenticated" && session) {
            setUser({
                id: session.user.id,
                username: session.user.username,
                role: session.user.role,
            });
        } else if (status === "unauthenticated") {
            setUser(null);
        }
    }, [status, session, setUser]);

    if (status === "loading") {
        return (
            <div className="content">
                <LoadingSpinner />
            </div>
        );
    }

    if (status === "unauthenticated") {
        // Redirect to login if not authenticated
        router.push("/login");
        return null;
    }

    return (
        <div className="app-layout">
            <div className="sidebar">
                <Menu />
            </div>
            <div className="content">
                <main>{children}</main>
            </div>
        </div>
    );
}
