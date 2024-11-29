// components/tabs/Tabs.tsx

import { useState } from "react";
import styles from "./tabs.module.scss";

interface ITab {
    tabTitle: string;
    tabContent: React.ReactNode;
}

interface TabsProps {
    tabArray: ITab[];
}

const Tabs = ({ tabArray }: TabsProps) => {
    const [selectedTab, setSelectedTab] = useState(0);

    const renderTabs = () => {
        return tabArray.map((item, index) => (
            <button
                key={item.tabTitle}
                className={selectedTab === index ? styles.singleTabSelected : styles.singleTab}
                onClick={() => setSelectedTab(index)}
            >
                {item.tabTitle}
            </button>
        ));
    };

    const renderContent = () => {
        return tabArray.map((item, index) => (
            <section className={styles.tabContentContainer} key={item.tabTitle}>
                {selectedTab === index && item.tabContent}
            </section>
        ));
    };

    return (
        <>
            <div className={styles.tabList}>{renderTabs()}</div>
            <div className={styles.tabContent}>{renderContent()}</div>
        </>
    );
};

export default Tabs;
