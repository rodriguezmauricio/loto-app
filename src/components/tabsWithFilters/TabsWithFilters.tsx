import { useState } from "react";
import styles from "./tabsWithFilters.module.scss";
import { IModalidade } from "app/(authenticated)/apostadores/[apostadorId]/novoBilhete/page";

// Adjust the interface as needed
interface ModalidadeSetObj {
    Caixa?: { Caixa?: IModalidade[] };
    Sabedoria?: { Sabedoria?: IModalidade[] };
    Personalizada?: { Personalizada?: IModalidade[] };
}

interface TabsWithFiltersProps {
    modalidadeSetting: ModalidadeSetObj;
    // Now handleModalidadeContent has three parameters:
    //   settingsObj: the selected IModalidade object
    //   loteriaName: string (from the clicked button)
    //   modalidadeName: string (from the selected tab)
    handleModalidadeContent: (
        settingsObj: IModalidade,
        loteriaName: string,
        modalidadeName: string
    ) => void;
}

const TabsWithFilters: React.FC<TabsWithFiltersProps> = ({
    modalidadeSetting,
    handleModalidadeContent,
}) => {
    const [selectedTab, setSelectedTab] = useState(0);

    const {
        Caixa = { Caixa: [] },
        Sabedoria = { Sabedoria: [] },
        Personalizada = { Personalizada: [] },
    } = modalidadeSetting || {};

    // Determine modalidadeName based on the selected tab
    const currentModalidadeName =
        selectedTab === 0 ? "Caixa" : selectedTab === 1 ? "Surpresinha" : "Personalizado";

    const renderButtonsForTab = (list: IModalidade[] | undefined, modalidadeName: string) => {
        if (!list) return null;
        return (
            <section className={styles.buttonFiltersRow}>
                {list.map((button) => (
                    <button
                        style={{ background: button.color }}
                        className={styles.buttonFilter}
                        key={button.name}
                        onClick={() =>
                            handleModalidadeContent(
                                {
                                    name: button.name,
                                    color: button.color,
                                    betNumbers: button.betNumbers,
                                    trevoAmount: button.trevoAmount,
                                    maxNumber: button.maxNumber,
                                    loteria: button.loteria,
                                },
                                button.name, // This is the loteria
                                modalidadeName // This is the modalidade derived from tab selection
                            )
                        }
                    >
                        {button.name}
                    </button>
                ))}
            </section>
        );
    };

    const conteudoRenderizado = () => {
        if (selectedTab === 0 && Caixa.Caixa) {
            return renderButtonsForTab(Caixa.Caixa, "Caixa");
        } else if (selectedTab === 1 && Sabedoria.Sabedoria) {
            return renderButtonsForTab(Sabedoria.Sabedoria, "Surpresinha");
        } else if (selectedTab === 2 && Personalizada.Personalizada) {
            return renderButtonsForTab(Personalizada.Personalizada, "Personalizado");
        }
        return null;
    };

    return (
        <>
            <section className={styles.tabList}>
                <button
                    className={
                        selectedTab === 0
                            ? `${styles.singleTabSelected} ${styles.singleTab}`
                            : styles.singleTab
                    }
                    onClick={() => setSelectedTab(0)}
                >
                    Caixa
                </button>
                <button
                    className={
                        selectedTab === 1
                            ? `${styles.singleTabSelected} ${styles.singleTab}`
                            : styles.singleTab
                    }
                    onClick={() => setSelectedTab(1)}
                >
                    Surpresinha
                </button>
                <button
                    className={
                        selectedTab === 2
                            ? `${styles.singleTabSelected} ${styles.singleTab}`
                            : styles.singleTab
                    }
                    onClick={() => setSelectedTab(2)}
                >
                    Personalizado
                </button>
            </section>

            <section className={styles.tabContentContainer}>{conteudoRenderizado()}</section>
        </>
    );
};

export default TabsWithFilters;
