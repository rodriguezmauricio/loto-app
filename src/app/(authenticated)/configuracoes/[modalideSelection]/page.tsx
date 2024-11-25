"use client";

import Title from "components/title/Title";
import styles from "./modalidadeSelection.module.css";
import PageHeader from "components/pageHeader/PageHeader";
import ConfigOptionsCard from "components/configOptionsCard/ConfigOptionsCard";
import { FaClover } from "react-icons/fa6";
import useFetchData from "@/app/utils/useFetchData";

type Modalidades = {
    name: string;
    color: string;
};

const ModalidadeSelection = () => {
    const URL = "http://localhost:3500/modalidadesCaixa";

    const getModalidadeName = URL.split("modalidades")[1];

    const { data } = useFetchData(URL);

    return (
        <>
            <PageHeader
                title={`Modalidades ${getModalidadeName}`}
                subpage
                linkTo="/configuracoes"
            />
            <main className="main">
                <section className={styles.section}>
                    <Title h={2}>Modalidades</Title>
                    <div className={styles.container}>
                        {data?.length > 0 &&
                            data.map((modalidade: Modalidades) => {
                                return (
                                    <ConfigOptionsCard
                                        key={modalidade.name}
                                        type="button"
                                        icon={<FaClover size={30} color={modalidade.color} />}
                                        text={modalidade.name}
                                    />
                                );
                            })}
                    </div>
                </section>
            </main>
        </>
    );
};

export default ModalidadeSelection;
