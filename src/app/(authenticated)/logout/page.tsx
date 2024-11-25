"use client";
import PageHeader from "components/pageHeader/PageHeader";
import React from "react";
import Title from "components/title/Title";
import SimpleButton from "components/(buttons)/simpleButton/SimpleButton";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

const Logout = () => {
    // Somewhere in your client code

    return (
        <>
            <PageHeader title="Sair" subpage={false} linkTo={""} />
            <main className="main">
                <Title h={2}>Tem certeza de que deseja sair?</Title>
                <SimpleButton
                    btnTitle="Sair"
                    isSelected={true}
                    func={() => {
                        console.log("logout button clicked");

                        signOut({ callbackUrl: "/login" });
                    }}
                />
            </main>
        </>
    );
};

export default Logout;
