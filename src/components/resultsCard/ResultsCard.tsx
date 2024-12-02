// src/components/resultsCard/ResultsCard.tsx

"use client";

import styles from "./resultsCard.module.css";
import NumbersSorteio from "../numbersSorteio/NumbersSorteio";
import Title from "../title/Title";
import { toPng, toJpeg } from "html-to-image";
import { saveAs } from "file-saver";
import { useRef } from "react";

interface IResultsCard {
    data: Date;
    numbersArr: number[]; // Changed to number[]
    quantidadeDezenas: number;
    acertos: number;
    hora: Date;
    premio: number;
    apostador: string;
    lote: string;
    numeroBilhete: number;
    resultado: Date | null;
    valorBilhete: number; // Changed to number
    consultor: string;
    modalidade: string | undefined;
    tipoBilhete: string;
}

const ResultsCard = ({
    data,
    numbersArr,
    quantidadeDezenas,
    acertos,
    resultado,
    hora,
    premio,
    apostador,
    lote,
    numeroBilhete,
    valorBilhete,
    consultor,
    modalidade,
    tipoBilhete,
}: IResultsCard) => {
    const cardRef = useRef<HTMLDivElement | null>(null);

    const dateFormatted = (date: Date | null) => {
        if (!date) {
            return {
                dia: "00",
                mes: "00",
                ano: "0000",
                horas: "00",
                minutos: "00",
                segundos: "00",
            };
        }

        const padNumber = (num: number) => String(num).padStart(2, "0"); // Pads single digits to two digits

        return {
            dia: padNumber(date.getDate()), // 1-31
            mes: padNumber(date.getMonth() + 1), // 1-12
            ano: String(date.getFullYear()),
            horas: padNumber(date.getHours()),
            minutos: padNumber(date.getMinutes()),
            segundos: padNumber(date.getSeconds()),
        };
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

            // Convert data URL to Blob
            const response = await fetch(dataUrl);
            const blob = await response.blob();

            if (saveToClipboard) {
                // Save to Clipboard using the Clipboard API
                try {
                    await navigator.clipboard.write([
                        new ClipboardItem({
                            [blob.type]: blob,
                        }),
                    ]);
                    // Optionally, notify the user
                    // alert("Image copied to clipboard!");
                } catch (err) {
                    console.error("Failed to copy image to clipboard", err);
                }
            } else {
                // Save as a file
                const fileName = format === "jpeg" ? "card.jpg" : "card.png";
                saveAs(blob, fileName);
            }
        } catch (err) {
            console.error("Error exporting image", err);
        }
    };

    return (
        <div id="resultsCard">
            <article ref={cardRef} className={styles.container}>
                <header className={`${styles.header} ${styles.overlay}`}>
                    {/* Optional: Add an icon or logo here */}
                    <div className={styles.headerTop}>
                        <div className="">
                            <span className={styles.title}>Comprovante</span>
                            <Title h={1}>TELELOTTO</Title>
                        </div>
                        {/* Optional: Add export buttons or icons here */}
                    </div>

                    <div className={styles.headerInfo}>
                        <span>{`Modalidade: ${modalidade ?? ""}`}</span>
                        <span>{`Consultor: ${consultor}`}</span>
                        <span>{`Lote: ${lote}`}</span>
                        <span>{`Número do Bilhete: ${numeroBilhete}`}</span>
                        <span>{`Apostador: ${apostador}`}</span>
                        <span>{`Valor Bilhete: ${
                            valorBilhete >= 1 ? `R$${valorBilhete.toFixed(2)}` : "Valor Promocional"
                        }`}</span>
                        <span>{`Data: ${dateFormatted(data).dia}/${dateFormatted(data).mes}`}</span>
                        <span>{`Hora: ${dateFormatted(data).horas}:${
                            dateFormatted(data).minutos
                        }`}</span>
                        <span>{`Dezenas: ${quantidadeDezenas}`}</span>
                        <span>{`Acertos: ${acertos}`}</span>
                        <span>{`Resultado: ${
                            resultado
                                ? `${dateFormatted(resultado).dia}/${dateFormatted(resultado).mes}`
                                : "A definir"
                        }`}</span>
                        <span>{`Prêmio: R$${premio.toFixed(2)}`}</span>
                    </div>
                </header>
                <section className={styles.results}>
                    <h3>Resultado</h3>
                    <div className={styles.numbers}>
                        {numbersArr.map((num: number, index: number) => (
                            <NumbersSorteio key={index} numero={num} big={false} />
                        ))}
                    </div>
                </section>
            </article>
            {/* Optional: Add export buttons outside the card */}
            <div className={styles.exportButtons}>
                <button onClick={() => exportAsImage("png")} className={styles.button}>
                    Exportar como PNG
                </button>
                <button onClick={() => exportAsImage("jpeg")} className={styles.button}>
                    Exportar como JPEG
                </button>
                <button onClick={() => exportAsImage("png", true)} className={styles.button}>
                    Copiar para Clipboard
                </button>
            </div>
        </div>
    );
};

export default ResultsCard;
