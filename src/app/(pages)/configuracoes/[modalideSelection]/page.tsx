"use client";

import Title from "@/app/components/title/Title";
import styles from "./modalidadeSelection.module.css";
import PageHeader from "@/app/components/pageHeader/PageHeader";
import ConfigOptionsCard from "@/app/components/configOptionsCard/ConfigOptionsCard";
import { FaClover } from "react-icons/fa6";
import { useEffect, useState } from "react";

type Modalidades = {
  name: string;
  color: string;
};

const ModalidadeSelection = () => {
  const [modalidadeList, setModalidadeList] = useState([]);

  const URL = "http://localhost:3500/modalidadesCaixa";

  const getModalidadeName = URL.split("modalidades")[1];

  const fetchData = async () => {
    try {
      await fetch(URL)
        .then((response) => response.json())
        .then((data) => {
          setModalidadeList(data);
        });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  console.log(modalidadeList);

  return (
    <>
      <PageHeader title={`Modalidades ${getModalidadeName}`} subpage linkTo="/configuracoes" />
      <main className="main">
        <section className={styles.section}>
          <Title h={2}>Modalidades</Title>
          <div className={styles.container}>
            {modalidadeList.length > 0 &&
              modalidadeList.map((modalidade: Modalidades) => {
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
