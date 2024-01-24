import Card from "../components/card/Card";
import PageHeader from "../components/pageHeader/PageHeader";
import Title from "../components/title/Title";
import styles from "./dashboard.module.css";

const DashboardPage = () => {
  return (
    <main className={styles.main}>
      <PageHeader title="Dashboard" subpage={false} />

      <section>
        <Title h={2}>Banca</Title>
        <div className={styles.row}>
          <div className={styles.fullWidth}>
            <Card title="Saldo da Banca Hoje" value={150.0} big={true} color="green" />
          </div>
          <Card title="Vendas" value={150.0} big={false} color="green" />
          <Card title="Comissões" value={150.0} big={false} color="red" />
          <Card title="Premiações" value={150.0} big={false} color="yellow" />
        </div>
      </section>

      <section>
        <Title h={2}>Vendedores & Apostadores</Title>
        <div className={styles.row}>
          <Card title="Créditos vendedores" value={150.0} big={false} color="yellow" />
          <Card title="Créditos apostadores" value={150.0} big={false} color="yellow" />
        </div>
      </section>
    </main>
  );
};

export default DashboardPage;
