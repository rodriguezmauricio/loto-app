import { BsSearch } from "react-icons/bs";
import styles from "./searchBar.module.scss";

const SearchBar = () => {
    return (
        <div className={styles.container}>
            <input className={styles.input} placeholder="Pesquisar" type="text" name="" id="" />{" "}
            <div className={styles.iconContainer}>
                <BsSearch size={22} />
            </div>
        </div>
    );
};

export default SearchBar;
