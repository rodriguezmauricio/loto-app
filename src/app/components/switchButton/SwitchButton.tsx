import styles from "./switchButton.module.css";

const SwitchButton = () => {
  return (
    <label className={styles.switch}>
      <input type="checkbox" name="check" id="check" />
      <span className={`${styles.slider} ${styles.round}`}></span>
    </label>
  );
};

export default SwitchButton;
