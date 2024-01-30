import PageHeader from "@/app/components/pageHeader/PageHeader";
import IconCard from "@/app/components/iconCard/IconCard";
import styles from "./apostadores.module.css";

interface ApostadoresParams {
  params: { apostador: string };
}

const ApostadoresPage = ({ params }: ApostadoresParams) => {
  return (
    <>
      <PageHeader title="Apostadores" subpage={false} linkTo={""} />
      <main className="main">
        <section>
          <IconCard
            title="Usuário exemplo 1"
            description="(21)99999-9999"
            icon="user"
            fullWidth={false}
            inIcon
            linkTo={`/apostadores/${params.apostador}`}
          />
        </section>
      </main>
    </>
  );
};

export default ApostadoresPage;
