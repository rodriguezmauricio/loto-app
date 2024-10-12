import React from "react";
import styles from "./addAdminForm.module.scss";

function AddUsuarioForm() {
  return (
    <form>
      <label htmlFor="">Username</label>
      <input type="text" name="username" id="" className={styles.input} />
    </form>
  );
}

export default AddUsuarioForm;
