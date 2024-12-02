// src/components/Users/UserEditForm.tsx

"use client";

import React, { useState } from "react";
import styles from "./UserEditform.module.scss"; // Ensure this CSS module exists
import { User } from "../../types/user";
import { useRouter } from "next/navigation";
import { ROUTES } from "@routes/routes";

interface UserEditFormProps {
    user: User;
}

const UserEditForm: React.FC<UserEditFormProps> = ({ user }) => {
    const router = useRouter();

    // Initialize form data with the user prop
    const [formData, setFormData] = useState<{
        username: string;
        name: string;
        email: string;
        phone: string;
        pix: string;
        valor_comissao?: number;
        image: string;
        password: string;
        role: string;
    }>({
        username: user.username,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone,
        pix: user.pix || "",
        valor_comissao: user.valor_comissao || 0,
        image: user.image || "",
        password: "",
        role: user.role,
    });

    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // If the field is 'valor_comissao', convert it to a number
        if (name === "valor_comissao") {
            setFormData({
                ...formData,
                [name]: parseFloat(value),
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        // Basic client-side validation
        if (!formData.username.trim()) {
            setError("Nome de usuário é obrigatório.");
            setIsSubmitting(false);
            return;
        }

        // Additional validations can be added here

        // Prepare payload
        const payload: any = {
            username: formData.username,
            phone: formData.phone,
            name: formData.name || null,
            email: formData.email || null,
            image: formData.image || null,
            pix: formData.pix || null,
            role: formData.role, // Only admins can change roles
        };

        // Include valor_comissao only if the role is vendedor
        if (formData.role === "vendedor") {
            payload.valor_comissao = formData.valor_comissao;
        }

        // Include password if it's provided
        if (formData.password && formData.password.trim() !== "") {
            payload.password = formData.password;
        }

        try {
            const res = await fetch(`/api/users/${user.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Algo deu errado ao atualizar o usuário.");
            }

            const updatedUser: User = await res.json();

            // Optionally, show a success message
            // alert("Usuário atualizado com sucesso!");

            // Redirect to the user details page
            router.push(ROUTES.USER(updatedUser.id));
        } catch (err: any) {
            setError(err.message || "Ocorreu um erro inesperado.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h1>Editar Usuário</h1>
            {error && <p className={styles.error}>{error}</p>}

            {/* Username */}
            <label className={styles.label} htmlFor="username">
                Nome de Usuário:
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

            {/* Name */}
            <label className={styles.label} htmlFor="name">
                Nome:
                <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={styles.input}
                />
            </label>

            {/* Email */}
            <label className={styles.label} htmlFor="email">
                Email:
                <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={styles.input}
                />
            </label>

            {/* Phone */}
            <label className={styles.label} htmlFor="phone">
                Telefone:
                <input
                    id="phone"
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className={styles.input}
                />
            </label>

            {/* Pix */}
            <label className={styles.label} htmlFor="pix">
                Pix:
                <input
                    id="pix"
                    type="text"
                    name="pix"
                    value={formData.pix}
                    onChange={handleChange}
                    className={styles.input}
                />
            </label>

            {/* Valor Comissão - Only for Vendedores */}
            {formData.role === "vendedor" && (
                <label className={styles.label} htmlFor="valor_comissao">
                    Valor Comissão:
                    <input
                        id="valor_comissao"
                        type="number"
                        name="valor_comissao"
                        value={formData.valor_comissao}
                        onChange={handleChange}
                        step="0.01"
                        required
                        className={styles.input}
                    />
                </label>
            )}

            {/* Image */}
            <label className={styles.label} htmlFor="image">
                URL da Imagem:
                <input
                    id="image"
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className={styles.input}
                />
            </label>

            {/* Password */}
            <label className={styles.label} htmlFor="password">
                Nova Senha:
                <input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="Deixe em branco para não alterar"
                />
            </label>

            {/* Role - Only for Admins */}
            {user.role === "admin" && (
                <label className={styles.label} htmlFor="role">
                    Papel:
                    <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    >
                        <option value="admin">Admin</option>
                        <option value="vendedor">Vendedor</option>
                        <option value="usuario">Usuário</option>
                    </select>
                </label>
            )}

            {/* Submit Button */}
            <button type="submit" className={styles.button} disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </button>
        </form>
    );
};

export default UserEditForm;
