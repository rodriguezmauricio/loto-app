// src/components/Vendedores/NovoVendedorForm.tsx

"use client";

import React, { useState } from "react";
import styles from "./NovoVendedorForm.module.scss";
import { useRouter } from "next/navigation";
// Import the unified User type
import { User } from "../../types/user";

interface NovoVendedorFormProps {}

const NovoVendedorForm: React.FC<NovoVendedorFormProps> = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        valor_comissao: "", // Add commission field
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

        if (!formData.valor_comissao || Number(formData.valor_comissao) <= 0) {
            setError("Comissão deve ser um valor positivo.");
            setIsSubmitting(false);
            return;
        }

        try {
            const res = await fetch("/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: formData.name,
                    email: formData.email,
                    phone: formData.phoneNumber,
                    role: "vendedor",
                    valor_comissao: parseFloat(formData.valor_comissao),
                    // Add other fields as necessary
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Algo deu errado.");
            }

            const newVendedor: User = await res.json();

            // Optionally, show a success message
            alert("Vendedor criado com sucesso!");

            // Redirect to the new vendedor's details page
            router.push(`/vendedores/${newVendedor.id}`);
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
            <label className={styles.label} htmlFor="valor_comissao">
                Comissão (%):
                <input
                    id="valor_comissao"
                    type="number"
                    name="valor_comissao"
                    value={formData.valor_comissao}
                    onChange={handleChange}
                    min={0.01}
                    step={0.01}
                    required
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
