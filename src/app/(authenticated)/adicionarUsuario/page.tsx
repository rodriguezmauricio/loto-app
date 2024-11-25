// src/app/(pages)/adicionarUsuario/page.tsx
"use client";
import { useState } from "react";
import AddUsersForm, { UserType } from "../../../components/addUserForms/AddUsersForm";
import PageHeader from "components/pageHeader/PageHeader";
import SimpleButton from "components/(buttons)/simpleButton/SimpleButton";
import Title from "components/title/Title";
import { useUserStore } from "../../../../store/useUserStore";

export interface IRadioOptions {
    value: string;
    label: string;
}

const AdicionarUsuario: React.FC<{ params: { id: string } }> = ({ params }) => {
    const { id } = params; // Extracting id from params if needed
    const [userToAdd, setUserToAdd] = useState<UserType | null>(null); // Allowing null
    const user = useUserStore((state) => state.user);

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
                {userToAdd && <AddUsersForm userType={userToAdd} />}
            </main>
        </>
    );
};

export default AdicionarUsuario;
