import PageHeader from "@/app/components/pageHeader/PageHeader";
import IconCard from "@/app/components/iconCard/IconCard";
import styles from "./carteiraVendedor.module.css";
import Buttons from "@/app/components/buttons/Buttons";
import Card from "@/app/components/card/Card";
import { IIconCard } from "@/app/components/iconCard/IconCard";

interface VendedorParams {
  params: { vendedor: string; carteiraVendedor: string };
}

const CarteiraVendedor = ({ params }: VendedorParams) => {
  const filtersArr = ["todos", "premiados", "excluídos"];

  const usersArr = [
    {
      username: "Mauricio Rodriguez",
      phone: "+353 083 313 4686",
    },
    {
      username: "Franciale Melo",
      phone: "+353 084 265 3179",
    },
    {
      username: "Roger Bond",
      phone: "+353 083 356 8596",
    },
    {
      username: "Allanah Something",
      phone: "+353 086 215 7589",
    },
  ];

  const vendorIconCards: IIconCard[] = [
    {
      title: "Mauricio Rodriguez",
      description: "(21)99999-9999",
      fullWidth: false,
      icon: "vendor",
      inIcon: false,
      hasCheckbox: false,
    },
    {
      title: "Relatório de Vendas",
      description: "comissão: 15%",
      fullWidth: false,
      icon: "charts",
      inIcon: true,
      hasCheckbox: false,
    },
    {
      title: "Relatório de Créditos",
      description: "(21)99999-9999",
      fullWidth: false,
      icon: "money",
      inIcon: true,
      hasCheckbox: false,
    },
    {
      title: "Fechamento de Caixa",
      description: "(21)99999-9999",
      fullWidth: false,
      icon: "wallet",
      inIcon: true,
      hasCheckbox: false,
    },
  ];

  return (
    <>
      <PageHeader title="Carteira Vendedor" subpage linkTo={`/vendedores/${params.vendedor}`} />
      <main className="main">
        <section className={styles.row}>
          <Card big title="Saldo disponível para apostas" color="green" money value={30} />
          <div className={styles.buttonRow}>
            <Buttons buttonType="addMoney" />
            <Buttons buttonType="removeMoney" />
            <Buttons buttonType="deactivateWallet" />
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
                    hasCheckbox={false}
                  />
                </div>
              );
            })}
          </section>
        </section>
      </main>
    </>
  );
};

export default CarteiraVendedor;
