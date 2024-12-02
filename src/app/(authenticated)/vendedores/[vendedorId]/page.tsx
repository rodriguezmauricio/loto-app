// src/app/(authenticated)/vendedores/[vendedorId]/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import VendedorDetails from "components/vendedores/vendedorDetails";
import { User } from "../../../../types/user"; // Ensure correct path
import { Role } from "../../../../types/roles"; // Ensure correct path
import ProtectedRoute from "components/ProtectedRoute";
import { ROUTES } from "@routes/routes"; // Ensure correct path
import Breadcrumbs from "components/breadcrumbs/Breadcrumbs";
import PageHeader from "components/pageHeader/PageHeader";
import styles from "./VendedorPage.module.css";

interface VendedorPageProps {
    params: { vendedorId: string };
}

const VendedorPage: React.FC<VendedorPageProps> = ({ params }) => {
    const { vendedorId } = params;
    const [vendedor, setVendedor] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch the vendedor data from the User API
    useEffect(() => {
        const fetchVendedor = async () => {
            try {
                const res = await fetch(`/api/users/${vendedorId}`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    cache: "no-store",
                });

                if (!res.ok) {
                    if (res.status === 404) {
                        setError("Vendedor não encontrado.");
                    } else {
                        const errorData = await res.json();
                        setError(errorData.error || "Erro ao buscar vendedor.");
                    }
                    setLoading(false);
                    return;
                }

                const data: User = await res.json();
                if (data.role !== "vendedor") {
                    setError("O usuário não é um vendedor.");
                    setLoading(false);
                    return;
                }
                setVendedor(data);
            } catch (err: any) {
                console.error("Error fetching vendedor:", err);
                setError("Erro ao buscar vendedor.");
            } finally {
                setLoading(false);
            }
        };

        fetchVendedor();
    }, [vendedorId]);

    // Replace this with actual authentication logic to get the current user's role
    const currentUserRole: Role = "admin"; // Example role

    const breadcrumbs = [
        { href: ROUTES.HOME, label: "Home" },
        { href: ROUTES.VENDEDORES, label: "Vendedores" },
        { href: ROUTES.VENDEDOR(vendedorId), label: `Vendedor ${vendedorId}` },
    ];

    if (loading) {
        return (
            <div className={styles.container}>
                <p>Carregando vendedor...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <h1>Erro</h1>
                <p>{error}</p>
            </div>
        );
    }

    if (!vendedor) {
        return (
            <div className={styles.container}>
                <h1>Vendedor Não Encontrado</h1>
                <p>O vendedor que você está procurando não foi encontrado.</p>
            </div>
        );
    }

    return (
        <ProtectedRoute requiredRole="admin" currentUserRole={currentUserRole}>
            <div className={styles.container}>
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <PageHeader
                    title={`Vendedor ${vendedor.username}`}
                    subpage={false}
                    linkTo={ROUTES.VENDEDOR(vendedorId)}
                />
                <VendedorDetails vendedor={vendedor} />
            </div>
        </ProtectedRoute>
    );
};

export default VendedorPage;
