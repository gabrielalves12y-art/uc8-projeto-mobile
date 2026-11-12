import type { ImageSourcePropType } from 'react-native';

export interface Produto {
    id: number;
    nome: string;
    categoria: string;
    valorUnitario: number;
    descricao: string;
    emoji: string;
    foto?: ImageSourcePropType;
}