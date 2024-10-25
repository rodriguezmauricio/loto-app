// components/AddAdminForm.tsx
import React, { useState } from "react";
import styles from "./addUsersForm.module.scss";
import { IRadioOptions } from "@/app/(pages)/adicionarUsuario/page"; // Adjust the import path as needed

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

interface IUserDataToDatabase {
    username: string; //ok
    password_hash: string; //ok
    phone: string; //ok
    saldo: number; //ok
    saldoCarteira: number; //ok
    pix?: string; //ok
    tipoComissao?: string;
    valorComissao?: number;
    adminId?: string;
    sellerId?: string;
}

// Main component
const AddAdminForm: React.FC<AddAdminFormProps> = ({ userType }) => {
    const [userData, setUserData] = useState<any>();
    const [selectedRadioButton, setSelectedRadioButton] = useState("");

    const [userDataToDatabase, setUserDataToDatabase] = useState<IUserDataToDatabase>({
        username: "",
        password_hash: "",
        phone: "00 00000 0000",
        pix: "sem pix",
        saldo: 0,
        saldoCarteira: 0,
        tipoComissao: "porcentagem",
        valorComissao: 0,
        adminId: "0",
        sellerId: "0",
    });

    const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedRadioButton(e.target.value);
    };

    const handleSubmitForm = async (e: { preventDefault: () => void }) => {
        e.preventDefault();

        const payload = {
            username: userDataToDatabase.username,
            password_hash: userDataToDatabase.password_hash,
            saldo: userDataToDatabase.saldo,
            saldoCarteira: userDataToDatabase.saldoCarteira,
            phone: userDataToDatabase.phone,
        };

        fetch(`/api/users`, {
            method: "POST",
            body: JSON.stringify(payload),
        })
            .then((res) => res.json())
            .then((responseData) => {
                setUserData(responseData);
            })
            .catch((error) => {
                console.error("Error:", error);
            });

        console.log("fetched apparently...");
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
                    value={userDataToDatabase.password_hash}
                    onChange={(e) =>
                        setUserDataToDatabase({
                            ...userDataToDatabase,
                            password_hash: e.target.value,
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
            {/* {userType === "vendedor" && (
//                 <section className={styles.form}>
//                     <div>
//                         <h3>Tipo de comissão:</h3>
//                         <label>
//                             <input
//                                 type="radio"
//                                 value="porcentagem"
//                                 checked={selectedRadioButton === "porcentagem"}
//                                 onChange={handleRadioChange}
//                             />
//                             Valor em %
//                         </label>

//                         <label>
//                             <input
//                                 type="radio"
//                                 value="absoluto"
//                                 checked={selectedRadioButton === "Valor em R$"}
//                                 onChange={handleRadioChange}
//                             />
//                             Valor em R$
//                         </label>

//                         <p>Selected option: {selectedRadioButton}</p>

//                         <label htmlFor="valorComissao">Valor da comissão em %</label>
//                         <input
//                             type="number"
//                             name="valorComissao"
//                             id="valorComissao"
//                             className={styles.input}
//                             value={userDataToDatabase.valorComissao}
//                             onChange={(e) =>
//                                 setUserDataToDatabase({
//                                     ...userDataToDatabase,
//                                     valorComissao: Number(e.target.value),
//                                 })
//                             }
//                         />
//                     </div>
//                 </section>
//             )} */}

            {/* {userType === "usuario" && (
//                 <section className={styles.form}>
//                     <label htmlFor="pix">Pix</label>
//                     <input
//                         type="text"
//                         name="pix"
//                         id="pix"
//                         className={styles.input}
//                         value={userDataToDatabase.pix}
//                         onChange={(e) =>
//                             setUserDataToDatabase({ ...userDataToDatabase, pix: e.target.value })
//                         }
//                     />
//                 </section>
//             )} */}
            <button type="submit">Criar novo {userType}</button>
        </form>
    );
};

export default AddAdminForm;
