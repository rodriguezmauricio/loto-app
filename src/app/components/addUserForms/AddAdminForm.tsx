import React from "react";
import styles from "./addAdminForm.module.scss";
import { IRadioOptions } from "@/app/(pages)/adicionarUsuario/page";
import { useForm, Controller } from "react-hook-form";
import SimpleButton from "../(buttons)/simpleButton/SimpleButton";

// Define a type for userType
export type UserType = "vendedor" | "usuario";

interface AddAdminFormProps {
  userType: UserType;
  radioOptions: IRadioOptions[];
  selectedRadioOption: string;
  radioHandler: (event: React.ChangeEvent<HTMLInputElement>) => void; // Better type for radioHandler
}

const AddAdminForm: React.FC<AddAdminFormProps> = ({
  userType,
  radioOptions,
  selectedRadioOption,
  radioHandler,
}) => {
  const { control, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.formSection}>
        <label htmlFor="username">Username</label>
        <Controller
          name="username"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <input type="text" {...field} name="username" id="username" className={styles.input} />
          )}
        />
      </div>

      <div className={styles.formSection}>
        <label htmlFor="password">Password</label>
        <Controller
          name="password"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <input
              type="password"
              {...field}
              name="password"
              id="password"
              className={styles.input}
            />
          )}
        />
      </div>

      {(userType === "vendedor" || userType === "usuario") && (
        <section className={styles.form}>
          <div className={styles.formSection}>
            <label htmlFor="phone">Telefone</label>
            <Controller
              name="phone"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <input type="tel" {...field} name="phone" id="phone" className={styles.input} />
              )}
            />
          </div>
        </section>
      )}

      {userType === "vendedor" && (
        <section className={styles.form}>
          <section className={styles.form}>
            <div className={styles.formSection}>
              <label htmlFor="tipoComissao">Tipo de Comissão:</label>
              {radioOptions.map((radio) => (
                <div key={radio.value}>
                  <Controller
                    name="tipoComissao"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="radio"
                        value={radio.value}
                        checked={selectedRadioOption === radio.value}
                        onChange={radioHandler}
                      />
                    )}
                  />
                  {radio.label}
                </div>
              ))}
            </div>

            <div className={styles.formSection}>
              <label htmlFor="valorComissao">Valor da comissão</label>
              <Controller
                name="valorComissao"
                control={control}
                defaultValue={10}
                render={({ field }) => (
                  <input
                    type="number"
                    {...field}
                    name="valorComissao"
                    id="valorComissao"
                    className={styles.input}
                  />
                )}
              />
            </div>
          </section>
        </section>
      )}

      {userType === "usuario" && (
        <section className={styles.form}>
          <label htmlFor="pix">Pix</label>
          <Controller
            name="valorComissao"
            control={control}
            defaultValue={10}
            render={({ field }) => (
              <input type="text" name="pix" id="pix" className={styles.input} />
            )}
          />
        </section>
      )}

      {userType != null && (
        <SimpleButton
          btnTitle={`Criar novo ${userType}`}
          func={() => console.log(`Novo ${userType} adicionado`)}
          isSelected={false}
        />
      )}
    </form>
  );
};

export default AddAdminForm;
