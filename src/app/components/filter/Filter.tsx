import { BsFilter } from "react-icons/bs";
import styles from "./filter.module.css";

interface IFilters {
  filtersArr: string[];
}

const Filter = ({ filtersArr }: IFilters) => {
  const renderClassNames = (filter: string) => {
    if (filter === "todos") {
      return styles.allButton;
    }
    if (filter === "premiados") {
      return styles.winnersButton;
    }
    if (filter === "excluídos") {
      return styles.deletedButton;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.icon}>
        <BsFilter size={30} />
      </div>
      <div className={styles.divider}></div>
      Filtros:
      {filtersArr.map((filter) => {
        return (
          <button className={renderClassNames(filter)} key={filter}>
            {filter}
          </button>
        );
      })}
    </div>
  );
};

export default Filter;
