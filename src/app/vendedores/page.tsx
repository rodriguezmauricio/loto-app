import PageHeader from "../components/pageHeader/PageHeader";
import UserCard from "../components/iconCard/IconCard";
import styles from "./vendedores.module.css";

const VendedoresPage = () => {
  return (
    <section className={styles.main}>
      <PageHeader title="Vendedores" subpage={false} />

      <section>
        <UserCard title="Vendedor exemplo" description="(21)99999-9999" icon="vendor" />
      </section>
    </section>
  );
};

export default VendedoresPage;
