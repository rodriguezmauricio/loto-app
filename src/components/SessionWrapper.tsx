// src/components/SessionWrapper.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // Ensure correct import for Next.js 13+
import { useEffect } from "react";

interface SessionWrapperProps {
    children: React.ReactNode;
}

const SessionWrapper = ({ children }: SessionWrapperProps) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return; // Do nothing while loading
        if (!session) {
            router.push("/login"); // Use relative path directly
        }
    }, [session, status, router]);

    // Optionally, show a loading state while checking session
    if (status === "loading") {
        return <div>Loading...</div>;
    }

    return <>{children}</>;
};

export default SessionWrapper;
