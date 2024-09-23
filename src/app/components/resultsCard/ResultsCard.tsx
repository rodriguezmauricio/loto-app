import { BsDownload } from "react-icons/bs";
import styles from "./resultsCard.module.css";
import NumbersSorteio from "../numbersSorteio/NumbersSorteio";
import { FaClover } from "react-icons/fa6";
import { TbClover } from "react-icons/tb";
import Title from "../title/Title";
import { toPng, toJpeg } from "html-to-image";
import { saveAs } from "file-saver";
import { useRef } from "react";
import Buttons from "../(buttons)/buttons/Buttons";
import SimpleButton from "../(buttons)/simpleButton/SimpleButton";

interface IResultsCard {
  data: Date;
  numbersArr: number[];
  quantidadeDezenas: number;
  acertos: number;
  hora: Date;
  premio: number;
  apostador: string;
  cartela: number;
  resultado: Date | null;
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
  cartela,
}: IResultsCard) => {
  const cardRef = useRef(null);

  const dateFormatted = (date: any) => {
    const formatMonthToNumber = (date: Date) => {
      const month = date.getMonth(); // getMonth() returns 0 for Jan, 1 for Feb, etc.
      switch (month) {
        case 0:
          return "01"; // January
        case 1:
          return "02"; // February
        case 2:
          return "03"; // March
        case 3:
          return "04"; // April
        case 4:
          return "05"; // May
        case 5:
          return "06"; // June
        case 6:
          return "07"; // July
        case 7:
          return "08"; // August
        case 8:
          return "09"; // September
        case 9:
          return "10"; // October
        case 10:
          return "11"; // November
        case 11:
          return "12"; // December
        default:
          return "Invalid month";
      }
    };

    const padNumber = (num: number) => String(num).padStart(2, "0"); // Pads single digits to two digits

    return {
      dia: padNumber(date.getDate()), // Gets the day of the month (1–31)
      mes: formatMonthToNumber(date), // Formats the month to 2-digit number
      ano: String(date.getFullYear()), // Gets the year
      horas: padNumber(date.getHours()), // Gets the hour (0–23), padded
      minutos: padNumber(date.getMinutes()), // Gets the minutes (0–59), padded
      segundos: padNumber(date.getSeconds()), // Gets the seconds (0–59), padded
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
          // alert("Image copied to clipboard!");
        } catch (err) {
          console.error("Failed to copy image to clipboard", err);
        }
      } else {
        // Save as a file (as in the previous example)
        const fileName = format === "jpeg" ? "card.jpg" : "card.png";
        saveAs(blob, fileName);
      }
    } catch (err) {
      console.error("Error exporting image", err);
    }
  };

  return (
    <>
      <article ref={cardRef} className={styles.container}>
        <header className={`${(styles.header, styles.overlay)}`}>
          {/* <TbClover size={50} /> */}
          <div className={styles.headerTop}>
            <div className="">
              <span className={styles.title}>Comprovante</span>
              <Title h={1}>TELELOTTO</Title>
            </div>
            {/* <BsDownload size={25} /> */}
          </div>

          <div className={styles.headerInfo}>
            <span>{`Valor Promocional ${""}`}</span>
            <span>{`Cartela: ${cartela}`}</span>
            <span>{`Data: ${dateFormatted(data).dia}/${dateFormatted(data).mes}`}</span>
            <span>{`Hora: ${dateFormatted(data).horas}:${dateFormatted(data).minutos}`}</span>
            <span>{`Dezenas: ${quantidadeDezenas}`}</span>
            <span>{`Acertos: ${acertos}`}</span>
            <span>{`Resultado: ${dateFormatted(resultado).dia}/${
              dateFormatted(resultado).mes
            }`}</span>
            <span>{`Prêmio: ${premio}`}</span>
            <span>{`Apostador: ${apostador}`}</span>
          </div>
        </header>
        <section className={styles.results}>
          <h3>Resultado</h3>
          <div className={styles.numbers}>
            {numbersArr.map((num: number) => {
              return <NumbersSorteio key={num} numero={Math.ceil(num)} big={false} />;
            })}
          </div>
        </section>
      </article>
      <div className={styles.buttonsContainer}>
        <SimpleButton
          btnTitle="Salvar PNG"
          isSelected
          func={() => exportAsImage("png")}
        ></SimpleButton>
        <SimpleButton
          btnTitle="Salvar JPG"
          isSelected
          func={() => exportAsImage("jpeg")}
        ></SimpleButton>
        <SimpleButton
          btnTitle="COPIAR IMAGEM"
          isSelected
          func={() => exportAsImage("png", true)}
        ></SimpleButton>
      </div>
    </>
  );
};

export default ResultsCard;
