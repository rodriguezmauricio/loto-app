// types/tempDb.ts
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
    maxNumber: number;
}

export interface ModalidadePersonalizada {
    name: string;
    color: string;
    betNumbers: number[];
    trevoAmount: number[];
    maxNumber: number;
}

export type Modalidade =
    | { modalidadesCaixa: ModalidadeCaixa[] }
    | { modalidadeSabedoria: ModalidadeSabedoria[] }
    | { modalidadePersonalizada: ModalidadePersonalizada[] };
