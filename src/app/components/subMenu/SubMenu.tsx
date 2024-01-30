import { BsDownload, BsPerson, BsPlus, BsThreeDotsVertical } from "react-icons/bs";
import styles from "./subMenu.module.css";

interface ISubmenu {
  type: TsubmenuType;
  submenuFunction: () => void;
}

export type TsubmenuType = "menu" | "user" | "download" | "add";

const SubMenu = ({ type, submenuFunction }: ISubmenu) => {
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

  return (
    <button className={styles.submenuButton} onClick={submenuFunction}>
      {renderIcon(type)}
    </button>
  );
};

export default SubMenu;
