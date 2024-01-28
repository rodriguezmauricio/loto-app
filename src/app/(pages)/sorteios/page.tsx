import PageHeader from "@/app/components/pageHeader/PageHeader";
import styles from "./sorteios.module.css";
import Buttons from "@/app/components/buttons/Buttons";
import Filter from "@/app/components/filter/Filter";
import Link from "next/link";

const SorteiosPage = () => {
  //TODO: Fetch data from the winners

  const filters = ["modalidade caixa", "modalidade sabedoria", "modalidade personalizada"];

  return (
    <>
      <PageHeader title="Sorteios" subpage={false} linkTo={""} />
      <main className="main">
        <section>
          <Link href={"/sorteios/adicionarSorteio"}>
            <Buttons buttonType="addSorteio" />
          </Link>
          <Filter filtersArr={filters} />
        </section>
      </main>
    </>
  );
};

export default SorteiosPage;
