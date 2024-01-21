import Title from "../title/Title";
import styles from "./pageHeader.module.css";
import { FaUser, FaPhone } from "react-icons/fa6";

interface IHeader {
  title: string;
}

const PageHeader = ({ title }: IHeader) => {
  return (
    <header className={styles.header}>
      <Title h={1}>{title}</Title>
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
