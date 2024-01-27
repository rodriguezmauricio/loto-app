import Title from "@/app/components/title/Title";
import styles from "./configuracoes.module.css";
import PageHeader from "@/app/components/pageHeader/PageHeader";

const ConfiguracoesPage = () => {
  //TODO: Fetch data from the winners

  return (
    <section className="main">
      <PageHeader title="Configurações" subpage={false} linkTo={""} />

      <section>
        <Title h={2}>Modalidades</Title>
      </section>
      <section>
        <Title h={2}>Bilhetes</Title>
      </section>
      <section>
        <Title h={2}>Bilhetes Surpresinha</Title>
      </section>
      <section>
        <Title h={2}>Aplicativo</Title>
      </section>
      <section>
        <Title h={2}>Permissões de Administradores</Title>
      </section>
    </section>
  );
};

export default ConfiguracoesPage;
