"use client";
import { useState } from "react";
// import styles from "./adicionarUsuario.modules.scss";
import AddAdminForm, { UserType } from "../../components/addUserForms/AddAdminForm";
import PageHeader from "@/app/components/pageHeader/PageHeader";
import SimpleButton from "@/app/components/(buttons)/simpleButton/SimpleButton";
import { hashPassword } from "@/app/utils/utils";
import Title from "@/app/components/title/Title";
import useStore from "../../../../store/useStore";

export interface IRadioOptions {
    value: string;
    label: string;
}

function AdicionarUsuario({ id }: { id: string }) {
    //VARS:

    const loggedInAdminId = useStore((state) => state.loggedInAdminId);
    const loggedInSellerId = useStore((state) => state.loggedInSellerId);
    const [userToAdd, setUserToAdd] = useState<UserType>();
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

                {/* Render user form based on the type of user
                    Calls the handleSendUserInfo function when form is submitted
                    It contains the form data
                */}
                {userToAdd && (
                    <AddAdminForm
                        userType={userToAdd}
                        radioOptions={radioOptions}
                        selectedRadioOption={selectedRadioButton}
                        radioHandler={handleRadioChange}
                        adminId={loggedInAdminId}
                        sellerId={loggedInSellerId}
                    />
                )}
            </main>
        </>
    );
}

export default AdicionarUsuario;
