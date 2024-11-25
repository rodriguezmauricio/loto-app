// components/AddAdminForm.tsx
import React, { useState } from "react";
import styles from "./addUsersForm.module.scss"; // Adjust the import path as needed
import SimpleButton from "../(buttons)/simpleButton/SimpleButton";

// Define a type for userType
export type UserType = "admin" | "vendedor" | "usuario";

interface IUserDataToDatabase {
    username: string;
    password: string;
    saldo: number;
    saldoCarteira: number;
    phone: string;
    pix: string;
    tipoComissao?: string;
    valorComissao?: number;
    adminId?: string | null;
    sellerId?: string | null;
}

const AddUsersForm: React.FC<{ userType: "admin" | "vendedor" | "usuario" }> = ({ userType }) => {
    const [confirmPassword, setConfirmPassword] = useState("");
    const [userDataToDatabase, setUserDataToDatabase] = useState<IUserDataToDatabase>({
        username: "",
        password: "",
        saldo: 0,
        saldoCarteira: 0,
        phone: "",
        pix: "sem pix",
        adminId: null,
        sellerId: null,
        tipoComissao: "",
        valorComissao: 0,
    });

    const handleSubmitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    type: userType,
                    ...userDataToDatabase,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Error creating user");
            }

            const newUser = await response.json();
            alert(`User created successfully:
                \n${newUser}`);

            // Optionally reset the form or show a success message
            setUserDataToDatabase({
                username: "",
                password: "",
                saldo: 0,
                saldoCarteira: 0,
                phone: "",
                pix: "sem pix",
                adminId: "",
                sellerId: "",
                tipoComissao: "",
                valorComissao: 0,
            });
        } catch (error) {
            console.error("Error creating user:", error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setUserDataToDatabase((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <form className={styles.form} onSubmit={handleSubmitForm}>
            <div className={styles.formSection}>
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    name="username"
                    id="username"
                    className={styles.input}
                    value={userDataToDatabase.username}
                    onChange={handleChange}
                />
            </div>
            <div className={styles.formSection}>
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    className={styles.input}
                    value={userDataToDatabase.password}
                    onChange={handleChange}
                />
            </div>

            <div className={styles.formSection}>
                <label htmlFor="confirmPassword">Password</label>
                <input
                    type="confirmPassword"
                    name="confirmPassword"
                    id="confirmPassword"
                    className={styles.input}
                    value={userDataToDatabase.password}
                    onChange={handleChange}
                />
            </div>

            <div className={styles.formSection}>
                <label htmlFor="saldoCarteira">Saldo Carteira</label>
                <input
                    type="number"
                    name="saldoCarteira"
                    id="saldoCarteira"
                    className={styles.input}
                    value={userDataToDatabase.saldoCarteira}
                    onChange={(e) =>
                        setUserDataToDatabase({
                            ...userDataToDatabase,
                            saldoCarteira: Number(e.target.value),
                        })
                    }
                />
            </div>
            {userType === "vendedor" && (
                <section className={styles.form}>
                    <div>
                        <label htmlFor="valorComissao">Valor da comissão em %</label>
                        <input
                            type="number"
                            name="valorComissao"
                            id="valorComissao"
                            className={styles.input}
                            value={userDataToDatabase.valorComissao}
                            onChange={(e) =>
                                setUserDataToDatabase({
                                    ...userDataToDatabase,
                                    valorComissao: Number(e.target.value),
                                })
                            }
                        />
                    </div>
                </section>
            )}

            <SimpleButton
                btnTitle={`Criar novo ${userType}`}
                type="submit"
                func={() => {}}
                isSelected={false}
            />
        </form>
    );
};

export default AddUsersForm;
