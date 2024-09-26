"use client";

import styles from "./verificarJogos.module.css";
import PageHeader from "@/app/components/pageHeader/PageHeader";
import TabsWithFilters from "@/app/components/tabsWithFilters/TabsWithFilters";
import Title from "@/app/components/title/Title";
import React, { useEffect, useState } from "react";
import { tempDb } from "@/tempDb"; // Import tempDb

import { IModalidade } from "../(apostadores)/apostadores/[apostador]/(novoBilhete)/novoBilhete/page";

function VerificarJogos() {
  const [modalidadeSetting, setModalidadeSetting] = useState<any[]>([]);

  const [modalidadeContent, setModalidadeContent] = useState<IModalidade>();

  // State to store imported numbers from text input
  const [importedNumbersArr, setImportedNumbersArr] = useState<string[]>([]);

  const [selectedNumbersArr, setSelectedNumbersArr] = useState<string[]>([]);

  // State to store the current text value in the text area
  const [textAreaValue, setTextAreaValue] = useState("");

  const modalidadeSettingObj = {
    modalidadesCaixa: modalidadeSetting[0], // Assuming modalidadesCaixa is the first item in the array
    modalidadeSabedoria: modalidadeSetting[1], // Assuming modalidadeSabedoria is the second item
    modalidadePersonalizada: modalidadeSetting[2], // Assuming modalidadePersonalizada is the third item
  };

  const handleModalidadeContent = (settingsObj: IModalidade) => {
    setModalidadeContent(settingsObj);
    console.log(settingsObj);
  };

  // Function to handle text input changes in the text area
  const handleTextAreaContent = (e: any) => {
    const content = e.target.value;
    setTextAreaValue(content); // Update the text area value in the state
  };

  useEffect(() => {
    // Fetch data from tempDb instead of the URL
    const fetchData = async () => {
      try {
        const data = await tempDb.modalidades; // Adjust according to how tempDb is used
        setModalidadeSetting(data); // Make sure data is an array
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  console.log(importedNumbersArr);

  return (
    <>
      <PageHeader title="Verificar Jogos" subpage={false} linkTo={``} />
      <main className="main">
        <section>
          <Title h={2}>Modalidade</Title>
          <section className={styles.buttonFilterRow}>
            <TabsWithFilters
              modalidadeSetting={modalidadeSettingObj}
              handleModalidadeContent={handleModalidadeContent}
            />
          </section>
        </section>

        <section>
          <Title h={3}>Adicione os números vencedores</Title>
          <textarea
            className={styles.textArea}
            placeholder="(1,2,3,4,5,6,7) + (2,5,7,9,10,12,15) + (1,2,3,5,7,8,9)..."
            cols={30}
            rows={12}
            value={textAreaValue}
            onChange={handleTextAreaContent}
          ></textarea>
        </section>

        {/* //TODO: TEMPORARY RETURN */}
        <div className={styles.checkJogosDiv}>
          <Title h={3}>{`Total de jogos importados: ${importedNumbersArr.length}`}</Title>
          <Title h={3}>{`Jogos Importados`}</Title>

          {/* Display each imported game */}
          {importedNumbersArr.length > 0 &&
            importedNumbersArr.map((item: any, index) => {
              return (
                <div key={index}>
                  {`Jogo ${index + 1} : `}
                  {item.join(", ")}.
                </div>
              );
            })}
          {/* Render the selected numbers if any */}
          {selectedNumbersArr}
        </div>
      </main>
    </>
  );
}

export default VerificarJogos;
