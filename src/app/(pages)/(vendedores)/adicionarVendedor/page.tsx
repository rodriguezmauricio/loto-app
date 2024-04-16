"use client";

import styles from "./adicionarVendedor.module.css";
import PageHeader from "@/app/components/pageHeader/PageHeader";
import Title from "@/app/components/title/Title";
import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/redux/store";
import { v4 as uuidv4 } from "uuid";

import { useForm, SubmitHandler, Resolver } from "react-hook-form";
import { BsCurrencyDollar, BsPercent } from "react-icons/bs";
import { updateSellers, addSellers } from "@/app/redux/sellersSlice";
import useFetchData from "@/app/utils/useFetchData";

type Inputs = {
  nome: string;
  telefone: string;
  nomeUsuario: string;
  pix: string;
  saldo: number;
  tipoComissao: string;
  valorComissao: number;
};

const schema = yup.object().shape({
  nome: yup.string().required("Este campo é necessário"),
  telefone: yup.string().required("Este campo é necessário"),
  nomeUsuario: yup.string().required("Este campo é necessário"),
  pix: yup.string().required("Este campo é necessário"),
  saldo: yup.number(),
  tipoComissao: yup.string(),
  valorComissao: yup
    .number()
    .required("Este campo é necessário e maior que zero")
    .positive("O valor precisa ser maior que zero"),
});

const AdicionarVendedor = () => {
  //TODO: Fetch data from the winners
  const dispatch = useDispatch();

  const [isComissaoPercent, setisComissaoPercent] = useState("percent");

  //fetch data from server
  const URL = "http://localhost:3500/sellers";
  const { data } = useFetchData(URL);

  useEffect(() => {
    if (data && data.length > 0) {
      dispatch(updateSellers(data[0]));
    }
  }, [data, dispatch]);

  const resolver = yupResolver(schema) as Resolver<Inputs>;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
    setValue,
  } = useForm<Inputs>({
    defaultValues: {
      nome: "",
      telefone: "",
      nomeUsuario: "",
      pix: "",
      saldo: 0,
      tipoComissao: "percent",
      valorComissao: 0,
    },
    resolver: resolver,
  });

  const handleChecked = (comissaoPercent: boolean) => {
    setisComissaoPercent(comissaoPercent ? "percent" : "absolute");
  };

  const calcComissao = (comissaoType: string, value: number) => {
    if (comissaoType === "percent") {
      return value / 100;
    }

    return value;
  };

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const newUser = {
      ...data,
      adminId: "a01",
      id: uuidv4(),
      tipoComissao: isComissaoPercent,
    };

    fetch("http://localhost:3500/sellers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    })
      .then((response) => response.json())
      .then((user) => console.log(user));

    reset();

    // dispatch(
    //   addSellers()
    // );
  };

  return (
    <>
      <PageHeader title="Adicionar Vendedor" subpage={true} linkTo={"/vendedores"} />
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
                className={`${styles.button} ${
                  isComissaoPercent === "percent" ? styles.active : ""
                }`}
                onClick={() => handleChecked(true)}
              >
                Percentual
              </button>
              <button
                type="button"
                className={`${styles.button} ${
                  isComissaoPercent === "percent" ? "" : styles.active
                }`}
                onClick={() => handleChecked(false)}
              >
                Fixo
              </button>
            </div>

            <>
              <input
                className={styles.input}
                type="number"
                {...register("valorComissao", {
                  required: true,
                  setValueAs(value) {
                    return calcComissao(isComissaoPercent, value);
                  },
                })}
              />

              {<span className={styles.errorMessage}>{errors.valorComissao?.message}</span>}

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
