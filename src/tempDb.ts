export type ModalidadeKey = "Caixa" | "Sabedoria" | "Personalizada";

export interface ModalidadeCaixa {
    name: string;
    color: string;
    betNumbers: number[];
    trevoAmount: number[];
    maxNumber: number;
}

export interface ModalidadeSabedoria {
    name: string;
    color: string;
    betNumbers: number[];
    trevoAmount: number[];
    maxNumber?: number; // Optional as some categories may not have it
}

export interface ModalidadePersonalizada {
    name: string;
    color: string;
    betNumbers: number[];
    trevoAmount: number[];
    maxNumber?: number; // Optional
}

export interface Modalidade {
    Caixa?: ModalidadeCaixa[];
    Sabedoria?: ModalidadeSabedoria[];
    Personalizada?: ModalidadePersonalizada[];
}

export const tempDb = {
    modalidades: [
        {
            Caixa: [
                {
                    name: "Lotofácil",
                    color: "#930089",
                    betNumbers: [17, 18, 19, 20, 21, 22, 23],
                    trevoAmount: [0],
                    maxNumber: 25,
                },
                {
                    name: "ERRE X",
                    color: "purple",
                    betNumbers: [1],
                    trevoAmount: [0],
                    maxNumber: 25,
                },
                {
                    name: "Megasena",
                    color: "#209869",
                    betNumbers: [
                        20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
                        39, 40,
                    ],
                    trevoAmount: [0],
                    maxNumber: 60,
                },
                {
                    name: "Lotomania",
                    color: "#F78100",
                    betNumbers: [50],
                    trevoAmount: [0],
                    maxNumber: 100,
                },
                {
                    name: "Quina",
                    color: "#260085",
                    betNumbers: [
                        20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
                        39, 40, 41, 42, 43, 44, 45,
                    ],
                    trevoAmount: [0],
                    maxNumber: 80,
                },
                {
                    name: "Dupla Sena",
                    color: "#bf194e",
                    betNumbers: [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
                    trevoAmount: [0],
                    maxNumber: 50,
                },
                {
                    name: "Dia de Sorte",
                    color: "#CB852B",
                    betNumbers: [15, 16, 17, 18, 19, 20, 21, 22],
                    trevoAmount: [0],
                    maxNumber: 31,
                },
                {
                    name: "Timemania",
                    color: "#02FF02",
                    betNumbers: [
                        25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43,
                        44, 45, 46, 47, 48, 49, 50,
                    ],
                    trevoAmount: [0],
                    maxNumber: 80,
                },
                {
                    name: "+Milionária",
                    color: "#2E3078",
                    betNumbers: [6, 7, 8, 10, 11, 12],
                    trevoAmount: [2, 3, 4, 5, 6],
                    maxNumber: 50,
                },
                {
                    name: "Federal",
                    color: "#103099",
                    betNumbers: [1],
                    trevoAmount: [0],
                    maxNumber: 100,
                },
                {
                    name: "Loteca",
                    color: "#fb1f00",
                    betNumbers: [1],
                    trevoAmount: [0],
                    maxNumber: 100,
                },
                {
                    name: "Super Sete",
                    color: "#A8CF45",
                    betNumbers: [7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
                    trevoAmount: [0],
                    maxNumber: 100,
                },
                {
                    name: "Super 4",
                    color: "#364156",
                    betNumbers: [6, 7, 8, 10, 11, 12, 13, 14],
                    trevoAmount: [0],
                    maxNumber: 22,
                },
                {
                    name: "Super 5",
                    color: "#A8CF45",
                    betNumbers: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
                    trevoAmount: [0],
                    maxNumber: 28,
                },
            ],
        },
        {
            Sabedoria: [
                {
                    name: "Erre X",
                    color: "#A8CF45",
                    betNumbers: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
                    trevoAmount: [0],
                },
                {
                    name: "Sortinha",
                    color: "#A8CF45",
                    betNumbers: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
                    trevoAmount: [0],
                },
                {
                    name: "Lotinha",
                    color: "#A8CF45",
                    betNumbers: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
                    trevoAmount: [0],
                },
                {
                    name: "Quininha",
                    color: "#A8CF45",
                    betNumbers: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
                    trevoAmount: [0],
                },
                {
                    name: "Seninha",
                    color: "#A8CF45",
                    betNumbers: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
                    trevoAmount: [0],
                },
            ],
        },
        {
            Personalizada: [
                {
                    name: "Super 5",
                    color: "#A8CF45",
                    betNumbers: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
                    trevoAmount: [0],
                },
                {
                    name: "Quina Brasil",
                    color: "#A8CF45",
                    betNumbers: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
                    trevoAmount: [0],
                },
            ],
        },
    ],
    generalSettings: {
        bilhetes_horarioLimiteApotas: "20:00:00",
        bilhetes_valorMaximoPorBilhete: 20,
        bilhetes_quantidadeMaximaDeBilhetesPorCliente: 200,
        bilhetes_quantidadeMaximaDeBilhetesDuplicadosPorSorteio: 20,
        bilhetes_quantidadeMaximaDeBilhetesDuplicadosPorAposta: 0,
        bilhetes_bloquearCadastroDeBilhetesDuplicados: false,
        surpresinha_permitirCadastroIlimitadoDeBilhetes: true,
        surpresinha_permitirCadastroIlimitadoDeBilhetesDuplicados: false,
        app_exibirAlertaDeApostasDuplicadasNaHoraDaCriacao: true,
        app_iniciarFiltroDeApostasExibindoTodasAsApostas: true,
        app_exibirTodosOsClientesParaTodosOsVendedores: false,
        app_exibirListaDeGanhadoresParaOsVendedores: true,
        app_exibirListaDeGanhadoresParaOsClientes: false,
        app_exibirListaDeGanhadoresParaTodosOsUsuarios: false,
        app_exibirVendedoresInativos: false,
        permissoesAdm_ativarValidacaoDeQuantidadeMaxDeBilhetesParaOsAdmins: true,
        permissoesAdm_ativarValidacaoDoValorMaxPorBilhetesParaOsAdmins: true,
        permissoesAdm_ativarValidacaoDoBloqueioDeBilhetesDuplicadosParaOsAdmins: true,
        permissoesAdm_ativarValidacaoDoHorarioDeBloqueioParaOsAdmins: true,
        permissoesAdm_ativarValidacaoDoHorarioDeInicioDasVendasParaOsAdmins: true,
    },
};
