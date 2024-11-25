// src/app/(authenticated)/vendedores/[vendedorId]/edit/page.tsx

import React from "react";
import VendedorEditForm from "components/vendedores/VendedorEditForm";
import { Vendedor } from "../../../../../types/vendedor";
import { Role } from "../../../../../types/roles";
import ProtectedRoute from "components/ProtectedRoute";
import { ROUTES } from "@routes/routes";
import Breadcrumbs from "components/breadcrumbs/Breadcrumbs";
import PageHeader from "components/pageHeader/PageHeader";
import styles from "@styles/EditVendedorPage.module.css";

interface EditVendedorPageProps {
    params: { vendedorId: string };
}

const EditVendedorPage: React.FC<EditVendedorPageProps> = async ({ params }) => {
    const { vendedorId } = params;

    // Fetch the vendedor data from the API
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/vendedores/${vendedorId}`, {
        headers: {
            "Content-Type": "application/json",
        },
        cache: "no-store",
    });

    if (!res.ok) {
        // Optionally, handle different error statuses
        return (
            <div className={styles.container}>
                <h1>Vendedor Não Encontrado</h1>
                <p>O vendedor que você está procurando não foi encontrado.</p>
            </div>
        );
    }

    const vendedor: Vendedor = await res.json();

    // Fetch currentUserRole (replace with actual authentication logic)
    const currentUserRole: Role = "admin"; // Example role

    const breadcrumbs = [
        { href: ROUTES.HOME, label: "Home" },
        { href: ROUTES.VENDEDORES, label: "Vendedores" },
        { href: ROUTES.VENDEDOR(vendedorId), label: `Vendedor ${vendedorId}` },
        { href: ROUTES.EDIT_VENDEDOR(vendedorId), label: "Editar Vendedor" },
    ];

    return (
        <ProtectedRoute requiredRole="admin" currentUserRole={currentUserRole}>
            <div className={styles.container}>
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <PageHeader
                    title="Editar Vendedor"
                    subpage={true}
                    linkTo={ROUTES.VENDEDOR(vendedorId)}
                />
                <VendedorEditForm vendedor={vendedor} />
            </div>
        </ProtectedRoute>
    );
};

export default EditVendedorPage;
