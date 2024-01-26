import PageHeader from "../components/pageHeader/PageHeader";
import IconCard from "../components/iconCard/IconCard";
import styles from "./apostadores.module.css";

const ApostadoresPage = () => {
  return (
    <section className="main">
      <PageHeader title="Apostadores" subpage={false} />

      <section>
        <IconCard
          title="Usuário exemplo 1"
          description="(21)99999-9999"
          icon="user"
          fullWidth={false}
          inIcon
        />
      </section>
    </section>
  );
};

export default ApostadoresPage;
