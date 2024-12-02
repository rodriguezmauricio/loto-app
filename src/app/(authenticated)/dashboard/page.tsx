"use client";

import PageHeader from "components/pageHeader/PageHeader";
import styles from "./dashboard.module.scss";
import Title from "components/title/Title";
import Card from "components/card/Card";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ProtectedRoute from "components/ProtectedRoute";
import { useEffect, useState } from "react";
import { DashboardData } from "../../../types/dashboard";

const DashboardPage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (status === "loading") return; // Do nothing while loading
        if (!session) {
            router.push("/login");
            return;
        }

        const fetchDashboardData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch("/api/dashboard", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include", // Include credentials
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Erro ao buscar dados do dashboard.");
                }

                const data: DashboardData = await response.json();
                setDashboardData(data);
            } catch (err: any) {
                console.error("Error fetching dashboard data:", err);
                setError(err.message || "Erro desconhecido.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [session, status, router]);

    if (status === "loading" || loading) {
        return (
            <>
                <PageHeader title="Dashboard" subpage={false} linkTo={""} />
                <main className="main">
                    <p>Carregando dashboard...</p>
                </main>
            </>
        );
    }

    if (error) {
        return (
            <>
                <PageHeader title="Dashboard" subpage={false} linkTo={""} />
                <main className="main">
                    <p>Erro: {error}</p>
                </main>
            </>
        );
    }

    return (
        <ProtectedRoute requiredRole={"admin"} currentUserRole={session?.user.role}>
            <PageHeader title="Dashboard" subpage={false} linkTo={""} />
            <main className="main">{/* ... [Rest of your dashboard content] */}</main>
        </ProtectedRoute>
    );
};

export default DashboardPage;
