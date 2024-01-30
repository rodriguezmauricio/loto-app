import { BsDownload, BsPerson, BsPlus, BsThreeDotsVertical } from "react-icons/bs";
import styles from "./subMenu.module.css";
import Link from "next/link";

interface ISubmenu {
  type: TsubmenuType;
  linkTo?: string;
  submenuFunction?: () => void;
  submenuLink?: string;
}

export type TsubmenuType = "menu" | "user" | "download" | "add";

const SubMenu = ({ type, submenuLink, submenuFunction }: ISubmenu) => {
  const renderIcon = (type: TsubmenuType) => {
    if (type === "menu") {
      return <BsThreeDotsVertical size={22} />;
    }
    if (type === "user") {
      return <BsPerson size={22} />;
    }
    if (type === "download") {
      return <BsDownload size={22} />;
    }
    if (type === "add") {
      return <BsPlus size={22} />;
    }
  };

  const renderButtonByFunction = (link: string | undefined) => {
    return submenuLink ? (
      <Link href={link!}>
        <button className={styles.submenuButton}>{renderIcon(type)}</button>
      </Link>
    ) : (
      <button className={styles.submenuButton} onClick={submenuFunction}>
        {renderIcon(type)}
      </button>
    );
  };

  return renderButtonByFunction(submenuLink);
};

export default SubMenu;
