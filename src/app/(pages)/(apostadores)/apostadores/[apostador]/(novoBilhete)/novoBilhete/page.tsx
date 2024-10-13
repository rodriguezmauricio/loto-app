"use client"; // Marks the component to be rendered on the client side

// Importing required components and CSS styles from the project structure
import Title from "@/app/components/title/Title";
import styles from "./novoBilhete.module.css";
import PageHeader from "@/app/components/pageHeader/PageHeader";
import TabsWithFilters from "@/app/components/tabsWithFilters/TabsWithFilters";
import IconCard from "@/app/components/iconCard/IconCard";
import ChooseNumbersComp from "@/app/components/chooseNumbersComp/ChooseNumbersComp";
import SimpleButton from "@/app/components/(buttons)/simpleButton/SimpleButton";
import { useEffect, useState, useRef } from "react";
import Buttons from "@/app/components/(buttons)/buttons/Buttons";
import { tempDb } from "@/tempDb"; // Import tempDb
import ResultsCard from "@/app/components/resultsCard/ResultsCard";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toPng, toJpeg } from "html-to-image";
import { saveAs } from "file-saver";

export interface IModalidade {
  name: string;
  color: string;
  betNumbers: number[];
  trevoAmount: number[];
  maxNumber: number;
}

const NovoBilhete = () => {
  // State variables
  const [addBilheteSelectedButton, setAddBilheteSelectedButton] = useState("importar");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [acertos, setAcertos] = useState(0);
  const [premio, setPremio] = useState(0);
  const [apostador, setApostador] = useState("");
  const [tipoBilhete, setTipoBilhete] = useState(0);
  const [dataResultado, setDataResultado] = useState<Date | null>(new Date());
  const [selectedNumbersArr, setSelectedNumbersArr] = useState<string[]>([]);
  const [importedNumbersArr, setImportedNumbersArr] = useState<string[]>([]);
  const [nomeConsultor, setNomeVendedor] = useState<string>("");
  const [numeroBilhete, setNumeroBilhete] = useState<number>(0);
  const [textAreaValue, setTextAreaValue] = useState("");
  const [modalidadeSetting, setModalidadeSetting] = useState<any[]>([]);
  const [modalidadeContent, setModalidadeContent] = useState<IModalidade>();
  const [selectedJogos, setSelectedJogos] = useState<number>(1);
  const [generatedGames, setGeneratedGames] = useState<number[][]>([]);
  const [numberOfGames, setNumberOfGames] = useState<number>(1);

  const divRefs = useRef<(HTMLDivElement | null)[]>([]); // Refs for divs to export to PDF
  const cardRef = useRef<HTMLDivElement | null>(null); // Ref for exporting individually

  const exportAsImage = async (format = "png", saveToClipboard = false) => {
    if (cardRef.current === null) return;

    try {
      let dataUrl;
      if (format === "jpeg") {
        dataUrl = await toJpeg(cardRef.current, { quality: 0.95 });
      } else {
        dataUrl = await toPng(cardRef.current);
      }

      // Convert data URL to Blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();

      if (saveToClipboard) {
        try {
          await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
        } catch (err) {
          console.error("Failed to copy image to clipboard", err);
        }
      } else {
        const fileName = format === "jpeg" ? "card.jpg" : "card.png";
        saveAs(blob, fileName);
      }
    } catch (err) {
      console.error("Error exporting image", err);
    }
  };

  const modalidadeSettingObj = {
    modalidadesCaixa: modalidadeSetting[0],
    modalidadeSabedoria: modalidadeSetting[1],
    modalidadePersonalizada: modalidadeSetting[2],
  };

  const handleExportPDF = async () => {
    let pdf: jsPDF | null = null;

    for (let i = 0; i < divRefs.current.length; i++) {
      const div = divRefs.current[i];
      if (div) {
        const canvas = await html2canvas(div, { scale: window.devicePixelRatio });
        const imgData = canvas.toDataURL("image/png");
        const divWidth = canvas.width;
        const divHeight = canvas.height;

        const pdfWidth = divWidth * 0.264583; // Convert pixels to mm
        const pdfHeight = divHeight * 0.264583;

        if (i === 0) {
          pdf = new jsPDF({
            orientation: divWidth > divHeight ? "landscape" : "portrait",
            unit: "mm",
            format: [pdfWidth, pdfHeight],
          });
        } else {
          pdf?.addPage([pdfWidth, pdfHeight], divWidth > divHeight ? "landscape" : "portrait");
        }

        pdf?.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      }
    }

    if (pdf) {
      pdf.save("jogos.pdf");
    }
  };

  const handleModalidadeContent = (settingsObj: IModalidade) => {
    setModalidadeContent(settingsObj);
  };

  const handleNumeroDeJogosSelecionado = (event: any) => {
    const value = event.target.value;
    setSelectedJogos(value);
  };

  const handlePremio = (event: any) => {
    const value = event.target.value;
    setPremio(value);
  };

  const handleAcertos = (event: any) => {
    const value = event.target.value;
    setAcertos(value);
  };

  const handleApostador = (event: any) => {
    const value = event.target.value;
    setApostador(value);
  };

  const handleTipoBilhete = (event: any) => {
    const value = event.target.value;
    setTipoBilhete(value);
  };

  const handleNomeConsultor = (event: any) => {
    const value = event.target.value;
    setNomeVendedor(value);
  };

  const handleNumeroBilhete = (event: any) => {
    const value = event.target.value;
    setNumeroBilhete(value);
  };

  const handleTextAreaContent = (e: any) => {
    const content = e.target.value;
    setTextAreaValue(content);

    if (!content.trim()) {
      setImportedNumbersArr([]);
      return;
    }

    const result = content.split(",").map((match: string) => {
      const numbers = match
        .trim()
        .split(" ")
        .filter((num) => num !== "")
        .map(Number)
        .sort((a, b) => a - b);
      return numbers;
    });

    setImportedNumbersArr(result);
  };

  const handleSelectedBilhete = (selected: string) => {
    setAddBilheteSelectedButton(selected);
  };

  const handleNumberOfGamesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumberOfGames(Number(e.target.value));
  };

  const handleGenerateGames = () => {
    if (!modalidadeContent || modalidadeContent.maxNumber < selectedJogos) {
      console.error("Invalid modalidade settings or numbersPerGame is too high.");
      return; // Prevent further execution if validation fails
    }

    const games: number[][] = [];
    for (let i = 0; i < numberOfGames; i++) {
      const game = generateRandomGame(modalidadeContent.maxNumber, selectedJogos);
      games.push(game);
    }
    setGeneratedGames(games);
  };

  const addBilheteCompToRender = (button: string) => {
    if (button === "importar") {
      return (
        <>
          <div>
            <div className="divider"></div>
            <Title h={2}>{modalidadeContent?.name || ""}</Title>

            <section className={styles.checkJogosDiv}>
              <textarea
                className={styles.textArea}
                placeholder="1 2 3 4, 5 6 7 8, 9 10 11 12..."
                cols={30}
                rows={12}
                value={textAreaValue}
                onChange={handleTextAreaContent}
              ></textarea>

              <div>
                <Title h={3}>Instruções:</Title>
                <li>Para mais de um jogo, coloque uma vírgula entre os jogos.</li>
                <li>Cada número deve estar separado por um espaço.</li>
                <li>Exemplo: 1 2 3 , 4 5 6 7 , 8 9 10 11...</li>
              </div>
            </section>

            {importedNumbersArr.length > 0 && (
              <section className={styles.inputRow}>
                <SimpleButton btnTitle="Exportar Pdf" func={handleExportPDF} isSelected />

                <Title h={3}>{`Total de jogos importados: ${importedNumbersArr.length}`}</Title>
                <Title h={3}>{`Jogos Importados`}</Title>

                {importedNumbersArr.map((item: any, index) => (
                  <div
                    key={index}
                    ref={(el) => {
                      divRefs.current[index] = el;
                    }}
                  >
                    {" "}
                    {/* Correctly using ref */}
                    {`Jogo ${index + 1} : `}
                    {item.join(", ")}.
                    <ResultsCard
                      numbersArr={[...item]}
                      acertos={acertos}
                      premio={premio}
                      apostador={apostador}
                      quantidadeDezenas={selectedJogos}
                      resultado={dataResultado}
                      data={currentDate}
                      hora={currentDate}
                      numeroBilhete={numeroBilhete}
                      consultor={nomeConsultor}
                      tipoBilhete={tipoBilhete}
                    />
                  </div>
                ))}
              </section>
            )}
          </div>
        </>
      );
    }

    if (button === "manual") {
      return (
        <>
          <ChooseNumbersComp
            numbersToRender={modalidadeContent?.maxNumber}
            selectionLimit={modalidadeContent?.betNumbers.at(-1)}
            numbersArr={selectedNumbersArr}
            numbersArrSetter={setSelectedNumbersArr}
          />
          {/* Display the generated games */}
          {generatedGames.length > 0 && (
            <div>
              <SimpleButton btnTitle="Exportar Pdf" func={handleExportPDF} isSelected />
              <h3>Jogos Gerados:</h3>
              {generatedGames.map((game, index) => (
                <div
                  key={index}
                  ref={(el) => {
                    divRefs.current[index] = el;
                  }}
                >
                  <strong>Jogo {index + 1}:</strong> {game.join(", ")}
                  <ResultsCard
                    numbersArr={[...game]}
                    acertos={acertos}
                    premio={premio}
                    consultor={nomeConsultor}
                    apostador={apostador}
                    quantidadeDezenas={selectedJogos}
                    resultado={dataResultado}
                    data={currentDate}
                    hora={currentDate}
                    numeroBilhete={numeroBilhete - 1 + 1 + index}
                    tipoBilhete={tipoBilhete}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      );
    }

    // Handle "random" option similarly...
  };

  useEffect(() => {
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

  // Function to generate a random game of unique numbers
  const generateRandomGame = (maxNumber: number, gameSize: number) => {
    const game = new Set<number>(); // Use Set to avoid duplicates
    while (game.size < gameSize) {
      const randomNum = Math.floor(Math.random() * maxNumber) + 1;
      game.add(randomNum);
    }
    return Array.from(game).sort((a, b) => a - b); // Convert Set to array and sort
  };

  // SECTION: COMPONENTS RETURN STATEMENT
  return (
    <>
      <PageHeader title="Novo Bilhete" subpage linkTo={`/apostadores`} />
      <main className="main">
        <section>
          <Title h={2}>Sorteios</Title>
          <section className={styles.buttonFilterRow}>
            <TabsWithFilters
              modalidadeSetting={modalidadeSettingObj}
              handleModalidadeContent={handleModalidadeContent}
            />
          </section>
          <section>
            <IconCard
              icon="lotto"
              title="Titulo do sorteio"
              description="data e hora do sorteio"
              fullWidth
              isClickable={false}
            />
          </section>
        </section>
        <section>
          <Title h={2}>Bilhetes</Title>
          <section className={styles.inputsRow}>
            <div className={styles.buttonRow}>
              <SimpleButton
                isSelected={addBilheteSelectedButton === "importar"}
                btnTitle="Importar"
                func={() => handleSelectedBilhete("importar")}
              />
              <SimpleButton
                isSelected={addBilheteSelectedButton === "manual"}
                btnTitle="Adicionar Manualmente"
                func={() => handleSelectedBilhete("manual")}
              />
              <SimpleButton
                isSelected={addBilheteSelectedButton === "random"}
                btnTitle="Aleatório"
                func={() => handleSelectedBilhete("random")}
              />
            </div>
          </section>
        </section>
        <div className={styles.inputsRow}>
          <label htmlFor="nomeConsultor">Nome do Consultor:</label>
          <input
            className={styles.smallInput}
            type="text"
            placeholder="Consultor"
            id="nomeConsultor"
            value={nomeConsultor}
            onChange={handleNomeConsultor}
          />
        </div>
        <div className={styles.inputsRow}>
          <label htmlFor="apostador">Nome do Apostador:</label>
          <input
            className={styles.smallInput}
            type="text"
            placeholder="Apostador"
            id="apostador"
            value={apostador}
            onChange={handleApostador}
          />
        </div>
        <div className={styles.inputsRow}>
          <label htmlFor="numeroBilhete">Número do Bilhete:</label>
          <input
            className={styles.smallInput}
            type="number"
            id="numeroBilhete"
            value={numeroBilhete}
            onChange={handleNumeroBilhete}
          />
        </div>
        <div className={styles.inputsRow}>
          <label className={styles.inputLabel} htmlFor="numberOfGames">
            Número de jogos:
          </label>
          <input
            className={styles.smallInput}
            type="number"
            id="numberOfGames"
            value={numberOfGames}
            onChange={handleNumberOfGamesChange}
          />
        </div>
        <section className={styles.jogosRow}>
          {addBilheteCompToRender(addBilheteSelectedButton)}
        </section>
      </main>
    </>
  );
};

export default NovoBilhete;
