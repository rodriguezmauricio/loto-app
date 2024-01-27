import { BsBoxArrowLeft } from "react-icons/bs";
import Title from "../title/Title";
import styles from "./pageHeader.module.css";
import { BsPerson, BsPhone } from "react-icons/bs";
import Link from "next/link";
import { Url } from "url";

interface IHeader {
  title: string;
  subpage: boolean;
  linkTo: Url | string;
}

const PageHeader = ({ title, subpage, linkTo }: IHeader) => {
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
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
