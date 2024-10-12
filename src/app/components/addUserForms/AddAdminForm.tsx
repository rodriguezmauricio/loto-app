import React, { useState } from "react";
import styles from "./addAdminForm.module.scss";

function AddAdminForm(userType: string) {
  // const [selectedRadioButton, setSelectedRadioButton] = useState("");

  // TOFIX: WTF IS GOING ON WITH THE USE STATE?
  const radioOptions = [
    { value: "percent", label: "Porcentagem" },
    { value: "absolute", label: "Valor em R$" },
  ];

  const handleRadioChange = (e: any) => {
    // setSelectedRadioButton(e.target.value);
  };

  return (
    <form>
      <label htmlFor="username">Username</label>
      <input type="text" name="username" id="" className={styles.input} />

      <label htmlFor="password">Password</label>
      <input type="password" name="password" id="" className={styles.input} />

      {userType === "vendedor" && (
        <>
          <label htmlFor="phone">Telefone</label>
          <input type="tel" name="phone" id="" className={styles.input} />

          <input type="radio" name="" id="" />

          <label htmlFor="valorComissao">Valor da comissão</label>
          <input type="number" name="valorComissao" id="" />
        </>
      )}
    </form>
  );
}

export default AddAdminForm;
