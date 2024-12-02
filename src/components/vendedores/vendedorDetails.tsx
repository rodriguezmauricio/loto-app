// src/components/Vendedores/VendedorDetails.tsx

"use client";

import React from "react";
import styles from "./VendedorDetails.module.scss";
import { User } from "../../types/user"; // Use the unified User type
import Link from "next/link";
import { ROUTES } from "../../routes/routes"; // Adjust the path as necessary
import { useRouter } from "next/navigation";

interface VendedorDetailsProps {
    vendedor: User; // Use User type
}

const VendedorDetails: React.FC<VendedorDetailsProps> = ({ vendedor }) => {
    const router = useRouter();

    const handleDelete = async () => {
        if (confirm("Você tem certeza de que deseja deletar este vendedor?")) {
            try {
                const res = await fetch(`/api/users/${vendedor.id}`, {
                    method: "DELETE",
                });

                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.message || "Erro ao deletar vendedor.");
                }

                alert("Vendedor deletado com sucesso!");
                router.push(ROUTES.VENDEDORES);
            } catch (err: any) {
                alert(err.message || "Ocorreu um erro ao deletar o vendedor.");
            }
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{vendedor.name || vendedor.username}</h1>
            <div className={styles.details}>
                {vendedor.phone && (
                    <p>
                        <strong>Telefone:</strong> {vendedor.phone}
                    </p>
                )}
                {vendedor.valor_comissao !== undefined && vendedor.valor_comissao !== null && (
                    <p>
                        <strong>Comissão (%):</strong> {vendedor.valor_comissao}%
                    </p>
                )}
                {/* Add other fields as necessary */}
            </div>
            <div className={styles.actions}>
                <Link href={ROUTES.VENDEDORES} className={styles.button}>
                    Voltar para Vendedores
                </Link>
                <Link href={ROUTES.EDIT_VENDEDOR(vendedor.id)} className={styles.button}>
                    Editar Vendedor
                </Link>
                <button onClick={handleDelete} className={styles.buttonDelete}>
                    Deletar Vendedor
                </button>
            </div>
        </div>
    );
};

export default VendedorDetails;
