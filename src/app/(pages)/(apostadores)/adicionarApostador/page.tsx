"use client";

import styles from "./adicionarApostador.module.css";
import PageHeader from "@/app/components/pageHeader/PageHeader";
import Title from "@/app/components/title/Title";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useForm, SubmitHandler, Resolver } from "react-hook-form";

type Inputs = {
  nome: string;
  telefone: string;
  nomeUsuario: string;
  pix: string;
};

const schema = yup.object().shape({
  nome: yup.string().required("Este campo é necessário"),
  telefone: yup.string().required("Este campo é necessário"),
  nomeUsuario: yup.string().required("Este campo é necessário"),
  pix: yup.string().required("Este campo é necessário"),
});

const resolver = yupResolver(schema) as Resolver<Inputs>;

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
    },
    resolver: resolver,
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log({ ...data });
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
            {<span className={styles.errorMessage}>{errors.nome?.message}</span>}
            {/* {errors.nome && <span className={styles.errorMessage}>Esse campo é necessário.</span>} */}
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
            {/* {errors.telefone && (
              <span className={styles.errorMessage}>Esse campo é necessário.</span>
            )} */}
          </div>

          <div className={styles.fieldRow}>
            <Title h={3}>Nome de usuário</Title>
            <input
              className={styles.input}
              type="text"
              placeholder="ex.: cadu_silva"
              {...register("nomeUsuario", { required: true })}
            />
            {<span className={styles.errorMessage}>{errors.nomeUsuario?.message}</span>}
            {/* {errors.nomeUsuario && (
              <span className={styles.errorMessage}>Esse campo é necessário.</span>
            )} */}
          </div>

          <div className={styles.fieldRow}>
            <Title h={3}>Pix</Title>
            <input
              className={styles.input}
              type="text"
              placeholder="email, telefone ou cpf"
              {...register("pix", { required: true })}
            />

            {<span className={styles.errorMessage}>{errors.pix?.message}</span>}
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
