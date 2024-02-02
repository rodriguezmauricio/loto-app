"use client";

import styles from "./adicionarVendedor.module.css";
import PageHeader from "@/app/components/pageHeader/PageHeader";
import Title from "@/app/components/title/Title";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useForm, SubmitHandler, Resolver } from "react-hook-form";
import { BsCurrencyDollar, BsPercent } from "react-icons/bs";

type Inputs = {
  nome: string;
  telefone: string;
  nomeUsuario: string;
  pix: string;
  isComissaoPercent: boolean;
  comissao: number;
};

const schema = yup.object().shape({
  nome: yup.string().required("Este campo é necessário"),
  telefone: yup.string().required("Este campo é necessário"),
  nomeUsuario: yup.string().required("Este campo é necessário"),
  pix: yup.string().required("Este campo é necessário"),
  isComissaoPercent: yup.boolean(),
  comissao: yup
    .number()
    .required("Este campo é necessário e maior que zero")
    .positive("O valor precisa ser maior que zero"),
});

const AdicionarVendedor = () => {
  //TODO: Fetch data from the winners

  const [isComissaoPercent, setisComissaoPercent] = useState(true);

  const resolver = yupResolver(schema) as Resolver<Inputs>;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<Inputs>({
    defaultValues: {
      nome: "",
      telefone: "",
      nomeUsuario: "",
      pix: "",
      isComissaoPercent,
      comissao: 0,
    },
    resolver: resolver,
  });

  const handleChecked = (comissaoPercent: boolean) => {
    setisComissaoPercent(comissaoPercent);
  };

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log({
      ...data,
      isComissaoPercent,
    });
  };

  return (
    <>
      <PageHeader title="Adicionar Vendedor" subpage={true} linkTo={"/sorteios"} />
      <main className="main">
        <form className={styles.formContainer} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.fieldRow}>
            <Title h={3}>Nome</Title>
            <input
              className={styles.input}
              type="text"
              placeholder="3000"
              {...register("nome", { required: true })}
            />
            {<span className={styles.errorMessage}>{errors.nome?.message}</span>}
          </div>

          <div className={styles.fieldRow}>
            <Title h={3}>Telefone</Title>

            {/* //TODO: add input mask */}
            <input
              className={styles.input}
              type="text"
              placeholder="(xx)xxxxx-xxxx"
              {...register("telefone", { required: true })}
            />
            {<span className={styles.errorMessage}>{errors.telefone?.message}</span>}
          </div>

          <div className={styles.fieldRow}>
            <Title h={3}>Nome de usuário</Title>
            <input
              className={styles.input}
              type="text"
              {...register("nomeUsuario", { required: true })}
            />

            {<span className={styles.errorMessage}>{errors.nomeUsuario?.message}</span>}
          </div>

          <div className={styles.fieldRow}>
            <Title h={3}>Pix</Title>
            <input className={styles.input} type="text" {...register("pix", { required: true })} />

            {<span className={styles.errorMessage}>{errors.pix?.message}</span>}
          </div>

          <div className={styles.fieldRow}>
            <Title h={3}>Comissão</Title>
            <div className={styles.checkboxRow}>
              <button
                type="button"
                className={`${styles.button} ${isComissaoPercent ? styles.active : ""}`}
                onClick={() => handleChecked(true)}
              >
                Percentual
              </button>
              <button
                type="button"
                className={`${styles.button} ${isComissaoPercent ? "" : styles.active}`}
                onClick={() => handleChecked(false)}
              >
                Fixo
              </button>
            </div>

            <>
              <input
                className={styles.input}
                type="number"
                {...register("comissao", {
                  required: true,
                  setValueAs(value) {
                    return value;
                  },
                })}
              />

              {<span className={styles.errorMessage}>{errors.comissao?.message}</span>}

              {/* {errors.comissao && (
                <span className={styles.errorMessage}>Esse campo é necessário.</span>
              )} */}
            </>
          </div>
          <div className={styles.fieldRow}>
            <input className={styles.sendButton} type="submit" />
          </div>
        </form>
      </main>
    </>
  );
};

export default AdicionarVendedor;