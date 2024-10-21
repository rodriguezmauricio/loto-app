// src/app/(pages)/adicionarUsuario/page.tsx
"use client";
import { useState } from "react";
import AddAdminForm, { UserType } from "../../components/addUserForms/AddAdminForm";
import PageHeader from "@/app/components/pageHeader/PageHeader";
import SimpleButton from "@/app/components/(buttons)/simpleButton/SimpleButton";
import Title from "@/app/components/title/Title";
import useStore from "../../../../store/useStore";

export interface IRadioOptions {
    value: string;
    label: string;
}

const AdicionarUsuario: React.FC<{ params: { id: string } }> = ({ params }) => {
    const { id } = params; // Extracting id from params if needed
    const loggedInAdminId = useStore((state) => state.loggedInAdminId);
    const loggedInSellerId = useStore((state) => state.loggedInSellerId);
    const [userToAdd, setUserToAdd] = useState<UserType | null>(null); // Allowing null
    const [selectedRadioButton, setSelectedRadioButton] = useState("");

    const radioOptions: IRadioOptions[] = [
        { value: "percent", label: "Porcentagem" },
        { value: "absolute", label: "Valor em R$" },
    ];

    const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedRadioButton(e.target.value);
    };

    const handleUserToAdd = (type: UserType) => {
        setUserToAdd(type);
        console.log(type);
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

                {/* Render user form based on the type of user */}
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
};

export default AdicionarUsuario;
