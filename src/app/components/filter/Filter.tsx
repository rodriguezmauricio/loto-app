import { BsFilter } from "react-icons/bs";
import styles from "./filter.module.css";

interface IFilters {
  filtersArr: string[];
}

const Filter = ({ filtersArr }: IFilters) => {
  const renderClassNames = (filterIndex: number) => {
    if (filterIndex === 0) {
      return `${styles.button} ${styles.allButton}`;
    }
    if (filterIndex === 1) {
      return `${styles.button} ${styles.winnersButton}`;
    }
    if (filterIndex === 2) {
      return `${styles.button} ${styles.deletedButton}`;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.icon}>
        <BsFilter size={30} />
      </div>
      <div className={styles.divider}></div>
      Filtros:
      {filtersArr.map((filter, index) => {
        return (
          <button className={renderClassNames(index)} key={filter}>
            {filter}
          </button>
        );
      })}
    </div>
  );
};

export default Filter;
