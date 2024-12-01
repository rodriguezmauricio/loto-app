// src/components/Vendedores/VendedorEditForm.tsx

"use client";

import React, { useState } from "react";
import styles from "./VendedorEditForm.module.scss";
import { Vendedor } from "../../types/vendedor";
import { useRouter } from "next/navigation";
import { ROUTES } from "@routes/routes";

interface VendedorEditFormProps {
    vendedor: Vendedor;
}

const VendedorEditForm: React.FC<VendedorEditFormProps> = ({ vendedor }) => {
    const [formData, setFormData] = useState<Vendedor>(vendedor);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        // Basic client-side validation
        if (!formData.username.trim()) {
            setError("Nome é obrigatório.");
            setIsSubmitting(false);
            return;
        }

        try {
            const res = await fetch(`/api/vendedores/${formData.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: formData.username,
                    phoneNumber: formData.phoneNumber,
                    // Add other fields if necessary
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Algo deu errado.");
            }

            const updatedVendedor = await res.json();

            // Optionally, show a success message
            // alert('Vendedor atualizado com sucesso!');

            // Redirect to the vendedor details page
            router.push(ROUTES.VENDEDOR(updatedVendedor.id));
        } catch (err: any) {
            setError(err.message || "Ocorreu um erro inesperado.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h1>Editar Vendedor</h1>
            {error && <p className={styles.error}>{error}</p>}
            <label className={styles.label} htmlFor="username">
                Nome:
                <input
                    id="username"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className={styles.input}
                />
            </label>

            <label className={styles.label} htmlFor="phoneNumber">
                Telefone:
                <input
                    id="phoneNumber"
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className={styles.input}
                />
            </label>
            {/* Add other fields as necessary */}
            <button type="submit" className={styles.button} disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </button>
        </form>
    );
};

export default VendedorEditForm;
