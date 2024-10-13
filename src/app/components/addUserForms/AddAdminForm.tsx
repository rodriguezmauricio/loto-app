import React, { useState } from "react";
import styles from "./addAdminForm.module.scss";
import { IRadioOptions } from "@/app/(pages)/adicionarUsuario/page";

function AddAdminForm(
  userType: string,
  radioOptions: IRadioOptions[],
  selectedRadioOption: string,
  radioHandler: any
) {
  return (
    <form className={styles.form}>
      <label htmlFor="username">Username</label>
      <input type="text" name="username" id="" className={styles.input} />

      <label htmlFor="password">Password</label>
      <input type="password" name="password" id="" className={styles.input} />

      {userType === "vendedor" && (
        <>
          <label htmlFor="phone">Telefone</label>
          <input type="tel" name="phone" id="" className={styles.input} />

          {userType === "vendedor" && (
            <section>
              <label htmlFor="phone">Telefone</label>
              <input type="tel" name="phone" id="phone" className={styles.input} />

              {radioOptions.map((radio: any) => (
                <div key={radio.value}>
                  <label>
                    <input
                      type="radio"
                      value={radio.value}
                      checked={selectedRadioOption === radio.value}
                      onChange={radioHandler}
                    />
                    {radio.label}
                  </label>
                </div>
              ))}

              <label htmlFor="valorComissao">Valor da comissão</label>
              <input type="number" name="valorComissao" id="valorComissao" />
            </section>
          )}

          <label htmlFor="valorComissao">Valor da comissão</label>
          <input type="number" name="valorComissao" id="" />
        </>
      )}
    </form>
  );
}

export default AddAdminForm;
