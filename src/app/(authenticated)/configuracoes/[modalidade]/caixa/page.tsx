"use client";

import ConfigOptionsCard from "components/configOptionsCard/ConfigOptionsCard";
import PageHeader from "components/pageHeader/PageHeader";
import Title from "components/title/Title";
import React from "react";
import { TbCloverFilled } from "react-icons/tb";
import { tempDb } from "tempDb";

const ConfigModalidadeCaixa = () => {
    const ICON_SIZE = 20;

    const caixa = tempDb.modalidades[0].Caixa;

    return (
        <>
            <PageHeader title="Modalidades Caixa" subpage={false} linkTo={""} />
            <main>
                <Title h={3}>Selecione as loterias que deseja mostrar </Title>
                <div>
                    {caixa?.map((modalidade: any) => {
                        return (
                            <ConfigOptionsCard
                                key={modalidade.name}
                                type="switch"
                                text={modalidade.name}
                                value={true}
                                icon={<TbCloverFilled size={ICON_SIZE} />}
                            />
                        );
                    })}
                </div>
            </main>
        </>
    );
};

export default ConfigModalidadeCaixa;
