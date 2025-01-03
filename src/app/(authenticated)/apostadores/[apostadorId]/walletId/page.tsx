import PageHeader from "components/pageHeader/PageHeader";
import IconCard from "components/iconCard/IconCard";
import styles from "./carteiraApostador.module.scss";
import Buttons from "components/(buttons)/buttons/Buttons";
import Card from "components/card/Card";
import { IIconCard } from "components/iconCard/IconCard";

interface ApostadorParams {
    params: { apostador: string; carteiraApostador: string };
}

const CarteiraApostador = ({ params }: ApostadorParams) => {
    const vendorIconCards: IIconCard[] = [
        {
            title: params.apostador, //TODO: nota para lembrar que pode passar os params aqui
            description: "(21)99999-9999",
            fullWidth: false,
            icon: "vendor",
            inIcon: false,
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
            <PageHeader
                title="Carteira Apostador"
                subpage
                linkTo={`/apostadores/${params.apostador}`}
            />
            <main className="main">
                <section className={styles.row}>
                    <Card
                        big
                        title="Saldo disponível para apostas"
                        color="green"
                        money
                        value={30}
                    />
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

export default CarteiraApostador;
