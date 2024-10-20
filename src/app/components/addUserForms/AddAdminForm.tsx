import React, { useEffect, useState } from "react";
import styles from "./addAdminForm.module.scss";
import { IRadioOptions } from "@/app/(pages)/adicionarUsuario/page";
import { useForm, Controller } from "react-hook-form";
import SimpleButton from "../(buttons)/simpleButton/SimpleButton";
import { hashPassword } from "@/app/utils/utils";

// Define a type for userType
export type UserType = "admin" | "vendedor" | "usuario";

interface AddAdminFormProps {
    userType: UserType;
    radioOptions: IRadioOptions[];
    selectedRadioOption: string;
    radioHandler: (event: React.ChangeEvent<HTMLInputElement>) => void; // Better type for radioHandler
}

//TODO: CHECK IF ADDING ADMIN IS STILL WORKING

const AddAdminForm: React.FC<AddAdminFormProps> = ({
    userType,
    // radioOptions,
    // selectedRadioOption,
    // radioHandler,
}) => {
    //VARS:
    const [userData, setUserData] = React.useState<any>();
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [phone, setPhone] = React.useState("");
    const [adminId, setAdminId] = React.useState("");
    const [sellerId, setSellerId] = React.useState("");
    const [pix, setPix] = React.useState("");
    const [saldo, setSaldo] = React.useState(0);
    const [tipoComissao, setTipoComissao] = React.useState("");
    const [valorComissao, setValorComissao] = React.useState(0);

    const [selectedRadioButton, setSelectedRadioButton] = useState("");

    const radioOptions = [
        { value: "percent", label: "Porcentagem" },
        { value: "absolute", label: "Valor em R$" },
    ];

    //HANDLERS:
    const handleUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleRadioChange = (e: { target: { value: React.SetStateAction<string> } }) => {
        setSelectedRadioButton(e.target.value);
    };

    const handlePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(e.target.value);
    };
    const handlePix = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPix(e.target.value);
    };
    const handleSaldo = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSaldo(Number(e.target.value));
    };
    const handleTipoComissao = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTipoComissao(e.target.value);
    };
    const handleValorComissao = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValorComissao(Number(e.target.value));
    };

    /* 
    Receives the info from the page and send it to this form component.
    onsubmit is a function from reactHook form and must exist.
    data is the information thats gonna be sent to the server
    and it contains the form data for each user.
    */
    const onSubmit = async (e: any) => {
        e.preventDefault();

        let payload: any;

        if (userType === "admin") {
            payload = {
                username,
                password: hashPassword(password),
            };
        } else if (userType === "vendedor") {
            payload = {
                username,
                password: hashPassword(password),
                phone,
                adminId,
                saldo,
                tipoComissao,
                valorComissao,
            };
        } else if (userType === "usuario") {
            payload = {
                username,
                password: hashPassword(password),
                phone,
                adminId,
                sellerId,
                pix,
                saldo,
            };
        }

        fetch(`/api/admins/`, {
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

    useEffect(() => {
        //TODO: add folder for fetching adminId based on adminId
        //TODO: Check to see if its working
        fetch(`/api/admins/`)
            .then((response) => response.json())
            .then((data) => {
                setAdminId(data.id);
            })
            .catch((error) => console.error("Error:", error));

        //TODO: add folder for fetching sellerId based on sellerId
        //TODO: Check to see if its working
        if (userType === "vendedor") {
            fetch(`/api/vendedores/`)
                .then((response) => response.json())
                .then((data) => {
                    setSellerId(data.id);
                })
                .catch((error) => console.error("Error:", error));
        }
    }, [userType]);

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

                        <input
                            type="tel"
                            name="phone"
                            id="phone"
                            className={styles.input}
                            value={phone}
                            onChange={handlePhone}
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
                            onChange={handleSaldo}
                        />
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
                                        checked={selectedRadioButton === radio.value}
                                        onChange={handleRadioChange}
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
                                value={valorComissao}
                                onChange={handleValorComissao}
                            />
                        </div>
                    </section>
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
                        onChange={handlePix}
                    />
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
