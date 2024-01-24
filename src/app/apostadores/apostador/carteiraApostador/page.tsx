import PageHeader from "@/app/components/pageHeader/PageHeader";
import IconCard from "@/app/components/iconCard/IconCard";
import styles from "./carteiraApostador.module.css";
import Buttons from "@/app/components/buttons/Buttons";
import Card from "@/app/components/card/Card";
import { IIconCard } from "@/app/components/iconCard/IconCard";

const CarteiraApostador = () => {
  const vendorIconCards: IIconCard[] = [
    {
      title: "Mauricio Rodriguez",
      description: "(21)99999-9999",
      fullWidth: false,
      icon: "vendor",
      inIcon: false,
    },
    {
      title: "Relatório de Créditos",
      description: "(21)99999-9999",
      fullWidth: false,
      icon: "money",
      inIcon: true,
    },
    {
      title: "Fechamento de Caixa",
      description: "(21)99999-9999",
      fullWidth: false,
      icon: "wallet",
      inIcon: true,
    },
  ];

  return (
    <main className={styles.main}>
      <PageHeader title="Carteira Vendedor" subpage />

      <section className={styles.row}>
        <Card big title="Saldo disponível para apostas" color="green" money value={30} />
        <div className={styles.buttonRow}>
          <Buttons type="addMoney" />
          <Buttons type="removeMoney" />
          <Buttons type="deactivateWallet" />
        </div>
      </section>

      <section className={styles.mainContainer}>
        <section className={styles.cardRow}>
          {vendorIconCards.map((card) => {
            return (
              <div key={card.title}>
                <IconCard
                  title={card.title}
                  description={card.description}
                  icon={card.icon}
                  inIcon={card.inIcon}
                  fullWidth={card.fullWidth}
                />
              </div>
            );
          })}
        </section>
      </section>
    </main>
  );
};

export default CarteiraApostador;
