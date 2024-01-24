import PageHeader from "@/app/components/pageHeader/PageHeader";
import UserCard from "@/app/components/iconCard/IconCard";
import styles from "./vendedor.module.css";
import Title from "@/app/components/title/Title";
import Buttons from "@/app/components/buttons/Buttons";

const Vendedor = () => {
  return (
    <main className={styles.main}>
      <PageHeader title="Vendedor" subpage />

      <section className={styles.row}>
        <UserCard title="Usuário exemplo 1" description="(21)99999-9999" icon="vendor" />
        <UserCard title="Carteira" description="Saldo e transações" icon="wallet" />
      </section>

      <section>
        <Title h={2}>Bilhetes</Title>
        <section className={styles.buttonRow}>
          <Buttons type="add" />
          <Buttons type="delete" />
          <Buttons type="repeat" />
          <Buttons type="share" />
        </section>
        <UserCard
          title="Filtros"
          description="Selecione a forma de exibir as apostas"
          icon="filter"
        />
      </section>
    </main>
  );
};

export default Vendedor;
