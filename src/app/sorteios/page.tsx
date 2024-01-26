import styles from "./sorteios.module.css";
import PageHeader from "../components/pageHeader/PageHeader";
import Buttons from "../components/buttons/Buttons";
import Filter from "../components/filter/Filter";

const GanhadoresPage = () => {
  //TODO: Fetch data from the winners

  const filters = ["modalidade caixa", "modalidade sabedoria", "modalidade personalizada"];

  return (
    <section className={styles.main}>
      <PageHeader title="Sorteios" subpage={false} />

      <section>
        <Buttons buttonType="add" />
        <Filter filtersArr={filters} />
      </section>
    </section>
  );
};

export default GanhadoresPage;
