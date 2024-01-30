"use client";

import styles from "./adicionarVendedor.module.css";
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

const AdicionarVendedor = () => {
  //TODO: Fetch data from the winners

  const [isComissaoPercent, setisComissaoPercent] = useState(true);
  const imediatamenteCheckbox = () => {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth();
    const year = today.getFullYear();

    const treatedMonth = () => {
      if (month.toString().length === 1) {
        return `0${Number(month) + 1}`;
      } else {
        return month + 1;
      }
    };

    return `${year}-${treatedMonth()}-${day}`;
  };
  const [inicioVendaDate, setInicioVendaDate] = useState(imediatamenteCheckbox());

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

  const calcComissaoPercent = (comissao: number) => {
    return comissao + "%";
  };

  const handleChecked = (comissaoPercent: boolean) => {
    setisComissaoPercent(!comissaoPercent);
    setValue("comissao", isComissaoPercent ? calcComissaoPercent(comissao) : comissao);
  };

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    // console.log({ ...data, modalidade: modalidade });
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
              {...register("nomeUsuario", { required: true })}
            />
            {errors.nomeUsuario && (
              <span className={styles.errorMessage}>Esse campo é necessário.</span>
            )}
          </div>

          <div className={styles.fieldRow}>
            <Title h={3}>Comissão</Title>
            <div className={styles.checkboxRow}>
              <input
                className={"checkbox"}
                type="checkbox"
                checked={isComissaoPercent}
                onChange={() => handleChecked(isComissaoPercent)}
              />
              <label>Percentual</label>
            </div>

            <>
              <input
                className={styles.input}
                type="number"
                {...register("comissao", {
                  required: !isComissaoPercent,
                })}
              />

              {errors.comissao && (
                <span className={styles.errorMessage}>Esse campo é necessário.</span>
              )}
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
