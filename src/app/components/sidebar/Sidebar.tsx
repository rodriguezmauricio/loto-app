import Link from "next/link";

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
        <h1>LottoApp</h1>
      </div>
      <div className={styles.menuDivisions}>
        {sidebarLinksHome.map((item) => {
          return (
            <Link href={item.href} key={item.linkName} className={styles.menuLink}>
              <div className={styles.icon}>{item.icon}</div>
              <span className={styles.linkText}>{item.linkName}</span>
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
              <span className={styles.linkText}>{item.linkName}</span>
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
              <span className={styles.linkText}>{item.linkName}</span>
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
              <span className={styles.linkText}>{item.linkName}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
