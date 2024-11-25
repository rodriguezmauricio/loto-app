"use client";
// src/components/Vendedores/VendedorDetails.tsx

import React from "react";
import styles from "./VendedorDetails.module.scss";
import { Vendedor } from "../../types/vendedor";
import Link from "next/link";
import { ROUTES } from "../../routes/routes";
import { useRouter } from "next/navigation";

interface VendedorDetailsProps {
    vendedor: Vendedor;
}

const VendedorDetails: React.FC<VendedorDetailsProps> = ({ vendedor }) => {
    const router = useRouter();

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this vendedor?")) {
            // Perform the delete action
            // await fetch(`/api/vendedores/${vendedor.id}`, { method: 'DELETE' });

            // Redirect to the vendedores list page
            router.push(ROUTES.VENDEDORES);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{vendedor.name}</h1>
            <div className={styles.details}>
                {vendedor.phoneNumber && (
                    <p>
                        <strong>Phone:</strong> {vendedor.phoneNumber}
                    </p>
                )}

                {vendedor.totalSales !== undefined && (
                    <p>
                        <strong>Total Sales:</strong> ${vendedor.totalSales.toFixed(2)}
                    </p>
                )}
                {/* Add other fields as necessary */}
            </div>
            <div className={styles.actions}>
                <Link href={ROUTES.VENDEDORES} className={styles.button}>
                    Back to Vendedores
                </Link>
                <Link href={ROUTES.EDIT_VENDEDOR(vendedor.id)} className={styles.button}>
                    Edit Vendedor
                </Link>
                <button onClick={handleDelete} className={styles.buttonDelete}>
                    Delete Vendedor
                </button>
            </div>
        </div>
    );
};

export default VendedorDetails;
