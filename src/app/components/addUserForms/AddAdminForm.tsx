// components/AddAdminForm.tsx
import React, { useState } from "react";
import styles from "./addAdminForm.module.scss";
import { IRadioOptions } from "@/app/(pages)/adicionarUsuario/page"; // Adjust the import path as needed
import { hashPassword } from "@/app/utils/utils";

// Define a type for userType
export type UserType = "admin" | "vendedor" | "usuario";

interface AddAdminFormProps {
    userType: UserType;
    radioOptions: IRadioOptions[]; // Add this line to define the prop
    selectedRadioOption: string;
    radioHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
    adminId: string; // Assuming this is the admin ID
    sellerId?: string; // Optional seller ID for "usuario"
}

// Main component
const AddAdminForm: React.FC<AddAdminFormProps> = ({ userType, adminId, sellerId }) => {
    const [userData, setUserData] = useState<any>();
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [pix, setPix] = useState<string>("");
    const [saldo, setSaldo] = useState<number>(0);
    const [saldoCarteira, setSaldoCarteira] = useState<number>(0);
    const [tipoComissao, setTipoComissao] = useState<string>("");
    const [valorComissao, setValorComissao] = useState<number>(0);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const passwordHash = await hashPassword(password); // Hash password

        let payload = {
            username,
            password: passwordHash,
            saldo,
            saldoCarteira,
            adminId, // Use the passed adminId
            sellerId, // Use the passed sellerId if userType is "usuario"
            tipoComissao,
            valorComissao,
            phone,
            pix,
        };

        if (userType === "admin") {
            fetch(`/api/admins/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            })
                .then((response) => response.json())
                .then((data) => {
                    setUserData(data);
                    console.log("Success");
                })
                .catch((error) => console.error("Error:", error));
        } else if (userType === "vendedor") {
            fetch(`/api/sellers/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            })
                .then((response) => response.json())
                .then((data) => {
                    setUserData(data);
                    console.log("Success");
                })
                .catch((error) => console.error("Error:", error));
        } else if (userType === "usuario") {
            fetch(`/api/users/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            })
                .then((response) => response.json())
                .then((data) => {
                    setUserData(data);
                    console.log("Success");
                })
                .catch((error) => console.error("Error:", error));
        }
    };

    return (
        <form className={styles.form} onSubmit={onSubmit}>
            <div className={styles.formSection}>
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    name="username"
                    id="username"
                    className={styles.input}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>

            <div className={styles.formSection}>
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    className={styles.input}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            {(userType === "vendedor" || userType === "usuario") && (
                <section className={styles.form}>
                    <div className={styles.formSection}>
                        <label htmlFor="phone">Telefone</label>
                        <input
                            type="tel"
                            name="phone"
                            id="phone"
                            className={styles.input}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>

                    <div className={styles.formSection}>
                        <label htmlFor="saldo">Saldo Inicial</label>
                        <input
                            type="number"
                            name="saldo"
                            id="saldo"
                            className={styles.input}
                            value={saldo}
                            onChange={(e) => setSaldo(Number(e.target.value))}
                        />
                    </div>
                </section>
            )}

            {userType === "usuario" && (
                <section className={styles.form}>
                    <label htmlFor="pix">Pix</label>
                    <input
                        type="text"
                        name="pix"
                        id="pix"
                        className={styles.input}
                        value={pix}
                        onChange={(e) => setPix(e.target.value)}
                    />
                </section>
            )}

            <button type="submit">Criar novo {userType}</button>
        </form>
    );
};

export default AddAdminForm;
