// src/app/(authenticated)/vendedores/novo/page.tsx

"use client";

import React, { useState } from "react";
import NovoVendedorForm from "components/vendedores/NovoVendedorForm";
import PageHeader from "components/pageHeader/PageHeader";
import Breadcrumbs from "components/breadcrumbs/Breadcrumbs";
import { ROUTES } from "@routes/routes";
import { Role } from "../../../../types/roles";
import ProtectedRoute from "components/ProtectedRoute";
import styles from "./novoVendedor.module.scss";
import { useRouter } from "next/navigation";
import SimpleButton from "components/(buttons)/simpleButton/SimpleButton";

interface NovoVendedorPageProps {}

const NovoVendedorPage: React.FC<NovoVendedorPageProps> = () => {
    // Fetch currentUserRole (replace with actual authentication logic)
    const currentUserRole: Role = "admin";
    const router = useRouter();
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [pix, setPix] = useState<string>("");
    const [comissao, setComissao] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const breadcrumbs = [
        { href: ROUTES.HOME, label: "Home" },
        { href: ROUTES.VENDEDORES, label: "Vendedores" },
        { href: ROUTES.NOVO_VENDEDOR, label: "Adicionar Novo Vendedor" },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isSubmitting) return;

        setIsSubmitting(true);

        // Client-side validation
        if (password !== confirmPassword) {
            alert("As senhas não coincidem.");
            return;
        }

        const comissaoValue = parseFloat(comissao);
        if (isNaN(comissaoValue) || comissaoValue < 0 || comissaoValue > 100) {
            alert("A comissão deve estar entre 0% e 100%.");
            return;
        }

        try {
            const response = await fetch("/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                    phone,
                    pix,
                    role: "vendedor",
                    valor_comissao: comissaoValue, // Include comissao
                }),
            });

            if (response.ok) {
                alert("Vendedor criado com sucesso.");

                // Reset the form fields
                setUsername("");
                setPassword("");
                setConfirmPassword("");
                setPhone("");
                setPix("");
                setComissao("");

                router.push("/vendedores");
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || "Erro ao criar vendedor.");
            }
        } catch (err: any) {
            console.error("Error creating vendedor:", err);
            alert(err.message || "Erro desconhecido.");
        } finally {
            setIsSubmitting(false); // Reset submission state
        }
    };
    return (
        <ProtectedRoute requiredRole="admin" currentUserRole={currentUserRole}>
            <div className={styles.container}>
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <PageHeader
                    title="Criar Novo Vendedor"
                    subpage={true}
                    linkTo="/vendedores"
                    hasSubMenu={false}
                />
                <div className={styles.container}>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label htmlFor="username">Nome de Usuário:</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="password">Senha:</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="confirmPassword">Confirmar Senha:</label>{" "}
                            {/* New field */}
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="phone">Telefone:</label>
                            <input
                                type="text"
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="pix">PIX:</label>
                            <input
                                type="text"
                                id="pix"
                                value={pix}
                                onChange={(e) => setPix(e.target.value)}
                                placeholder="Opcional"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="comissao">Comissão (%):</label> {/* New field */}
                            <input
                                type="number"
                                id="comissao"
                                value={comissao}
                                onChange={(e) => setComissao(e.target.value)}
                                placeholder="Ex: 10"
                                min="0"
                                max="100"
                                step="0.1"
                                required
                            />
                        </div>
                        <div className={styles.formActions}>
                            <SimpleButton
                                btnTitle="Cancelar"
                                func={() => router.push("/vendedores")}
                                isSelected={false}
                                disabled={isSubmitting}
                                type="button" // Explicitly set type to "button"
                            />
                            <SimpleButton
                                btnTitle="Criar"
                                isSelected={false}
                                disabled={isSubmitting}
                                func={() => {}}
                                type="submit" // Set type to "submit" and remove func
                            />
                        </div>
                    </form>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default NovoVendedorPage;
