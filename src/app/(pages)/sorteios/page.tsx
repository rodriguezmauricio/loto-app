import PageHeader from "@/app/components/pageHeader/PageHeader";
import styles from "./sorteios.module.css";
import Buttons from "@/app/components/buttons/Buttons";
import Filter from "@/app/components/filter/Filter";
import Link from "next/link";
import IconCard from "@/app/components/iconCard/IconCard";
import Title from "@/app/components/title/Title";

const SorteiosPage = () => {
  //TODO: Fetch data from the winners

  const filters = ["modalidade caixa", "modalidade sabedoria", "modalidade personalizada"];

  const mockData = [
    {
      idConcurso: "1",
      name: "Lotofacil",
      numero: "3012",
      date: "2024-01-20",
      hora: "20:00",
      resultado: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    },
    {
      idConcurso: "2",
      name: "Lotofacil",
      numero: "3011",
      date: "2024-01-19",
      hora: "20:00",
      resultado: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    },
    {
      idConcurso: "3",
      name: "Lotofacil",
      numero: "3010",
      date: "2024-01-18",
      hora: "20:00",
      resultado: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    },
  ];

  const createConcursoTitle = (concursoObj: any) => {
    return `${concursoObj.name} - Concurso ${concursoObj.numero}`;
  };

  const createConcursoDescription = (concursoObj: any) => {
    let dateArr = concursoObj.date.split("-");
    let [year, month, day] = dateArr;
    const hora = concursoObj.hora;

    switch (month) {
      case "01":
        month = "Janeiro";
        break;
      case "02":
        month = "Fevereiro";
        break;
      case "03":
        month = "Março";
        break;
      case "04":
        month = "Abril";
        break;
      case "05":
        month = "Maio";
        break;
      case "06":
        month = "Junho";
        break;
      case "07":
        month = "Julho";
        break;
      case "08":
        month = "Agosto";
        break;
      case "09":
        month = "Setembro";
        break;
      case "10":
        month = "Outubro";
        break;
      case "11":
        month = "Novembro";
        break;
      case "12":
        month = "Dezembro";
        break;
    }

    return `${day} de ${month} às ${hora}`;
  };

  return (
    <>
      <PageHeader title="Sorteios" subpage={false} linkTo={""} />
      <main className="main">
        <section>
          <Link href={"/adicionarSorteio"}>
            <Buttons buttonType="addSorteio" />
          </Link>
          <Filter filtersArr={filters} />
        </section>

        <section className={styles.sorteioRow}>
          {mockData.map((concurso) => {
            return (
              <IconCard
                key={concurso.idConcurso}
                icon="lotto"
                title={createConcursoTitle(concurso)}
                description={createConcursoDescription(concurso)}
                inIcon
                hasCheckbox={false}
                fullWidth
                linkTo={`/sorteios/${concurso.numero}`}
              />
            );
          })}
        </section>
      </main>
    </>
  );
};

export default SorteiosPage;
