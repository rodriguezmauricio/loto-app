"use client";

import styles from "./adicionarApostador.module.css";
import PageHeader from "@/app/components/pageHeader/PageHeader";
import Title from "@/app/components/title/Title";
import { useState } from "react";

import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  nome: string;
  telefone: string;
  nomeUsuario: string;
  pix: string;
  comissao: number;
};

const AdicionarApostador = () => {
  //TODO: Fetch data from the winners

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
      comissao: 15,
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    // console.log({ ...data, modalidade: modalidade });
  };

  return (
    <>
      <PageHeader title="Adicionar Apostador" subpage={true} linkTo={"/apostadores"} />
      <main className="main">
        <form className={styles.formContainer} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.fieldRow}>
            <Title h={3}>Nome completo</Title>
            <input
              className={styles.input}
              type="text"
              placeholder="ex.: Carlos Eduardo Silva"
              {...register("nome", { required: true })}
            />
            {errors.nome && <span className={styles.errorMessage}>Esse campo é necessário.</span>}
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
            {errors.telefone && (
              <span className={styles.errorMessage}>Esse campo é necessário.</span>
            )}
          </div>

          <div className={styles.fieldRow}>
            <Title h={3}>Nome de usuário</Title>
            <input
              className={styles.input}
              type="text"
              placeholder="ex.: cadu_silva"
              {...register("nomeUsuario", { required: true })}
            />
            {errors.nomeUsuario && (
              <span className={styles.errorMessage}>Esse campo é necessário.</span>
            )}
          </div>

          <div className={styles.fieldRow}>
            <input className={styles.sendButton} type="submit" />
          </div>
        </form>
      </main>
    </>
  );
};

export default AdicionarApostador;
