import PageHeader from "@/app/components/pageHeader/PageHeader";
import IconCard from "@/app/components/iconCard/IconCard";
import styles from "./apostadores.module.css";

interface ApostadoresParams {
  params: { apostador: string };
}

const ApostadoresPage = ({ params }: ApostadoresParams) => {
  return (
    <>
      <PageHeader
        title="Apostadores"
        subpage={false}
        linkTo={""}
        hasSubMenu
        submenuType="add"
        submenuLink="/adicionarApostador"
      />
      <main className="main">
        <section>
          {/* //TODO: MAP OVER THE USERS */}
          <IconCard
            title="Usuário exemplo 1"
            description="(21)99999-9999"
            icon="user"
            fullWidth={true}
            inIcon
            linkTo={`/apostadores/${params.apostador}`}
            hasCheckbox={false}
          />
        </section>
      </main>
    </>
  );
};

export default ApostadoresPage;
