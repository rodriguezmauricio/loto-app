// components/AddAdminForm.tsx
import React, { useState } from "react";
import styles from "./addUsersForm.module.scss";
import { IRadioOptions } from "@/app/(pages)/adicionarUsuario/page"; // Adjust the import path as needed
import SimpleButton from "../(buttons)/simpleButton/SimpleButton";
import { createUser } from "@/app/api/auth/apiClient";

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
    adminId?: string;
    sellerId?: string;
}

const AddUsersForm: React.FC<{ userType: "admin" | "vendedor" | "usuario" }> = ({ userType }) => {
    const [userDataToDatabase, setUserDataToDatabase] = useState<IUserDataToDatabase>({
        username: "",
        password: "",
        saldo: 0,
        saldoCarteira: 0,
        phone: "",
        pix: "sem pix",
        adminId: "",
        sellerId: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setUserDataToDatabase((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const newUser = await createUser({
                type: userType,
                ...userDataToDatabase,
            });
            console.log("User created successfully:", newUser);
        } catch (error) {
            console.error("Error creating user:", error);
        }
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
                    onChange={(e) =>
                        setUserDataToDatabase({ ...userDataToDatabase, username: e.target.value })
                    }
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
                    onChange={(e) =>
                        setUserDataToDatabase({
                            ...userDataToDatabase,
                            password: e.target.value,
                        })
                    }
                />
            </div>
            {/* <div className={styles.formSection}>
                <label htmlFor="phone">Telefone</label>
                <input
                    type="tel"
                    name="phone"
                    id="phone"
                    className={styles.input}
                    value={userDataToDatabase.phone}
                    onChange={(e) =>
                        setUserDataToDatabase({
                            ...userDataToDatabase,
                            phone: e.target.value,
                        })
                    }
                />
            </div> */}
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
