"use client";

import styles from "./adicionarSorteio.module.css";

import Title from "@/app/components/title/Title";
import { useForm, SubmitHandler } from "react-hook-form";
import { ChangeEvent, useEffect, useState } from "react";
import PageHeader from "@/app/components/pageHeader/PageHeader";

type Inputs = {
  numeroConcurso: string;
  dataSorteio: string;
  horarioLimiteAposta: string;
  inicioVendaBilhetes: string;
};

const AdicionarSorteioPage = () => {
  //TODO: Fetch data from the winners

  const [selectedTab, setSelectedTab] = useState(0);
  const [modalidade, setModalidade] = useState("Lotofácil");
  const [checked, setChecked] = useState(true);
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
      inicioVendaBilhetes: imediatamenteCheckbox(),
    },
  });

  const handleChecked = () => {
    const today = imediatamenteCheckbox();
    setChecked(!checked);
    setValue("inicioVendaBilhetes", checked ? today : today);
  };

  const onSubmit: SubmitHandler<Inputs> = (data) =>
    console.log({ ...data, modalidade: modalidade });

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
    return buttonsCaixa.map((button, index) => {
      return (
        <button
          style={{ background: button.color }}
          className={styles.buttonFilter}
          key={button.title}
          onClick={() => setModalidade(button.title)}
        >
          {button.title}
        </button>
      );
    });
  };

  return (
    <section className="main">
      <PageHeader title="Adicionar Sorteio" subpage={true} linkTo={"/sorteios"} />

      <Title h={3}>
        <label>Modalidade</label>
      </Title>
      <div className={styles.buttonsRow}>{renderButtons(buttonsCaixa)}</div>

      <form className={styles.formContainer} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.fieldRow}>
          <Title h={3}>Concurso</Title>
          <input
            className={styles.input}
            type="number"
            placeholder="3000"
            {...register("numeroConcurso", { required: true })}
          />
          {errors.numeroConcurso && (
            <span className={styles.errorMessage}>This field is required</span>
          )}
        </div>

        <div className={styles.fieldRow}>
          <Title h={3}>Data do Sorteio</Title>
          <input
            className={styles.input}
            type="date"
            placeholder="3000"
            {...register("dataSorteio", { required: true })}
          />
          {errors.dataSorteio && (
            <span className={styles.errorMessage}>This field is required</span>
          )}
        </div>

        <div className={styles.fieldRow}>
          <Title h={3}>Horário limite de apostas</Title>
          <input
            className={styles.input}
            type="time"
            {...register("horarioLimiteAposta", { required: true })}
          />
          {errors.horarioLimiteAposta && (
            <span className={styles.errorMessage}>This field is required</span>
          )}
        </div>

        <div className={styles.fieldRow}>
          <Title h={3}>Início da venda de bilhetes</Title>
          <div className={styles.checkboxRow}>
            <input
              className={styles.checkbox}
              type="checkbox"
              checked={checked}
              onChange={handleChecked}
            />
            <label>Imediatamente</label>
          </div>
          {!checked && (
            <>
              <input
                className={styles.input}
                type="date"
                {...register("inicioVendaBilhetes", {
                  required: !checked,
                })}
              />

              {errors.inicioVendaBilhetes && (
                <span className={styles.errorMessage}>This field is required</span>
              )}
            </>
          )}
        </div>
        <div className={styles.fieldRow}>
          <input className={styles.sendButton} type="submit" />
        </div>
      </form>
    </section>
  );
};

export default AdicionarSorteioPage;
