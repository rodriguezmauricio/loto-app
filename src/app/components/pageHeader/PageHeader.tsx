import { BsBoxArrowLeft } from "react-icons/bs";
import Title from "../title/Title";
import styles from "./pageHeader.module.css";
import { FaUser, FaPhone } from "react-icons/fa6";

interface IHeader {
  title: string;
  subpage: boolean;
}

const PageHeader = ({ title, subpage }: IHeader) => {
  return (
    <header className={styles.header}>
      <div className={styles.row}>
        {subpage && <BsBoxArrowLeft size={40} />}
        <Title h={1}>{title}</Title>
      </div>
      <div>
        <div className={styles.user}>
          <p>
            <FaUser /> Angela
          </p>
          <p>
            <FaPhone /> (21)9986-8542
          </p>
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
