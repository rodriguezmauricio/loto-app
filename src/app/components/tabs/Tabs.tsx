import { useState } from "react";
import styles from "./tabs.module.css";

interface ITab {
  tabTitle: string;
  tabContent: any;
}

const Tabs = ({ tabArray }: any) => {
  const [selectedTab, setSelectedTab] = useState(0);

  console.log(tabArray);

  const tabsRenderizadas = (arr: ITab[]) => {
    return arr.map((item, index) => {
      return (
        <button
          key={item.tabTitle}
          className={selectedTab === index ? styles.singleTabSelected : styles.singleTab}
          onClick={() => setSelectedTab(index)}
        >
          {item.tabTitle}
        </button>
      );
    });
  };

  const conteudoRenderizado = (arr: ITab[]) => {
    return arr.map((item, index) => {
      return (
        <section className={styles.buttonFiltersRow} key={item.tabTitle}>
          {selectedTab === index && item.tabContent}
        </section>
      );
    });
  };

  return (
    <>
      <section className={styles.tabList}>{tabsRenderizadas(tabArray)}</section>
      <section className={styles.tabContentContainer}>{conteudoRenderizado(tabArray)}</section>
    </>
  );
};

export default Tabs;
