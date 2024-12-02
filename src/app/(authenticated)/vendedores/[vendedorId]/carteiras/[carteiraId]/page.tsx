// src/app/(authenticated)/vendedores/[vendedorId]/carteiras/[carteiraId]/page.tsx

import React from "react";
import VendasList from "components/vendedores/VendasLists";
import PageHeader from "components/pageHeader/PageHeader";
import Breadcrumbs from "../../../../../../components/breadcrumbs/Breadcrumbs";
import { ROUTES } from "@routes/routes";
import { Role } from "../../../../../../types/roles";
import ProtectedRoute from "components/ProtectedRoute";
import styles from "./carteiraVendedor.module.css";

interface Venda {
    id: string;
    product: string;
    amount: number;
    date: string;
    // Add other relevant fields
}

interface VendasPageProps {
    params: { vendedorId: string; carteiraId: string };
}

const VendasPage = async ({ params }: VendasPageProps) => {
    const { vendedorId, carteiraId } = params;

    // Fetch vendas data based on vendedorId and carteiraId
    // Replace with actual data fetching logic
    const vendas: Venda[] = [
        { id: "1", product: "Product A", amount: 100, date: "2023-10-01" },
        { id: "2", product: "Product B", amount: 200, date: "2023-10-05" },
        // ... more vendas
    ];

    // Fetch user role (replace with actual authentication logic)
    const currentUserRole: Role = "admin"; // Example role

    const breadcrumbs = [
        { href: ROUTES.HOME, label: "Home" },
        { href: ROUTES.VENDEDORES, label: "Vendedores" },
        { href: ROUTES.VENDEDOR(vendedorId), label: `Vendedor ${vendedorId}` },
        { href: ROUTES.VENDEDOR_CARTEIRAS(vendedorId), label: "Carteiras" },
        {
            href: ROUTES.VENDEDOR_CARTEIRA(vendedorId, carteiraId), // Corrected 'link' to 'href'
            label: `Carteira ${carteiraId}`,
        },
    ];

    return (
        <ProtectedRoute requiredRole="admin" currentUserRole={currentUserRole}>
            <div className={styles.container}>
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <PageHeader
                    title="Vendas"
                    subpage={true}
                    linkTo={ROUTES.VENDEDOR_CARTEIRAS(vendedorId)} // Corrected prop name and value
                />
                <VendasList vendas={vendas} />
            </div>
        </ProtectedRoute>
    );
};

export default VendasPage;
