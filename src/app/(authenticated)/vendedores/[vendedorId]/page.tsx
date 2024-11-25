// src/app/(authenticated)/vendedores/[vendedorId]/page.tsx

import React from "react";
import VendedorDetails from "components/vendedores/vendedorDetails";
import { Vendedor } from "../../../../types/vendedor";
import { Role } from "../../../../types/roles";
import ProtectedRoute from "components/ProtectedRoute";

interface VendedorDetailsPageProps {
    params: { vendedorId: string };
}

const fetchVendedor = async (vendedorId: string): Promise<Vendedor | null> => {
    // Replace this with your actual data fetching logic
    // For example, fetch data from your API
    // const response = await fetch(`/api/vendedores/${vendedorId}`);
    // if (!response.ok) return null;
    // return await response.json();

    // Simulated data for demonstration
    const simulatedData: Vendedor = {
        id: vendedorId,
        username: `Vendedor ${vendedorId}`,
        phoneNumber: "123-456-7890",
        totalSales: 15000.5,
    };
    return simulatedData;
};

const VendedorDetailsPage = async ({ params }: VendedorDetailsPageProps) => {
    const { vendedorId } = params;
    const vendedor = await fetchVendedor(vendedorId);

    // Handle the case where the vendedor is not found
    if (!vendedor) {
        // You can use Next.js's notFound function to render a 404 page
        // import { notFound } from 'next/navigation';
        // notFound();

        // Or render an error message
        return (
            <div>
                <h1>Vendedor Not Found</h1>
            </div>
        );
    }

    // Fetch currentUserRole (replace with actual authentication logic)
    const currentUserRole: Role = "admin"; // Example role

    return (
        <ProtectedRoute requiredRole="admin" currentUserRole={currentUserRole}>
            <VendedorDetails vendedor={vendedor} />
        </ProtectedRoute>
    );
};

export default VendedorDetailsPage;
