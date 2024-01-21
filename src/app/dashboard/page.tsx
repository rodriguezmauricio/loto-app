import Card from "../components/card/Card";
import styles from "./dashboard.module.css";

const DashboardPage = () => {
  return (
    <>
      <main className={styles.main}>
        <header className={styles.header}>
          <h1>Dashboard</h1>
        </header>

        <h2 className={styles.h2}>Banca</h2>
        <section className={styles.section}>
          <div className={styles.fullWidth}>
            <Card title="Saldo da Banca Hoje" value={150.0} big={true} color="green" />
          </div>
          <Card title="Vendas" value={150.0} big={false} color="green" />
          <Card title="Comissões" value={150.0} big={false} color="red" />
          <Card title="Premiações" value={150.0} big={false} color="yellow" />
        </section>

        <h2 className={styles.h2}>Vendedores & Apostadores</h2>
        <section className={styles.section}>
          <Card title="Créditos vendedores" value={150.0} big={false} color="yellow" />
          <Card title="Créditos apostadores" value={150.0} big={false} color="yellow" />
        </section>
      </main>
    </>
  );
};

export default DashboardPage;
