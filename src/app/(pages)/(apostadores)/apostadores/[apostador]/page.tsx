import PageHeader from "@/app/components/pageHeader/PageHeader";
import styles from "./apostador.module.css";
import IconCard from "@/app/components/iconCard/IconCard";
import Title from "@/app/components/title/Title";
import Filter from "@/app/components/filter/Filter";
import Buttons from "@/app/components/buttons/Buttons";

interface ApostadoresParams {
  params: { apostador: string; carteiraApostador: string };
}

const Apostador = ({ params }: ApostadoresParams) => {
  const filtersArr = ["todos", "premiados", "excluídos"];

  return (
    <>
      <PageHeader title="Apostador" subpage linkTo={`/apostadores`} />
      <main className="main">
        <section className={styles.row}>
          <IconCard
            title="Usuário exemplo 1"
            description="(21)99999-9999"
            icon="vendor"
            inIcon={false}
            fullWidth={false}
            hasCheckbox={false}
          />
          <IconCard
            title="Carteira"
            description="Saldo e transações"
            icon="wallet"
            inIcon
            fullWidth={false}
            hasCheckbox={false}
            linkTo={`/apostadores/${params.apostador}/${params.carteiraApostador}`}
          />
        </section>

        <section>
          <Title h={2}>Bilhetes</Title>
          <section className={styles.buttonFilterRow}>
            <Filter filtersArr={filtersArr} />
            <div className={styles.divider}></div>
            <div className={styles.buttonRow}>
              <Buttons buttonType="add" />
              <Buttons buttonType="delete" />
              <Buttons buttonType="repeat" />
              <Buttons buttonType="share" />
            </div>
          </section>

          <section></section>
        </section>
      </main>
    </>
  );
};

export default Apostador;
