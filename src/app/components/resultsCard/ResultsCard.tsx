import { BsDownload } from "react-icons/bs";
import styles from "./resultsCard.module.css";
import NumbersSorteio from "../numbersSorteio/NumbersSorteio";
import { FaClover } from "react-icons/fa6";
import { TbClover } from "react-icons/tb";
import Title from "../title/Title";

const ResultsCard = () => {
  const mockNumbers = (n: number) => {
    const numsArr = [];

    for (let i = 0; i < n; i++) {
      numsArr.push(Math.random() * n);
    }

    return numsArr;
  };

  return (
    <article className={styles.container}>
      <header className={styles.header}>
        <TbClover size={50} />
        <div className={styles.headerInfo}>
          <span className={styles.title}>Title</span>
          <span>Data e hora</span>
        </div>
        <BsDownload size={25} />
      </header>
      <section className={styles.results}>
        <h3>Resultado</h3>
        <div className={styles.numbers}>
          {mockNumbers(15).map((num: number) => {
            return <NumbersSorteio key={num} numero={Math.ceil(num)} big={false} />;
          })}
        </div>
      </section>
      <footer className={styles.footer}>
        <h3>AGS alternativas</h3>
        <p>SmartLotoApp</p>
      </footer>
    </article>
  );
};

export default ResultsCard;
