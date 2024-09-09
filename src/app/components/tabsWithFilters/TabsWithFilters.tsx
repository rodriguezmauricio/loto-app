import { useEffect, useState } from "react"; // Importing the useState hook from React
import styles from "./tabsWithFilters.module.css"; // Importing the CSS module for styling

interface IModalidadeSetting {
  name: string;
  color: string;
  betNumbers: number[];
  trevoAmount: number[];
}

const TabsWithFilters = ({ modalidadeSetting, handleModalidadeContent }: IModalidadeSetting) => {
  // State to track which tab is currently selected (default is the first tab - index 0)
  const [selectedTab, setSelectedTab] = useState(0);

  const [modalidadeCaixa = {}, modalidadeSabedoria = {}, modalidadePersonalizada = {}] =
    modalidadeSetting;

  // Arrays defining the buttons for different categories
  const buttonsCaixa = [
    {
      title: "Erre X",
      color: "#1b1b1b", // Black color for the button background
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

  // console.log("modalidadeCaixa: ", modalidadeCaixa.modalidadesCaixa);

  // Function to render buttons based on the selected tab
  const conteudoRenderizado = (selected: number) => {
    // If "Caixa" tab is selected (index 0), render Caixa buttons
    if (selected === 0) {
      return (
        <section className={styles.buttonFiltersRow}>
          {modalidadeCaixa?.modalidadesCaixa?.map((button) => {
            return (
              <button
                style={{ background: button.color }} // Set button background color
                className={styles.buttonFilter} // Apply CSS class for styling
                key={button.name} // Key for React list rendering
                onClick={() =>
                  handleModalidadeContent({
                    name: button.name,
                    color: button.color,
                    betNumbers: button.betNumbers,
                    trevoAmount: button.trevoAmount,
                  })
                }
              >
                {button.name}
              </button>
            );
          })}
        </section>
      );
    }
    // If "Sabedoria" tab is selected (index 1), render Sabedoria buttons
    if (selected === 1) {
      return (
        <section className={styles.buttonFiltersRow}>
          {modalidadeSabedoria?.modalidadeSabedoria?.map((button) => {
            return (
              <button
                style={{ background: button.color }}
                className={styles.buttonFilter}
                key={button.name}
                onClick={() =>
                  handleModalidadeContent({
                    name: button.name,
                    color: button.color,
                    betNumbers: button.betNumbers,
                    trevoAmount: button.trevoAmount,
                  })
                }
              >
                {button.name}
              </button>
            );
          })}
        </section>
      );
    }
    // If "Personalizado" tab is selected (index 2), render Personalizado buttons
    if (selected === 2) {
      return (
        <section className={styles.buttonFiltersRow}>
          {modalidadePersonalizada?.modalidadePersonalizada?.map((button) => {
            return (
              <button
                style={{ background: button.color }}
                className={styles.buttonFilter}
                key={button.name}
                onClick={() =>
                  handleModalidadeContent({
                    name: button.name,
                    color: button.color,
                    betNumbers: button.betNumbers,
                    trevoAmount: button.trevoAmount,
                  })
                }
              >
                {button.name}
              </button>
            );
          })}
        </section>
      );
    }
  };

  return (
    <>
      {/* Tab navigation bar */}
      <section className={styles.tabList}>
        {/* Button for "Caixa" tab */}
        <button
          className={
            selectedTab === 0
              ? `${styles.singleTabSelected} ${styles.singleTab}` // Apply selected styling if this tab is active
              : styles.singleTab // Apply default tab styling if inactive
          }
          onClick={() => setSelectedTab(0)} // Set the selected tab to 0 when clicked
        >
          Caixa
        </button>
        {/* Button for "Sabedoria" tab */}
        <button
          className={
            selectedTab === 1 ? `${styles.singleTabSelected} ${styles.singleTab}` : styles.singleTab
          }
          onClick={() => setSelectedTab(1)} // Set the selected tab to 1 when clicked
        >
          Sabedoria
        </button>
        {/* Button for "Personalizado" tab */}
        <button
          className={
            selectedTab === 2 ? `${styles.singleTabSelected} ${styles.singleTab}` : styles.singleTab
          }
          onClick={() => setSelectedTab(2)} // Set the selected tab to 2 when clicked
        >
          Personalizado
        </button>
      </section>

      {/* Container to display the content based on the selected tab */}
      <section className={styles.tabContentContainer}>{conteudoRenderizado(selectedTab)}</section>
    </>
  );
};

export default TabsWithFilters; // Exporting the component for use in other parts of the app
