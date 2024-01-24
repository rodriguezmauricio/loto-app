import PageHeader from "@/app/components/pageHeader/PageHeader";
import IconCard from "@/app/components/iconCard/IconCard";
import styles from "./vendedor.module.css";
import Title from "@/app/components/title/Title";
import Buttons from "@/app/components/buttons/Buttons";

const Vendedor = () => {
  return (
    <main className={styles.main}>
      <PageHeader title="Vendedor" subpage />

      <section className={styles.row}>
        <IconCard
          title="Usuário exemplo 1"
          description="(21)99999-9999"
          icon="vendor"
          inIcon={false}
        />
        <IconCard title="Carteira" description="Saldo e transações" icon="wallet" inIcon />
      </section>

      <section>
        <Title h={2}>Bilhetes</Title>
        <section className={styles.buttonRow}>
          <Buttons type="add" />
          <Buttons type="delete" />
          <Buttons type="repeat" />
          <Buttons type="share" />
        </section>
        <IconCard
          title="Filtros"
          description="Selecione a forma de exibir as apostas"
          icon="filter"
          inIcon={true}
        />
      </section>
    </main>
  );
};

export default Vendedor;
