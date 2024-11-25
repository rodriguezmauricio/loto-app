"use client";

import IconCard from "components/iconCard/IconCard";
import PageHeader from "components/pageHeader/PageHeader";
import Title from "components/title/Title";
import styles from "./gerenciadorDeExclusao.module.css";
import SimpleButton from "components/(buttons)/simpleButton/SimpleButton";
import { useState } from "react";
import Buttons from "components/(buttons)/buttons/Buttons";

const GerenciadorDeExclusao = () => {
    const [selectedButton, setSelectedButton] = useState("naoAgrupar");
    const [selectAllFilter, setSelectAllFilter] = useState(false);

    const handleSelectedbutton = (newValue: string) => {
        setSelectedButton(newValue);
    };

    const handleSelectAllFilter = () => {
        setSelectAllFilter(!selectAllFilter);
    };

    return (
        <>
            <PageHeader title="Gerenciador de exclusão" subpage linkTo={`/apostadores`} />
            <main className="main">
                <section>
                    <Title h={2}>Agrupar por:</Title>
                    <section className={styles.buttonFilterRow}>
                        <SimpleButton
                            btnTitle="Não agrupar"
                            isSelected={selectedButton === "naoAgrupar"}
                            func={() => handleSelectedbutton("naoAgrupar")}
                        />
                        <SimpleButton
                            btnTitle="Vendedor"
                            isSelected={selectedButton === "vendedor"}
                            func={() => handleSelectedbutton("vendedor")}
                        />
                        <SimpleButton
                            btnTitle="Apostador"
                            isSelected={selectedButton === "apostador"}
                            func={() => handleSelectedbutton("apostador")}
                        />
                    </section>

                    <section>
                        <Title h={2}>Bilhetes a serem excluídos</Title>
                        <div className={styles.buttonFilterRow}>
                            <Buttons buttonType="cancelDelete" />
                            <Buttons buttonType="delete" />
                        </div>
                    </section>

                    <section>
                        <div className={styles.buttonFilterRow}>
                            <SimpleButton
                                btnTitle="Selecionar todos"
                                isSelected={selectAllFilter}
                                func={handleSelectAllFilter}
                            />
                            <span>Bilhetes selecionados: 0</span>
                        </div>
                        <IconCard
                            title="Título do Bilhete"
                            description="Descrição do bilhete"
                            icon="ticket"
                            fullWidth
                            hasCheckbox
                        />
                    </section>
                </section>
            </main>
        </>
    );
};

export default GerenciadorDeExclusao;
