import Link from "next/link";
import { FaChartSimple } from "react-icons/fa6";

import styles from "./sidebar.module.css";
import {
  sidebarLinksHome,
  sidebarLinksPremios,
  sidebarLinksSettings,
  sidebarLinksSorteios,
} from "./sidebarLinks/sidebarLinks";

const Sidebar = () => {
  return (
    <aside className={styles.container}>
      <div className={styles.logo}>
        <h1>SMART LOTO APP</h1>
      </div>
      <div className={styles.menuDivisions}>
        {sidebarLinksHome.map((item) => {
          return (
            <Link href={item.href} key={item.linkName} className={styles.menuLink}>
              <div className={styles.icon}>{item.icon}</div>
              {item.linkName}
            </Link>
          );
        })}
      </div>
      <div className={styles.divider}></div>
      <div className={styles.menuDivisions}>
        {sidebarLinksSorteios.map((item) => {
          return (
            <Link href={item.href} key={item.linkName} className={styles.menuLink}>
              <div className={styles.icon}>{item.icon}</div>
              {item.linkName}
            </Link>
          );
        })}
      </div>
      <div className={styles.divider}></div>
      <div className={styles.menuDivisions}>
        {sidebarLinksPremios.map((item) => {
          return (
            <Link href={item.href} key={item.linkName} className={styles.menuLink}>
              <div className={styles.icon}>{item.icon}</div>
              {item.linkName}
            </Link>
          );
        })}
      </div>
      <div className={styles.divider}></div>
      <div className={styles.menuDivisions}>
        {sidebarLinksSettings.map((item) => {
          return (
            <Link href={item.href} key={item.linkName} className={styles.menuLink}>
              <div className={styles.icon}>{item.icon}</div>
              {item.linkName}
            </Link>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
