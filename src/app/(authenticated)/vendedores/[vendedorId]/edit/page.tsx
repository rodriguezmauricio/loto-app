// src/app/(authenticated)/vendedores/[vendedorId]/edit/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import VendedorEditForm from "components/vendedores/VendedorEditForm";
import { User } from "../../../../../types/user"; // Updated import
import { Role } from "../../../../../types/roles";
import ProtectedRoute from "components/ProtectedRoute";
import { ROUTES } from "@routes/routes";
import Breadcrumbs from "components/breadcrumbs/Breadcrumbs";
import PageHeader from "components/pageHeader/PageHeader";
import styles from "./EditVendedorPage.module.css";

interface EditVendedorPageProps {
    params: { vendedorId: string };
}

const EditVendedorPage: React.FC<EditVendedorPageProps> = ({ params }) => {
    const { vendedorId } = params;
    const [vendedor, setVendedor] = useState<User | null>(null); // Updated type
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

                const data: User = await res.json(); // Updated type
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

    // Fetch currentUserRole (replace with actual authentication logic)
    // Assuming you have a way to get the current user's role, e.g., via context or props
    const currentUserRole: Role = "admin"; // Example role

    const breadcrumbs = [
        { href: ROUTES.HOME, label: "Home" },
        { href: ROUTES.VENDEDORES, label: "Vendedores" },
        { href: ROUTES.VENDEDOR(vendedorId), label: `Vendedor ${vendedorId}` },
        { href: ROUTES.EDIT_VENDEDOR(vendedorId), label: "Editar Vendedor" },
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
                    title="Editar Vendedor"
                    subpage={true}
                    linkTo={ROUTES.VENDEDOR(vendedorId)}
                />
                <VendedorEditForm vendedor={vendedor} /> {/* Now passing User type */}
            </div>
        </ProtectedRoute>
    );
};

export default EditVendedorPage;
