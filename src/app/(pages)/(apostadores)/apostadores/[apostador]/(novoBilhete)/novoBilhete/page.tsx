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
    // VARS:
    const [addBilheteSelectedButton, setAddBilheteSelectedButton] = useState("importar");
    const [currentDate, setCurrentDate] = useState(new Date()); // current date and time when the game was generated
    const [acertos, setAcertos] = useState(0); // set the number of matched numbers
    const [premio, setPremio] = useState(0); // prize value
    const [apostador, setApostador] = useState(""); // name of the person who is placing the bets
    const [tipoBilhete, setTipoBilhete] = useState(0); // string saying if the tickets are regumar or promotional
    const [dataResultado, setDataResultado] = useState<Date | null>(new Date()); // date of the result
    const [selectedNumbersArr, setSelectedNumbersArr] = useState<string[]>([]); // selected numbers in the game as strings
    const [importedNumbersArr, setImportedNumbersArr] = useState<string[]>([]); // imported numbers in the game as strings
    const [nomeConsultor, setNomeVendedor] = useState<string>(""); // name of the person who sold the bets
    const [lote, setLote] = useState<string>(""); // starting lot number / name of the lottery
    const [numeroBilhete, setNumeroBilhete] = useState<number>(0); //starter number of the lottery ticket
    const [textAreaValue, setTextAreaValue] = useState(""); // content of the text area for imported games
    const [modalidadeSetting, setModalidadeSetting] = useState<any[]>([]);
    const [modalidadeContent, setModalidadeContent] = useState<IModalidade>();
    const [quantidadeDeDezenas, setQuantidadeDeDezenas] = useState<number>(1); // selected numbers for random games
    const [generatedGames, setGeneratedGames] = useState<number[][]>([]); // games that were generated
    const [numberOfGames, setNumberOfGames] = useState<number>(1); // number of games to be generated

    const divRefs = useRef<(HTMLDivElement | null)[]>([]); // Refs for divs to export to PDF
    const cardRef = useRef<HTMLDivElement | null>(null); // Ref for exporting individually

    //HANDLERS:

    //exports image for single tickets in jpg, png or copying to the clipboard
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

    // export all tickets to a single PDF
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
                    pdf?.addPage(
                        [pdfWidth, pdfHeight],
                        divWidth > divHeight ? "landscape" : "portrait"
                    );
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

    const handleQuantidadeDezenasSelecionadas = (event: any) => {
        const value = event.target.value;
        setQuantidadeDeDezenas(value);
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

    const handleLote = (event: any) => {
        const value = event.target.value;
        setLote(value);
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

        const result = content.split("\n").map((match: string) => {
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
        if (!modalidadeContent || modalidadeContent.maxNumber < quantidadeDeDezenas) {
            console.error("Invalid modalidade settings or numbersPerGame is too high.");
            return; // Prevent further execution if validation fails
        }

        const games: number[][] = [];
        for (let i = 0; i < numberOfGames; i++) {
            const game = generateRandomGame(modalidadeContent.maxNumber, quantidadeDeDezenas);
            games.push(game);
        }
        setGeneratedGames(games);
    };

    //FUNCTIONS:
    const addBilheteCompToRender = (button: string) => {
        const renderExportButtons = () => (
            <div className={styles.buttonRow}>
                <SimpleButton
                    btnTitle="Export as PNG"
                    func={() => exportAsImage("png")}
                    isSelected={false}
                />
                <SimpleButton
                    btnTitle="Export as JPEG"
                    func={() => exportAsImage("jpeg")}
                    isSelected={false}
                />
                <SimpleButton
                    btnTitle="Copy Image"
                    func={() => exportAsImage("png", true)}
                    isSelected={false}
                />
            </div>
        );

        if (button === "importar") {
            return (
                <>
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
                            <SimpleButton
                                btnTitle="Exportar Pdf"
                                func={handleExportPDF}
                                isSelected
                            />
                            <Title
                                h={3}
                            >{`Total de jogos importados: ${importedNumbersArr.length}`}</Title>
                            <Title h={3}>{`Jogos Importados`}</Title>
                            {importedNumbersArr.map((item: any, index) => (
                                <article key={index}>
                                    {`Jogo ${index + 1} : `}
                                    {item.join(", ")}.
                                    <div
                                        ref={(el) => {
                                            divRefs.current[index] = el;
                                        }}
                                    >
                                        <div className="" ref={cardRef}>
                                            <ResultsCard
                                                numeroBilhete={numeroBilhete - 1 + 1 + index}
                                                modalidade={modalidadeContent?.name}
                                                numbersArr={[...item]}
                                                acertos={acertos}
                                                premio={premio}
                                                apostador={apostador}
                                                quantidadeDezenas={quantidadeDeDezenas}
                                                resultado={dataResultado}
                                                data={currentDate}
                                                hora={currentDate}
                                                lote={lote}
                                                consultor={nomeConsultor}
                                                tipoBilhete={tipoBilhete}
                                            />
                                        </div>
                                        {renderExportButtons()}
                                    </div>
                                </article>
                            ))}
                            <Title h={2}>{`${importedNumbersArr.length} Jogos Gerados`}</Title>
                            {importedNumbersArr.map((item: any, index) => (
                                <article key={index}>
                                    {`Jogo ${index + 1} : `}
                                    {item.join(" ")}
                                </article>
                            ))}
                        </section>
                    )}
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
                    {generatedGames.length > 0 && (
                        <div>
                            <SimpleButton
                                btnTitle="Exportar Pdf"
                                func={handleExportPDF}
                                isSelected
                            />
                            <h3>Jogos Gerados:</h3>
                            {generatedGames.map((game, index) => (
                                <article key={index}>
                                    <strong>Jogo {index + 1}:</strong> {game.join(", ")}
                                    <div
                                        ref={(el) => {
                                            divRefs.current[index] = el;
                                        }}
                                    >
                                        <div className="" ref={cardRef}>
                                            <ResultsCard
                                                numeroBilhete={numeroBilhete - 1 + 1 + index}
                                                modalidade={modalidadeContent?.name}
                                                numbersArr={[...game]}
                                                acertos={acertos}
                                                premio={premio}
                                                consultor={nomeConsultor}
                                                apostador={apostador}
                                                quantidadeDezenas={quantidadeDeDezenas}
                                                resultado={dataResultado}
                                                data={currentDate}
                                                hora={currentDate}
                                                lote={lote}
                                                tipoBilhete={tipoBilhete}
                                            />
                                        </div>
                                    </div>
                                    {renderExportButtons()}
                                </article>
                            ))}
                            <Title h={2}>{`${generatedGames.length} Jogos Gerados`}</Title>
                            {generatedGames.map((item: any, index) => (
                                <article key={index}>
                                    {`Jogo ${index + 1} : `}
                                    {item.join(" ")}
                                </article>
                            ))}
                        </div>
                    )}
                </>
            );
        }

        if (button === "random") {
            return (
                <>
                    <div>
                        <Title h={2}>{modalidadeContent?.name || ""}</Title>
                        <div className={styles.inputsRow}>
                            <Title h={3}>Quantidade de Dezenas:</Title>
                            <input
                                className={styles.smallInput}
                                type="number"
                                value={quantidadeDeDezenas}
                                onChange={handleQuantidadeDezenasSelecionadas}
                            />
                        </div>
                        <SimpleButton
                            btnTitle="Gerar Jogos"
                            isSelected={false}
                            func={handleGenerateGames}
                        />
                    </div>
                    {generatedGames.length > 0 && (
                        <div>
                            <SimpleButton
                                btnTitle="Exportar Pdf"
                                func={handleExportPDF}
                                isSelected
                            />
                            <h3>Jogos Gerados:</h3>
                            {generatedGames.map((game, index) => (
                                <article key={index}>
                                    <strong>Jogo {index + 1}:</strong> {game.join(", ")}
                                    <div
                                        ref={(el) => {
                                            divRefs.current[index] = el;
                                        }}
                                    >
                                        <div className="" ref={cardRef}>
                                            <ResultsCard
                                                numeroBilhete={numeroBilhete - 1 + 1 + index}
                                                modalidade={modalidadeContent?.name}
                                                numbersArr={[...game]}
                                                acertos={acertos}
                                                premio={premio}
                                                consultor={nomeConsultor}
                                                apostador={apostador}
                                                quantidadeDezenas={quantidadeDeDezenas}
                                                resultado={dataResultado}
                                                data={currentDate}
                                                hora={currentDate}
                                                lote={lote}
                                                tipoBilhete={tipoBilhete}
                                            />
                                        </div>
                                    </div>
                                    {renderExportButtons()}
                                </article>
                            ))}

                            <Title h={2}>{`${generatedGames.length} Jogos Gerados`}</Title>
                            {generatedGames.map((item: any, index) => (
                                <article key={index}>{item.join(" ")}</article>
                            ))}
                        </div>
                    )}
                </>
            );
        }

        return null; // Default return for unsupported options
    };

    // Function to generate a random game of unique numbers
    const generateRandomGame = (maxNumber: number, gameSize: number) => {
        const game = new Set<number>(); // Use Set to avoid duplicates
        while (game.size < gameSize) {
            const randomNum = Math.floor(Math.random() * maxNumber) + 1;
            game.add(randomNum);
        }
        return Array.from(game).sort((a, b) => a - b); // Convert Set to array and sort
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

    // SECTION: COMPONENTS RETURN STATEMENT
    return (
        <>
            <PageHeader title="Novo Bilhete" subpage linkTo={`/apostadores`} />
            <main className="main">
                <section>
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
                        <label htmlFor="lote">Lote:</label>
                        <input
                            className={styles.smallInput}
                            type="text"
                            id="lote"
                            value={lote}
                            onChange={handleLote}
                        />
                    </div>
                    <div className={styles.inputsRow}>
                        <label htmlFor="numeroBilhete">Número bilhete:</label>
                        <input
                            className={styles.smallInput}
                            type="number"
                            id="numeroBilhete"
                            value={numeroBilhete}
                            onChange={handleNumeroBilhete}
                        />
                    </div>
                    <div className={styles.inputsRow}>
                        <label htmlFor="acertos">Acertos:</label>
                        <input
                            className={styles.smallInput}
                            type="number"
                            id="acertos"
                            value={acertos}
                            onChange={handleAcertos}
                        />
                    </div>
                    <div className={styles.inputsRow}>
                        <label htmlFor="premio">Prêmio:</label>
                        <input
                            className={styles.smallInput}
                            type="number"
                            id="premio"
                            value={premio}
                            onChange={handlePremio}
                        />
                    </div>
                    <div className={styles.inputsRow}>
                        <label htmlFor="tipoBilhete">Valor Bilhete:</label>
                        <input
                            className={styles.smallInput}
                            type="number"
                            id="tipoBilhete"
                            value={tipoBilhete}
                            onChange={handleTipoBilhete}
                        />
                    </div>
                    <div className={styles.inputsRow}>
                        <label htmlFor="dataResultado">Data do Sorteio:</label>
                        <DatePicker
                            className={styles.smallInput}
                            selected={dataResultado}
                            onChange={(date) => setDataResultado(date)}
                            dateFormat="dd/MM/yyyy"
                        />
                    </div>
                    <div className={styles.inputsRow}>
                        <label htmlFor="numberOfGames">Número de jogos:</label>
                        <input
                            className={styles.smallInput}
                            type="number"
                            id="numberOfGames"
                            value={numberOfGames}
                            onChange={handleNumberOfGamesChange}
                        />
                    </div>
                </section>
                <section className={styles.jogosRow}>
                    {addBilheteCompToRender(addBilheteSelectedButton)}
                </section>
            </main>
        </>
    );
};

export default NovoBilhete;
