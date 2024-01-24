import PageHeader from "../components/pageHeader/PageHeader";
import UserCard from "../components/iconCard/IconCard";
import styles from "./apostadores.module.css";

const ApostadoresPage = () => {
  return (
    <section className={styles.main}>
      <PageHeader title="Apostadores" subpage={false} />

      <section>
        <UserCard title="Usuário exemplo 1" description="(21)99999-9999" icon="user" />
      </section>
    </section>
  );
};

export default ApostadoresPage;
