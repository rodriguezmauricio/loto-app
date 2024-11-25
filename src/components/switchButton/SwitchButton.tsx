import styles from "./switchButton.module.css";

const SwitchButton = ({ value }: { value: boolean }) => {
  return (
    <label className={styles.switch}>
      <input type="checkbox" name="check" id="check" checked={value} />
      <span className={`${styles.slider} ${styles.round}`}></span>
    </label>
  );
};

export default SwitchButton;
