import PageHeader from "@/app/components/pageHeader/PageHeader";
import styles from "./sorteio.module.css";
import Card from "@/app/components/card/Card";
import Buttons from "@/app/components/buttons/Buttons";
import IconCard from "@/app/components/iconCard/IconCard";
import Title from "@/app/components/title/Title";
import NumbersSorteio from "@/app/components/numbersSorteio/NumbersSorteio";
import ResultsTable from "@/app/components/resultsTable/ResultsTable";
import SorteioTable from "@/app/components/sorteioTable/SorteioTable";

interface SorteioParams {
  params: {
    modalidade: string;
    numeroSorteio: string;
    dataSorteio: string;
    inicioVendas: string;
    horarioLimiteCadastro: string;
    results: number[];
  };
}

const mockSorteio = [
  {
    modalidade: "Lotomania",
    numeroSorteio: "3052",
    dataSorteio: "2024-01-20",
    inicioVendas: "2024-01-15",
    horarioLimiteCadastro: "2024-01-20 20:00",
    results: [1, 2, 3, 5, 7, 8, 9, 10, 12, 14, 25, 16, 18, 20, 21, 22, 23, 24, 25, 26, 28, 29, 30],
  },
];

const SorteioPage = ({ params }: SorteioParams) => {
  return (
    <>
      <PageHeader title="Sorteio" subpage linkTo={`/sorteios`} />
      <main className="main">
        <section className={styles.row}>
          <IconCard
            title={`${mockSorteio[0].modalidade}-${mockSorteio[0].numeroSorteio}`}
            description={mockSorteio[0].dataSorteio}
            icon="money"
            inIcon={false}
            fullWidth={false}
          />
          <IconCard
            title={`Início das Vendas`}
            description={mockSorteio[0].inicioVendas}
            icon="money"
            inIcon={false}
            fullWidth={false}
          />
          <IconCard
            title={`Horário limite de cadastro de bilhete`}
            description={mockSorteio[0].horarioLimiteCadastro}
            icon="money"
            inIcon={false}
            fullWidth={false}
          />
        </section>

        <section>
          <Title h={2}>Resultado</Title>
          <div className={styles.resultadoRow}>
            {mockSorteio[0].results?.map((num) => {
              return <NumbersSorteio key={num} numero={num} big />;
            })}
          </div>
        </section>

        <section className={styles.buttonRow}>
          <Buttons buttonType="share" />
          <Buttons buttonType="check" />
          <Buttons buttonType="delete" />
        </section>

        <section className={styles.mainContainer}>
          <Title h={2}>Bilhetes</Title>
          <section className={styles.cardRow}>
            <SorteioTable />
          </section>
        </section>
      </main>
    </>
  );
};

export default SorteioPage;
