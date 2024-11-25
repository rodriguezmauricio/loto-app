"use client";

import styles from "./adicionarSorteio.module.css";

import PageHeader from "components/pageHeader/PageHeader";
import Title from "components/title/Title";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler, Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

type Inputs = {
    numeroConcurso: string;
    dataSorteio: string;
    horarioLimiteAposta: string;
    inicioVendaBilhetes: string;
};

const schema = yup.object().shape({
    numeroConcurso: yup.string().required("Este campo é necessário"),
    dataSorteio: yup.string().required("Este campo é necessário"),
    horarioLimiteAposta: yup.string().required("Este campo é necessário"),
    inicioVendaBilhetes: yup.string().required("Este campo é necessário"),
});

const resolver = yupResolver(schema) as Resolver<Inputs>;

const AdicionarSorteioPage = () => {
    //TODO: Fetch data from the winners

    const [modalidade, setModalidade] = useState("Lotofácil");
    const [checked, setChecked] = useState(true);
    const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);

    const imediatamenteCheckbox = () => {
        const today = new Date();
        const day = today.getDate();
        const month = today.getMonth();
        const year = today.getFullYear();

        const treatedDay = () => {
            if (day.toString().length === 1) {
                return `0${Number(day)}`;
            } else {
                return day;
            }
        };

        const treatedMonth = () => {
            if (month.toString().length === 1) {
                return `0${Number(month) + 1}`;
            } else {
                return month + 1;
            }
        };

        return `${year}-${treatedMonth()}-${treatedDay()}`;
    };

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        setValue,
        reset,
    } = useForm<Inputs>({
        defaultValues: {
            numeroConcurso: "",
            dataSorteio: "",
            horarioLimiteAposta: "",
            inicioVendaBilhetes: imediatamenteCheckbox(),
        },
        resolver: resolver,
    });

    const handleChecked = () => {
        const today = imediatamenteCheckbox();
        setChecked(!checked);
        setValue("inicioVendaBilhetes", checked ? today : today);
    };

    useEffect(() => {
        reset({
            numeroConcurso: "",
            dataSorteio: "",
            horarioLimiteAposta: "",
            inicioVendaBilhetes: imediatamenteCheckbox(),
        });
    }, [isSubmitSuccessful, reset]);

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        console.log({ ...data, modalidade: modalidade });

        setIsSubmitSuccessful(true);
    };

    const buttonsCaixa = [
        {
            title: "Lotofácil",
            color: "#133daf",
        },
        {
            title: "Erre X",
            color: "#e96900",
        },
        {
            title: "Megasena",
            color: "#c4c009",
        },
        {
            title: "Lotomania",
            color: "#9b1b7f",
        },
        {
            title: "Quina",
            color: "#332b7a",
        },
        {
            title: "Dupla Sena",
            color: "#1abb93",
        },
        {
            title: "Dia de Sorte",
            color: "#459c2b",
        },
        {
            title: "Timemania",
            color: "#810000",
        },
        {
            title: "+ Milionária",
            color: "#0054b3",
        },
    ];

    const renderButtons = (buttonsArr: any[]) => {
        return buttonsCaixa.map((button, index) => {
            return (
                <button
                    style={{ background: button.title === modalidade ? button.color : "#1b1b1b" }}
                    className={`${styles.buttonFilter} ${
                        button.title === modalidade ? styles.modalidadeSelected : ""
                    }`}
                    key={button.title}
                    onClick={() => setModalidade(button.title)}
                >
                    {button.title}
                </button>
            );
        });
    };

    return (
        <>
            <PageHeader title="Adicionar Sorteio" subpage={true} linkTo={"/sorteios"} />
            <main className="main">
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
                        {
                            <span className={styles.errorMessage}>
                                {errors.numeroConcurso?.message}
                            </span>
                        }
                    </div>

                    <div className={styles.fieldRow}>
                        <Title h={3}>Data do Sorteio</Title>
                        <input
                            className={styles.input}
                            type="date"
                            placeholder="3000"
                            {...register("dataSorteio", { required: true })}
                        />
                        {<span className={styles.errorMessage}>{errors.dataSorteio?.message}</span>}
                    </div>

                    <div className={styles.fieldRow}>
                        <Title h={3}>Horário limite de apostas</Title>
                        <input
                            className={styles.input}
                            type="time"
                            {...register("horarioLimiteAposta", { required: true })}
                        />
                        {
                            <span className={styles.errorMessage}>
                                {errors.horarioLimiteAposta?.message}
                            </span>
                        }
                    </div>

                    <div className={styles.fieldRow}>
                        <Title h={3}>Início da venda de bilhetes</Title>
                        <div className={styles.checkboxRow}>
                            <input
                                className={"checkbox"}
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

                                {
                                    <span className={styles.errorMessage}>
                                        {errors.inicioVendaBilhetes?.message}
                                    </span>
                                }
                            </>
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

export default AdicionarSorteioPage;
