// src/components/Vendedores/VendedoresList.tsx
"use client";
import React from "react";
import Link from "next/link";
import { ROUTES } from "@routes/routes";
import styles from "./VendedoresList.module.scss";
import { Vendedor } from "../../types/vendedor";

interface VendedoresListProps {
    vendedores: Vendedor[];
}

const VendedoresList: React.FC<VendedoresListProps> = ({ vendedores }) => {
    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza de que deseja excluir este vendedor?")) return;

        try {
            const res = await fetch(`/api/vendedores/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Falha ao excluir vendedor.");
            }

            // Optionally, refresh the page or update the state to remove the deleted vendedor
            window.location.reload();
        } catch (error: any) {
            alert(error.message || "Ocorreu um erro inesperado.");
        }
    };

    return (
        <div className={styles.listContainer}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Telefone</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {vendedores.map((vendedor) => (
                        <tr key={vendedor.id}>
                            <td>{vendedor.username}</td>
                            <td>{vendedor.phoneNumber || "-"}</td>
                            <td>
                                <Link
                                    href={ROUTES.EDIT_VENDEDOR(vendedor.id)}
                                    className={styles.editButton}
                                >
                                    Editar
                                </Link>
                                <button
                                    onClick={() => handleDelete(vendedor.id)}
                                    className={styles.deleteButton}
                                >
                                    Excluir
                                </button>
                            </td>
                        </tr>
                    ))}
                    {vendedores.length === 0 && (
                        <tr>
                            <td colSpan={4} className={styles.noData}>
                                Nenhum vendedor encontrado.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default VendedoresList;
