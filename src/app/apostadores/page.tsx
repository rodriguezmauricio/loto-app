import PageHeader from "../components/pageHeader/PageHeader";
import UserCard from "../components/userCard/UserCard";
import styles from "./apostadores.module.css";

const ApostadoresPage = () => {
  return (
    <section className={styles.main}>
      <PageHeader title="Apostadores" />
      <div className={styles.row}>
        <div className={styles.fullWidth}>
          <UserCard username="Usuário exemplo 1" phone="(21)99999-9999" />
        </div>
      </div>
    </section>
  );
};

export default ApostadoresPage;
