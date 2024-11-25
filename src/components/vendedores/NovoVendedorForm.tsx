// src/components/Vendedores/NovoVendedorForm.tsx

"use client";

import React, { useState } from "react";
import styles from "./NovoVendedorForm.module.scss";
import { useRouter } from "next/navigation";
import { ROUTES } from "@routes/routes";

interface NovoVendedorFormProps {}

const NovoVendedorForm: React.FC<NovoVendedorFormProps> = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        // Add other fields as necessary
    });
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
        if (!formData.name.trim()) {
            setError("Nome é obrigatório.");
            setIsSubmitting(false);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError("Por favor, insira um endereço de email válido.");
            setIsSubmitting(false);
            return;
        }

        try {
            const res = await fetch("/api/vendedores", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Algo deu errado.");
            }

            const newVendedor = await res.json();

            // Optionally, show a success message
            alert("Vendedor criado com sucesso!");

            // Redirect to the new vendedor's details page
            router.push(ROUTES.VENDEDOR(newVendedor.id));
        } catch (err: any) {
            setError(err.message || "Ocorreu um erro inesperado.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h1>Adicionar Novo Vendedor</h1>
            {error && <p className={styles.error}>{error}</p>}
            <label className={styles.label} htmlFor="name">
                Nome:
                <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={styles.input}
                />
            </label>
            <label className={styles.label} htmlFor="email">
                Email:
                <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
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
                {isSubmitting ? "Adicionando..." : "Adicionar Vendedor"}
            </button>
        </form>
    );
};

export default NovoVendedorForm;
