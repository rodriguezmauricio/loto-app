"use client";

import styles from "./adicionarSorteio.module.css";

import PageHeader from "../../components/pageHeader/PageHeader";
import Title from "@/app/components/title/Title";
import { useForm, SubmitHandler } from "react-hook-form";
import { ChangeEvent, useState } from "react";

type Inputs = {
  numeroConcurso: string;
  dataSorteio: string;
  horarioLimiteAposta: string;
  inicioVendaBilhetes: string;
};

const AdicionarSorteioPage = () => {
  //TODO: Fetch data from the winners

  const [selectedTab, setSelectedTab] = useState(0);
  const [checked, setChecked] = useState(true);

  const handleChecked = () => setChecked(!checked);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  const buttonsCaixa = [
    {
      title: "Lotofácil",
      color: "#1b1b1b",
    },
    {
      title: "Erre X",
      color: "#1b1b1b",
    },
    {
      title: "Megasena",
      color: "#1b1b1b",
    },
    {
      title: "Lotomania",
      color: "#1b1b1b",
    },
    {
      title: "Quina",
      color: "#1b1b1b",
    },
    {
      title: "Dupla Sena",
      color: "#1b1b1b",
    },
    {
      title: "Dia de Sorte",
      color: "#1b1b1b",
    },
    {
      title: "Timemania",
      color: "#1b1b1b",
    },
    {
      title: "+ Milionária",
      color: "#1b1b1b",
    },
  ];

  const renderButtons = (buttonsArr: any[]) => {
    return buttonsCaixa.map((button) => {
      return (
        <button
          style={{ background: button.color }}
          className={styles.buttonFilter}
          key={button.title}
        >
          {button.title}
        </button>
      );
    });
  };

  return (
    <section className="main">
      <PageHeader title="Adicionar Sorteio" subpage={true} />

      <Title h={2}>
        <label>Modalidade</label>
      </Title>
      <div className={styles.buttonsRow}>{renderButtons(buttonsCaixa)}</div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Title h={2}>Concurso</Title>
        <input
          className={styles.input}
          type="number"
          placeholder="3000"
          {...register("numeroConcurso", { required: true })}
        />
        {errors.numeroConcurso && <span>This field is required</span>}

        <Title h={2}>Data do Sorteio</Title>
        <input
          className={styles.input}
          type="date"
          placeholder="3000"
          {...register("dataSorteio", { required: true })}
        />
        {errors.dataSorteio && <span>This field is required</span>}

        <Title h={2}>Horário limite de apostas</Title>
        <input
          className={styles.input}
          type="time"
          {...register("horarioLimiteAposta", { required: true })}
        />
        {errors.horarioLimiteAposta && <span>This field is required</span>}

        <Title h={2}>Início da venda de bilhetes</Title>

        <div>
          <input type="checkbox" name="imediatamente" checked={checked} onClick={handleChecked} />
          <label htmlFor="imediatamente">Imediatamente</label>
        </div>
        {!checked && (
          <input
            className={styles.input}
            type="date"
            {...register("inicioVendaBilhetes", { required: true })}
          />
        )}
        {errors.inicioVendaBilhetes && <span>This field is required</span>}
        <input type="submit" />
      </form>
    </section>
  );
};

export default AdicionarSorteioPage;
