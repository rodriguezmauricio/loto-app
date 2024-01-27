import { BsDownload } from "react-icons/bs";
import styles from "./resultsCard.module.css";

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
      <header>
        <h2>LOGO</h2>
        <div className={styles.headerInfo}>
          <h3>Title</h3>
          <h4>Data e hora</h4>
        </div>
        <BsDownload />
      </header>
      <section className={styles.results}>
        <h3>Resultado</h3>
        <div className={styles.numbers}>
          {mockNumbers(26).map((num: number) => {
            return <p key={num}>{Math.ceil(num)}</p>;
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
