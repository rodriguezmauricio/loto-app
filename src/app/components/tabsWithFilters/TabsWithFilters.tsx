import { useState } from "react";
import styles from "./tabsWithFilters.module.css";

const TabsWithFilters = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const buttonsCaixa = [
    {
      title: "Erre X",
      color: "#1b1b1b",
    },
    {
      title: "Dupla Sena",
      color: "#1b1b1b",
    },
    {
      title: "Dia de Sorte",
      color: "#1b1b1b",
    },
    {
      title: "Megasena",
      color: "#1b1b1b",
    },
    {
      title: "Lotofácil",
      color: "#1b1b1b",
    },
    {
      title: "Quina",
      color: "#1b1b1b",
    },
  ];

  const buttonsSabedoria = [
    {
      title: "Erre X",
      color: "#1b1b1b",
    },
    {
      title: "Sortinha",
      color: "#1b1b1b",
    },
    {
      title: "Lotinha",
      color: "#1b1b1b",
    },
    {
      title: "Quininha",
      color: "#1b1b1b",
    },
    {
      title: "Seninha",
      color: "#1b1b1b",
    },
  ];
  const buttonsPersonalizado = [
    {
      title: "Super 5",
      color: "#1b1b1b",
    },
    {
      title: "Quina Brasil",
      color: "#1b1b1b",
    },
  ];

  const conteudoRenderizado = (selected: number) => {
    if (selected === 0) {
      return (
        <section className={styles.buttonFiltersRow}>
          {buttonsCaixa.map((button) => {
            return (
              <button
                style={{ background: button.color }}
                className={styles.buttonFilter}
                key={button.title}
              >
                {button.title}
              </button>
            );
          })}
        </section>
      );
    }
    if (selected === 1) {
      return (
        <section className={styles.buttonFiltersRow}>
          {buttonsSabedoria.map((button) => {
            return (
              <button
                style={{ background: button.color }}
                className={styles.buttonFilter}
                key={button.title}
              >
                {button.title}
              </button>
            );
          })}
        </section>
      );
    }
    if (selected === 2) {
      return (
        <section className={styles.buttonFiltersRow}>
          {buttonsPersonalizado.map((button) => {
            return (
              <button
                style={{ background: button.color }}
                className={styles.buttonFilter}
                key={button.title}
              >
                {button.title}
              </button>
            );
          })}
        </section>
      );
    }
  };

  return (
    <>
      <section className={styles.tabList}>
        <button
          className={selectedTab === 0 ? styles.singleTabSelected : styles.singleTab}
          onClick={() => setSelectedTab(0)}
        >
          Caixa
        </button>
        <button
          className={selectedTab === 1 ? styles.singleTabSelected : styles.singleTab}
          onClick={() => setSelectedTab(1)}
        >
          Sabedoria
        </button>
        <button
          className={selectedTab === 2 ? styles.singleTabSelected : styles.singleTab}
          onClick={() => setSelectedTab(2)}
        >
          Personalizado
        </button>
      </section>
      <section className={styles.tabContentContainer}>{conteudoRenderizado(selectedTab)}</section>
    </>
  );
};

export default TabsWithFilters;
