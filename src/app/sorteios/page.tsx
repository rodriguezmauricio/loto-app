import styles from "./sorteios.module.css";
import PageHeader from "../components/pageHeader/PageHeader";
import Buttons from "../components/buttons/Buttons";
import Filter from "../components/filter/Filter";

const SorteiosPage = () => {
  //TODO: Fetch data from the winners

  const filters = ["modalidade caixa", "modalidade sabedoria", "modalidade personalizada"];

  return (
    <section className="main">
      <PageHeader title="Sorteios" subpage={false} />

      <section>
        <Buttons buttonType="addSorteio" />
        <Filter filtersArr={filters} />
      </section>
    </section>
  );
};

export default SorteiosPage;
