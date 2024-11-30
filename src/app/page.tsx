"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const App: React.FC = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated") {
            router.replace("/dashboard");
        } else if (status === "unauthenticated") {
            router.replace("/login");
        }
        // If status is "loading", we wait without redirecting
    }, [status, router]);

    if (status === "loading") {
        return <p>Carregando...</p>; // You can replace this with a loading spinner or other UI
    }

    return null; // or a loading indicator
};

export default App;
