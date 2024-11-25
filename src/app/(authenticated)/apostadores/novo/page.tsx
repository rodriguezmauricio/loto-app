"use client";

import styles from "./novoApostador.module.scss";
import PageHeader from "components/pageHeader/PageHeader";
import { useState } from "react";
import SimpleButton from "components/(buttons)/simpleButton/SimpleButton";
import { useUserStore } from "../../../../../store/useUserStore";

interface IUserDataToDatabase {
    username: string;
    password: string;
    phone: string;
    pix: string;
}

const AdicionarApostador = () => {
    const user = useUserStore((state) => state.user);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [userDataToDatabase, setUserDataToDatabase] = useState<IUserDataToDatabase>({
        username: "",
        password: "",
        phone: "",
        pix: "sem pix",
    });

    const handleSubmitForm = async (e: React.FormEvent) => {
        e.preventDefault();

        if (userDataToDatabase.password !== confirmPassword) {
            alert("Senhas precisam ser iguais");
            return;
        }

        try {
            const response = await fetch("/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userDataToDatabase),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Erro ao criar usuário.");
            }

            const newUser = await response.json();
            alert("Usuário criado com sucesso!");

            // Reset the form
            setUserDataToDatabase({
                username: "",
                password: "",
                phone: "",
                pix: "sem pix",
            });
            setConfirmPassword("");
        } catch (error: any) {
            console.error("Error creating user:", error);
            alert(error.message || "Erro ao criar usuário.");
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        if (name === "confirmPassword") {
            setConfirmPassword(value);
        } else {
            setUserDataToDatabase((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    return (
        <>
            <PageHeader title="Adicionar Apostador" subpage={true} linkTo="/apostadores" />
            <main className="main">
                <form className={styles.form} onSubmit={handleSubmitForm}>
                    <div className={styles.formSection}>
                        <label htmlFor="username">Nome de Usuario</label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            className={styles.input}
                            value={userDataToDatabase.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.formSection}>
                        <label htmlFor="password">Senha</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            className={styles.input}
                            value={userDataToDatabase.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.formSection}>
                        <label htmlFor="confirmPassword">Confirme a Senha</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            className={styles.input}
                            value={confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.formSection}>
                        <label htmlFor="phone">Telefone</label>
                        <input
                            type="text"
                            name="phone"
                            id="phone"
                            className={styles.input}
                            value={userDataToDatabase.phone}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={styles.formSection}>
                        <label htmlFor="pix">PIX</label>
                        <input
                            type="text"
                            name="pix"
                            id="pix"
                            className={styles.input}
                            value={userDataToDatabase.pix}
                            onChange={handleChange}
                        />
                    </div>

                    <SimpleButton
                        btnTitle="Criar novo usuário"
                        type="submit"
                        func={() => {}}
                        isSelected={false}
                    />
                </form>
            </main>
        </>
    );
};

export default AdicionarApostador;
