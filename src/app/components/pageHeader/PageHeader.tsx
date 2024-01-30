import { BsBoxArrowLeft, BsThreeDotsVertical } from "react-icons/bs";
import Title from "../title/Title";
import styles from "./pageHeader.module.css";
import { BsPerson, BsPhone } from "react-icons/bs";
import Link from "next/link";
import { Url } from "url";
import SubMenu from "../subMenu/SubMenu";
import { TsubmenuType } from "../subMenu/SubMenu";

interface IHeader {
  title: string;
  subpage: boolean;
  linkTo: Url | string;
  hasSearch?: boolean;
  hasSubMenu?: boolean;
  submenuType?: TsubmenuType;
  submenuLink: string;
  submenuFunction?: () => void;
}

const PageHeader = ({
  title,
  subpage,
  linkTo,
  hasSearch = false,
  hasSubMenu = false,
  submenuType,
  submenuLink,
  submenuFunction,
}: IHeader) => {
  const renderSubmenu = () => {
    if (!submenuLink) {
      return (
        hasSubMenu &&
        submenuType &&
        submenuFunction && <SubMenu type={submenuType} submenuFunction={submenuFunction} />
      );
    } else {
      return (
        hasSubMenu &&
        submenuType &&
        submenuLink && <SubMenu type={submenuType} submenuLink={submenuLink} />
      );
    }
  };
  return (
    <header className={styles.header}>
      <div className={styles.row}>
        {subpage && (
          <button className={styles.button}>
            <Link href={linkTo}>
              <BsBoxArrowLeft size={40} />
            </Link>
          </button>
        )}
        <Title h={1}>{title}</Title>
      </div>
      <div>
        <div className={styles.user}>
          <p>
            <BsPerson /> Angela
          </p>
          <p>
            <BsPhone /> (21)9986-8542
          </p>
          {renderSubmenu()}
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
