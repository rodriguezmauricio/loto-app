import Card from "../components/card/Card";
import PageHeader from "../components/pageHeader/PageHeader";
import Title from "../components/title/Title";
import styles from "./carteira.module.css";

const CarteiraPage = () => {
  return (
    <main className={styles.main}>
      <PageHeader title="Carteira" />

      <section>
        <Title h={2}>Saldo</Title>
        <Card big color="green" title="Saldo disponível para apostas" value={150} />
      </section>

      <section>
        <Title h={2}>Relatório de vendas</Title>
        <div className={styles.row}>
          <Card big={false} color="green" title="Total de vendas hoje" value={150} />
          <Card big={false} color="red" title="Total de comissões" value={15} />
          <Card big={false} color="yellow" title="Total de premiações" value={50} />
        </div>
        <div className={styles.row}>
          <Card big={false} color="yellow" title="Vendas - comissão" value={150} />
          <Card big={false} color="yellow" title="Vendas - comissão - premiação" value={150} />
        </div>
      </section>

      <section>
        <Title h={2}>Bilhetes vendidos</Title>
        <div className={styles.row}>
          <Card big={false} color="green" title="Total de bilhetes" value={37} money={false} />
          <Card big={false} color="none" title="Total surpresinha" value={22} money={false} />
          <Card big={false} color="none" title="Total importado" value={15} money={false} />
        </div>
      </section>
    </main>
  );
};

export default CarteiraPage;
