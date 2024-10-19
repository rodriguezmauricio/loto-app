"use client";
import { useState } from "react";
// import styles from "./adicionarUsuario.modules.scss";
import AddAdminForm, { UserType } from "../../components/addUserForms/AddAdminForm";
import PageHeader from "@/app/components/pageHeader/PageHeader";
import SimpleButton from "@/app/components/(buttons)/simpleButton/SimpleButton";
import { hashPassword } from "@/app/utils/utils";
import Title from "@/app/components/title/Title";

export interface IRadioOptions {
    value: string;
    label: string;
}

function AdicionarUsuario({ id }: { id: string }) {
    //VARS:
    const [userToAdd, setUserToAdd] = useState<UserType>();
    const [userInfo, setUserInfo] = useState({
        username: "",
        password: "",
    });

    const [userData, setUserData] = useState();

    const [selectedRadioButton, setSelectedRadioButton] = useState("");

    const radioOptions = [
        { value: "percent", label: "Porcentagem" },
        { value: "absolute", label: "Valor em R$" },
    ];

    //HANDLERS:
    const handleRadioChange = (e: any) => {
        setSelectedRadioButton(e.target.value);
    };

    const handleUserToAdd = (e: any) => {
        setUserToAdd(e);
        console.log(e);
    };

    /* 
    The function below is used to add a new user to the system.
    it sends the user info to the form and add them to the database based on the user type.
    */
    const handleSendUserInfo = async (e: any) => {
        e.preventDefault();

        const payload = {
            username: userInfo.username,
            password: hashPassword(userInfo.password),
            userType: userToAdd,
            // TODO: add more fields based on user type
        };

        fetch(`/api/users/${id}`, {
            method: "POST",
            body: JSON.stringify(payload),
        })
            .then((response) => response.json())
            .then((data) => {
                setUserData(data);
            })
            .catch((error) => console.error("Error:", error));
    };

    return (
        <>
            <PageHeader title="Adicionar Usuário" subpage linkTo={`/`} />
            <main className="main">
                <Title h={2}>Selecione o tipo de usuário para adicionar</Title>
                <SimpleButton
                    btnTitle="Admin"
                    func={() => handleUserToAdd("admin")}
                    isSelected={false}
                />
                <SimpleButton
                    btnTitle="Vendedor"
                    func={() => handleUserToAdd("vendedor")}
                    isSelected={false}
                />
                <SimpleButton
                    btnTitle="Usuário"
                    func={() => handleUserToAdd("usuario")}
                    isSelected={false}
                />

                {/* Render user form besd on the type of user
                    Calls the handleSendUserInfo function when form is submitted
                    It contains the form data
                */}
                {userToAdd && (
                    <AddAdminForm
                        userType={userToAdd}
                        radioOptions={radioOptions}
                        selectedRadioOption={selectedRadioButton}
                        radioHandler={handleRadioChange}
                        submitInfo={(e) => handleSendUserInfo(e)}
                    />
                )}
            </main>
        </>
    );
}

export default AdicionarUsuario;
