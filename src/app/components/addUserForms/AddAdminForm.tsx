import React from "react";
import styles from "./addAdminForm.module.scss";
import { IRadioOptions } from "@/app/(pages)/adicionarUsuario/page";
import { useForm, Controller } from "react-hook-form";
import SimpleButton from "../(buttons)/simpleButton/SimpleButton";
import { hashPassword } from "@/app/utils/utils";

// Define a type for userType
export type UserType = "vendedor" | "usuario";

interface AddAdminFormProps {
    userType: UserType;
    radioOptions: IRadioOptions[];
    selectedRadioOption: string;
    radioHandler: (event: React.ChangeEvent<HTMLInputElement>) => void; // Better type for radioHandler
}

const AddAdminForm: React.FC<AddAdminFormProps> = ({
    userType,
    radioOptions,
    selectedRadioOption,
    radioHandler,
}) => {
    //VARS:
    const [userData, setUserData] = React.useState<any>();
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");

    const handleUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    /* 
    Receives the info from the page and send it to this form component.
    onsubmit is a function from reactHook form and must exist.
    data is the information thats gonna be sent to the server
    and it contains the form data for each user.
    */
    const onSubmit = async (e: any) => {
        e.preventDefault();

        const payload = {
            username,
            password: hashPassword(password),
        };

        fetch(`/api/users/`, {
            method: "POST",
            body: JSON.stringify(payload),
        })
            .then((response) => response.json())
            .then((data) => {
                setUserData(data);
                console.log("Success");
            })
            .catch((error) => console.error("Error:", error));
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
                    onChange={handleUsername}
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
                    onChange={handlePassword}
                />
            </div>

            {(userType === "vendedor" || userType === "usuario") && (
                <section className={styles.form}>
                    <div className={styles.formSection}>
                        <label htmlFor="phone">Telefone</label>

                        <input type="tel" name="phone" id="phone" className={styles.input} />
                    </div>

                    <div className={styles.formSection}>
                        <label htmlFor="saldo">Saldo Inicial</label>

                        <input type="number" name="saldo" id="saldo" className={styles.input} />
                    </div>
                </section>
            )}

            {userType === "vendedor" && (
                <section className={styles.form}>
                    <section className={styles.form}>
                        <div className={styles.formSection}>
                            <label htmlFor="tipoComissao">Tipo de Comissão:</label>
                            {radioOptions.map((radio) => (
                                <div key={radio.value}>
                                    <input
                                        type="radio"
                                        value={radio.value}
                                        checked={selectedRadioOption === radio.value}
                                        onChange={radioHandler}
                                    />

                                    {radio.label}
                                </div>
                            ))}
                        </div>

                        <div className={styles.formSection}>
                            <label htmlFor="valorComissao">Valor da comissão</label>

                            <input
                                type="number"
                                name="valorComissao"
                                id="valorComissao"
                                className={styles.input}
                            />
                        </div>
                    </section>
                </section>
            )}

            {userType === "usuario" && (
                <section className={styles.form}>
                    <label htmlFor="pix">Pix</label>

                    <input type="text" name="pix" id="pix" className={styles.input} />
                </section>
            )}

            {userType != null && (
                <SimpleButton
                    type="submit"
                    btnTitle={`Criar novo ${userType}`}
                    func={() => console.log("botao clicado")}
                    isSelected={false}
                />
            )}
        </form>
    );
};

export default AddAdminForm;
