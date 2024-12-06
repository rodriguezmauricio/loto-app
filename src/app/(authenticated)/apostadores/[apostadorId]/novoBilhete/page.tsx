"use client";

import React, { useState, useEffect, useRef } from "react";
import PageHeader from "components/pageHeader/PageHeader";
import SimpleButton from "components/(buttons)/simpleButton/SimpleButton";
import Title from "components/title/Title";
import TabsWithFilters from "components/tabsWithFilters/TabsWithFilters";
import ChooseNumbersComp from "components/chooseNumbersComp/ChooseNumbersComp";
import ResultsCard from "components/resultsCard/ResultsCard";
import { useUserStore } from "../../../../../../store/useUserStore";
import { useRouter, useParams } from "next/navigation";
import { tempDb } from "tempDb";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toPng, toJpeg } from "html-to-image";
import { saveAs } from "file-saver";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./novoBilhete.module.scss";

export interface IModalidade {
    name: string;
    color: string;
    betNumbers: number[];
    trevoAmount: number[];
    maxNumber: number;
}

interface Wallet {
    id: string;
    balance: number;
    transactions?: any[];
}

interface Apostador {
    id: string;
    username: string;
    phone: string;
    pix: string;
    role: string;
    admin_id: string | null;
    seller_id: string | null;
    created_on: string;
    wallet: Wallet | null;
}

const NovoBilhete = () => {
    const router = useRouter();
    const params = useParams();
    const { apostadorId } = params;
    const user = useUserStore((state: any) => state.user);

    // Now the top-level tab is the Loteria (Caixa, Sabedoria, Personalizado)
    // and the chosen button inside is the Modalidade.
    const [selectedLoteria, setSelectedLoteria] = useState<string>("Caixa"); // Default top-level (previously modalidade)
    const [selectedModalidade, setSelectedModalidade] = useState<string>("");

    const [apostador, setApostador] = useState<Apostador | null>(null);
    const [modalidadeSetting, setModalidadeSetting] = useState<any[]>([]);
    const [modalidadeContent, setModalidadeContent] = useState<IModalidade | null>(null);

    const [addBilheteSelectedButton, setAddBilheteSelectedButton] = useState("importar");
    const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

    const [selectedNumbersArr, setSelectedNumbersArr] = useState<string[]>([]);
    const [importedNumbersArr, setImportedNumbersArr] = useState<string[][]>([]);
    const [importtextAreaValue, setImportTextAreaValue] = useState("");
    const [quantidadeDeDezenas, setQuantidadeDeDezenas] = useState<number>(1);
    const [quantidadeBilhetes, setQuantidadeBilhetes] = useState<number>(1);
    const [numberOfGames, setNumberOfGames] = useState<number>(1);

    const [generatedGames, setGeneratedGames] = useState<number[][]>([]);
    const [generatedGamesDisplay, setGeneratedGamesDisplay] = useState<string[][]>([]);

    const [maxTickets, setMaxTickets] = useState<number>(0);

    const [formData, setFormData] = useState<{
        consultantName: string;
        apostadorName: string;
        lote: string;
        ticketNumber: number;
        acertos: number;
        prize: number;
        resultDate: Date | null;
        numberOfGames: number;
        currentDate: Date;
        ticketType: string;
        valorBilhete: number;
    }>({
        consultantName: "Consultor Desconhecido",
        apostadorName: "Apostador Desconhecido",
        lote: "Lote Desconhecido",
        ticketNumber: 0,
        acertos: 0,
        prize: 0,
        resultDate: new Date(),
        numberOfGames: 0,
        currentDate: new Date(),
        ticketType: "Tipo Desconhecido",
        valorBilhete: 1,
    });

    const divRefs = useRef<(HTMLDivElement | null)[]>([]);
    const cardRef = useRef<HTMLDivElement | null>(null);

    const hasBets =
        modalidadeContent?.name &&
        ((importedNumbersArr && importedNumbersArr.length > 0) ||
            (generatedGames && generatedGames.length > 0) ||
            (selectedNumbersArr && selectedNumbersArr.length > 0));

    // Updated handleModalidadeContent: now receives (settingsObj, modalidadeName, loteriaName)
    // because top-level is Loteria, inside is Modalidade.
    const handleModalidadeContent = (
        settingsObj: IModalidade,
        modalidadeName: string,
        loteriaName: string
    ) => {
        setModalidadeContent(settingsObj);
        setSelectedLoteria(loteriaName);
        setSelectedModalidade(modalidadeName);
    };

    const exportAsImage = async (format = "png", saveToClipboard = false) => {
        if (cardRef.current === null) return;
        try {
            let dataUrl;
            if (format === "jpeg") {
                dataUrl = await toJpeg(cardRef.current, { quality: 0.95 });
            } else {
                dataUrl = await toPng(cardRef.current);
            }

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

    const handleExportPDF = async () => {
        let pdf: jsPDF | null = null;
        for (let i = 0; i < divRefs.current.length; i++) {
            const div = divRefs.current[i];
            if (div) {
                const canvas = await html2canvas(div, { scale: window.devicePixelRatio });
                const imgData = canvas.toDataURL("image/png");
                const divWidth = canvas.width;
                const divHeight = canvas.height;

                const pdfWidth = divWidth * 0.264583;
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

    const handleNumberOfGamesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNumberOfGames(Number(e.target.value));
    };

    const handleTextAreaContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const content = e.target.value;
        setImportTextAreaValue(content);
        if (!content.trim()) {
            setImportedNumbersArr([]);
            return;
        }

        const result = content.split("\n").map((match: string) => {
            const numbers = match
                .trim()
                .split(" ")
                .filter((num) => num !== "")
                .map((num) => num.padStart(2, "0"));
            return numbers;
        });

        setImportedNumbersArr(result);
    };

    const handleSelectedBilhete = (selected: string) => {
        setAddBilheteSelectedButton(selected);
        setSelectedFilter(selected);
    };

    const handleQuantidadeDeDezenasSelecionadas = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value);
        setQuantidadeDeDezenas(value);
    };

    const generateRandomGame = (maxNumber: number, gameSize: number): number[] => {
        const game = new Set<number>();
        while (game.size < gameSize) {
            const randomNum = Math.floor(Math.random() * maxNumber) + 1;
            game.add(randomNum);
        }
        return Array.from(game).sort((a, b) => a - b);
    };

    const handleGenerateGames = () => {
        if (!modalidadeContent || modalidadeContent.maxNumber < quantidadeDeDezenas) {
            console.error("Invalid modalidade settings or numbersPerGame is too high.");
            return;
        }

        const games: number[][] = [];
        const gamesDisplay: string[][] = [];

        for (let i = 0; i < quantidadeBilhetes; i++) {
            const game = generateRandomGame(modalidadeContent.maxNumber, quantidadeDeDezenas);
            games.push(game);
            const gameDisplay = game.map((num) => num.toString().padStart(2, "0"));
            gamesDisplay.push(gameDisplay);
        }

        setGeneratedGames(games);
        setGeneratedGamesDisplay(gamesDisplay);
    };

    const validateForm = () => {
        if (!formData.consultantName.trim()) {
            alert("Por favor, insira o nome do consultor.");
            return false;
        }
        if (!formData.apostadorName.trim()) {
            alert("Por favor, insira o nome do apostador.");
            return false;
        }
        if (isNaN(formData.valorBilhete) || formData.valorBilhete <= 0) {
            alert("Por favor, insira um valor válido para o bilhete.");
            return false;
        }
        if (isNaN(quantidadeDeDezenas) || quantidadeDeDezenas <= 0) {
            alert("Quantidade de dezenas deve ser pelo menos 1.");
            return false;
        }
        if (!selectedModalidade) {
            alert("Por favor, selecione uma modalidade.");
            return false;
        }
        if (!selectedLoteria) {
            alert("Por favor, selecione uma loteria.");
            return false;
        }
        return true;
    };

    const handleSubmitApostas = async () => {
        if (!validateForm()) return;

        try {
            let games: number[][] = [];
            if (addBilheteSelectedButton === "importar") {
                games = importedNumbersArr.map((game) => game.map((num) => parseInt(num, 10)));
            } else if (addBilheteSelectedButton === "random") {
                games = generatedGames;
            } else if (addBilheteSelectedButton === "manual") {
                if (selectedNumbersArr.length === 0) {
                    console.error("No numbers selected for manual game");
                    alert("Por favor, selecione números para o jogo manual.");
                    return;
                }
                games = [selectedNumbersArr.map((num) => parseInt(num, 10))];
            }

            if (games.length === 0) {
                console.error("No games to submit");
                alert("Nenhum jogo para enviar.");
                return;
            }

            if (!formData.consultantName.trim()) {
                alert("Por favor, insira o nome do consultor.");
                return;
            }

            if (!formData.apostadorName.trim()) {
                alert("Por favor, insira o nome do apostador.");
                return;
            }

            if (!formData.valorBilhete || formData.valorBilhete <= 0) {
                alert("Por favor, insira um valor válido para o bilhete.");
                return;
            }

            const resultDate = formData.resultDate || new Date();
            const totalAmount = formData.valorBilhete * games.length;

            if (
                apostador?.wallet?.balance !== undefined &&
                totalAmount > apostador.wallet.balance
            ) {
                alert("Saldo insuficiente para esta operação.");
                return;
            }

            const horaFormatted = formData.currentDate
                ? formData.currentDate.toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                  })
                : "00:00";

            // Now loteira = top-level, modalidade = chosen button
            const apostaData = {
                userId: apostadorId,
                bets: games.map((game, index) => ({
                    numbers: game,
                    modalidade: selectedModalidade,
                    loteria: selectedLoteria,
                    acertos: Number(formData.acertos) || 0,
                    premio: Number(formData.prize) || 0,
                    consultor: formData.consultantName || "Consultor Desconhecido",
                    apostador: formData.apostadorName || "Apostador Desconhecido",
                    quantidadeDeDezenas: Number(quantidadeDeDezenas) || 0,
                    resultado: resultDate.toISOString(),
                    data: formData.currentDate.toISOString(),
                    hora: horaFormatted,
                    lote: formData.lote || "Lote Desconhecido",
                    tipoBilhete: formData.ticketType || "Tipo Desconhecido",
                    valorBilhete: Number(formData.valorBilhete) || 0,
                })),
                totalAmount: totalAmount,
            };

            console.log("Aposta Data to be sent:", JSON.stringify(apostaData, null, 2));

            for (let i = 0; i < games.length; i++) {
                for (let j = 0; j < games[i].length; j++) {
                    if (games[i][j] > (modalidadeContent?.maxNumber || 60)) {
                        alert(
                            `Número ${games[i][j]} no jogo ${
                                i + 1
                            } excede o valor máximo permitido de ${
                                modalidadeContent?.maxNumber || 60
                            }.`
                        );
                        return;
                    }
                }
            }

            const response = await fetch("/api/apostas", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(apostaData),
                credentials: "include",
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Apostas created successfully:", result);
                alert("Bilhetes criados com sucesso!");

                const updatedApostadorResponse = await fetch(`/api/users/${apostadorId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                });

                if (updatedApostadorResponse.ok) {
                    const updatedApostador: Apostador = await updatedApostadorResponse.json();
                    setApostador(updatedApostador);
                    console.log("Updated Apostador data:", updatedApostador);
                }

                router.push(`/apostadores/${apostadorId}`);
            } else {
                const errorData = await response.json();
                console.error("Failed to create apostas:", errorData);
                alert(errorData.error || "Erro ao criar apostas.");
            }
        } catch (error) {
            console.error("Error creating apostas:", error);
            alert("Ocorreu um erro ao criar apostas.");
        }
    };

    const addBilheteCompToRender = (button: string) => {
        const renderExportButtons = () => (
            <div className={styles.buttonRow}>
                <SimpleButton
                    isSelected={addBilheteSelectedButton === "importar"}
                    btnTitle="Importar"
                    func={() => handleSelectedBilhete("importar")}
                    className={addBilheteSelectedButton === "importar" ? styles.selectedButton : ""}
                />
                <SimpleButton
                    isSelected={addBilheteSelectedButton === "manual"}
                    btnTitle="Adicionar Manualmente"
                    func={() => handleSelectedBilhete("manual")}
                    className={addBilheteSelectedButton === "manual" ? styles.selectedButton : ""}
                />
                <SimpleButton
                    isSelected={addBilheteSelectedButton === "random"}
                    btnTitle="Aleatório"
                    func={() => handleSelectedBilhete("random")}
                    className={addBilheteSelectedButton === "random" ? styles.selectedButton : ""}
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
                            placeholder={`1 2 3 4\n5 6 7 8\n9 10 11 12\n...`}
                            cols={30}
                            rows={12}
                            value={importtextAreaValue}
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
                            <Title h={3}>Jogos Importados</Title>
                            {importedNumbersArr.map((item: any, index) => (
                                <article key={index}>
                                    {`Jogo ${index + 1} : `} {item.join(" ")}
                                    <div
                                        ref={(el) => {
                                            divRefs.current[index] = el;
                                        }}
                                    >
                                        <div className="" ref={cardRef}>
                                            <ResultsCard
                                                numeroBilhete={
                                                    formData.ticketNumber - 1 + 1 + index
                                                }
                                                modalidade={selectedModalidade}
                                                numbersArr={[...item]}
                                                acertos={formData.acertos}
                                                premio={formData.prize}
                                                apostador={formData.apostadorName}
                                                quantidadeDezenas={quantidadeDeDezenas}
                                                resultado={formData.resultDate}
                                                data={formData.currentDate}
                                                hora={formData.currentDate}
                                                lote={formData.lote}
                                                consultor={formData.consultantName}
                                                tipoBilhete={formData.ticketType}
                                                valorBilhete={formData.valorBilhete}
                                            />
                                        </div>
                                        {renderExportButtons()}
                                    </div>
                                </article>
                            ))}
                            <Title h={2}>{`${importedNumbersArr.length} Jogos Gerados`}</Title>
                            {importedNumbersArr.map((item: any, index) => (
                                <article key={index}>
                                    {`Jogo ${index + 1} : `} {item.join(" ")}
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
                            {generatedGamesDisplay.map((item, index) => (
                                <article key={index}>
                                    <strong>Jogo {index + 1}:</strong> {item.join(" ")}
                                    <div
                                        ref={(el) => {
                                            divRefs.current[index] = el;
                                        }}
                                    >
                                        <div className="" ref={cardRef}>
                                            <ResultsCard
                                                numeroBilhete={
                                                    formData.ticketNumber - 1 + 1 + index
                                                }
                                                modalidade={selectedModalidade}
                                                numbersArr={[...item]}
                                                acertos={formData.acertos}
                                                premio={formData.prize}
                                                apostador={formData.apostadorName}
                                                quantidadeDezenas={quantidadeDeDezenas}
                                                resultado={formData.resultDate}
                                                data={formData.currentDate}
                                                hora={formData.currentDate}
                                                lote={formData.lote}
                                                consultor={formData.consultantName}
                                                tipoBilhete={formData.ticketType}
                                                valorBilhete={formData.valorBilhete}
                                            />
                                        </div>
                                    </div>
                                    {renderExportButtons()}
                                </article>
                            ))}
                            <Title h={2}>{`${generatedGames.length} Jogos Gerados`}</Title>
                            {generatedGamesDisplay.map((item: any, index) => (
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
                    <div className={styles.randomBilhetesContainer}>
                        <Title h={2}>{modalidadeContent?.name || ""}</Title>
                        <div className={styles.inputsRow}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="quantidadeBilhetes">Quantidade de Bilhetes:</label>
                                <input
                                    type="number"
                                    id="quantidadeBilhetes"
                                    value={quantidadeBilhetes}
                                    onChange={(e) => setQuantidadeBilhetes(Number(e.target.value))}
                                    min={1}
                                    max={maxTickets}
                                    className={styles.smallInput}
                                    required
                                />
                            </div>
                        </div>
                        <SimpleButton
                            btnTitle="Gerar Bilhetes Aleatórios"
                            isSelected={false}
                            func={handleGenerateGames}
                            disabled={
                                !modalidadeContent ||
                                quantidadeBilhetes <= 0 ||
                                quantidadeBilhetes > maxTickets ||
                                quantidadeDeDezenas > (modalidadeContent?.maxNumber || 60)
                            }
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
                            {generatedGamesDisplay.map((item, index) => (
                                <article key={index}>
                                    <strong>Jogo {index + 1}:</strong> {item.join(" ")}
                                    <div
                                        ref={(el) => {
                                            divRefs.current[index] = el;
                                        }}
                                    >
                                        <div className="" ref={cardRef}>
                                            <ResultsCard
                                                numeroBilhete={
                                                    formData.ticketNumber - 1 + 1 + index
                                                }
                                                modalidade={selectedModalidade}
                                                numbersArr={[...item]}
                                                acertos={formData.acertos}
                                                premio={formData.prize}
                                                apostador={formData.apostadorName}
                                                quantidadeDezenas={quantidadeDeDezenas}
                                                resultado={formData.resultDate}
                                                data={formData.currentDate}
                                                hora={formData.currentDate}
                                                lote={formData.lote}
                                                consultor={formData.consultantName}
                                                tipoBilhete={formData.ticketType}
                                                valorBilhete={formData.valorBilhete}
                                            />
                                        </div>
                                    </div>
                                </article>
                            ))}

                            <Title h={2}>{`${generatedGames.length} Jogos Gerados`}</Title>
                            {generatedGamesDisplay.map((item: any, index) => (
                                <article key={index}>{item.join(" ")}</article>
                            ))}
                        </div>
                    )}
                </>
            );
        }

        return null;
    };

    useEffect(() => {
        const fetchApostador = async () => {
            try {
                const response = await fetch(`/api/users/${apostadorId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Erro ao buscar apostador.");
                }

                const data: Apostador = await response.json();
                setApostador(data);
            } catch (error) {
                console.error("Error fetching apostador:", error);
            }
        };

        fetchApostador();
    }, [apostadorId]);

    useEffect(() => {
        if (formData.valorBilhete > 0 && apostador?.wallet?.balance) {
            const calculatedMax = Math.floor(apostador.wallet.balance / formData.valorBilhete);
            setMaxTickets(calculatedMax);
        } else {
            setMaxTickets(0);
        }
    }, [formData.valorBilhete, apostador]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = tempDb.modalidades;
                setModalidadeSetting(data);
            } catch (error) {
                console.log("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            <PageHeader title="Novo Bilhete" subpage linkTo={`/apostadores`} />
            <main className="main">
                <section>
                    <div className={styles.sectionContainer}>
                        <Title h={2}>Sorteios</Title>
                        <section className={styles.buttonFilterRow}>
                            <TabsWithFilters
                                modalidadeSetting={{
                                    modalidadesCaixa: modalidadeSetting[0],
                                    modalidadeSabedoria: modalidadeSetting[1],
                                    modalidadePersonalizada: modalidadeSetting[2],
                                }}
                                handleModalidadeContent={handleModalidadeContent}
                            />
                        </section>
                    </div>

                    {modalidadeContent && (
                        <>
                            <div className={styles.sectionContainer}>
                                <Title h={2}>{`Bilhetes ${modalidadeContent.name ?? ""}`}</Title>
                                <div className={styles.buttonRow}>
                                    <SimpleButton
                                        isSelected={addBilheteSelectedButton === "importar"}
                                        btnTitle="Importar"
                                        func={() => handleSelectedBilhete("importar")}
                                        className={
                                            addBilheteSelectedButton === "importar"
                                                ? styles.selectedButton
                                                : ""
                                        }
                                    />
                                    <SimpleButton
                                        isSelected={addBilheteSelectedButton === "manual"}
                                        btnTitle="Adicionar Manualmente"
                                        func={() => handleSelectedBilhete("manual")}
                                        className={
                                            addBilheteSelectedButton === "manual"
                                                ? styles.selectedButton
                                                : ""
                                        }
                                    />
                                    <SimpleButton
                                        isSelected={addBilheteSelectedButton === "random"}
                                        btnTitle="Aleatório"
                                        func={() => handleSelectedBilhete("random")}
                                        className={
                                            addBilheteSelectedButton === "random"
                                                ? styles.selectedButton
                                                : ""
                                        }
                                    />
                                </div>
                            </div>

                            <div className={styles.maxBilhetesRow}>
                                {`Quantidade Máxima de Bilhetes Disponíveis: ${maxTickets}`}
                            </div>

                            <div className={styles.sectionContainer}>
                                <div className={styles.inputsRow}>
                                    <div className={styles.inputGroup}>
                                        <label htmlFor="consultantName">Nome do Consultor:</label>
                                        <input
                                            type="text"
                                            id="consultantName"
                                            value={formData.consultantName}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    consultantName: e.target.value,
                                                })
                                            }
                                            placeholder="Consultor"
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label htmlFor="apostadorName">Nome do Apostador:</label>
                                        <input
                                            type="text"
                                            id="apostadorName"
                                            value={formData.apostadorName}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    apostadorName: e.target.value,
                                                })
                                            }
                                            placeholder="Apostador"
                                        />
                                    </div>
                                </div>
                                <div className={styles.inputsRow}>
                                    <div className={styles.inputGroup}>
                                        <label htmlFor="lote">Lote:</label>
                                        <input
                                            type="text"
                                            id="lote"
                                            value={formData.lote}
                                            onChange={(e) =>
                                                setFormData({ ...formData, lote: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label htmlFor="ticketNumber">Número Bilhete:</label>
                                        <input
                                            type="number"
                                            id="ticketNumber"
                                            value={formData.ticketNumber}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    ticketNumber: Number(e.target.value),
                                                })
                                            }
                                            min={0}
                                        />
                                    </div>
                                </div>
                                <div className={styles.inputsRow}>
                                    <div className={styles.inputGroup}>
                                        <label htmlFor="acertos">Acertos:</label>
                                        <input
                                            type="number"
                                            id="acertos"
                                            value={formData.acertos}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    acertos: Number(e.target.value),
                                                })
                                            }
                                            min={0}
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label htmlFor="prize">Prêmio:</label>
                                        <input
                                            type="number"
                                            id="prize"
                                            value={formData.prize}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    prize: Number(e.target.value),
                                                })
                                            }
                                            min={0}
                                        />
                                    </div>
                                </div>

                                <div className={styles.inputsRow}>
                                    <div className={styles.inputGroup}>
                                        <label htmlFor="valorBilhete">Valor Bilhete:</label>
                                        <input
                                            type="number"
                                            id="valorBilhete"
                                            value={formData.valorBilhete}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    valorBilhete: Number(e.target.value),
                                                })
                                            }
                                            min={0.01}
                                            step={0.01}
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label htmlFor="quantidadeDeDezenas">
                                            Quantidade De Dezenas:
                                        </label>
                                        <input
                                            type="number"
                                            id="quantidadeDeDezenas"
                                            value={quantidadeDeDezenas}
                                            min={1}
                                            max={modalidadeContent?.maxNumber || 60}
                                            onChange={handleQuantidadeDeDezenasSelecionadas}
                                        />
                                    </div>
                                </div>
                                <div className={styles.inputsRow}>
                                    <div className={styles.inputGroup}>
                                        <label htmlFor="resultDate">Data do Sorteio:</label>
                                        <DatePicker
                                            id="resultDate"
                                            selected={formData.resultDate}
                                            onChange={(date: Date | null) =>
                                                setFormData({ ...formData, resultDate: date })
                                            }
                                            dateFormat="dd/MM/yyyy"
                                            className={styles.datePicker}
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </section>

                {modalidadeContent && (
                    <>
                        <section className={styles.jogosRow}>
                            {addBilheteCompToRender(addBilheteSelectedButton)}
                        </section>

                        <SimpleButton
                            btnTitle="Salvar Apostas"
                            func={handleSubmitApostas}
                            isSelected={false}
                            disabled={!hasBets}
                            className={`${styles.submitButton} ${styles.fixedSaveButton}`}
                            title={
                                !hasBets ? "Adicione pelo menos um jogo para salvar apostas" : ""
                            }
                        />
                    </>
                )}

                {!modalidadeContent && (
                    <div className={styles.promptContainer}>
                        <Title h={3}>Por favor, selecione uma modalidade para começar.</Title>
                    </div>
                )}
            </main>
        </>
    );
};

export default NovoBilhete;
