import { createContext, useContext } from 'react';
import { Platform } from 'react-native';
import type { StatusPedido } from '../types/pedido';

interface CoresStatus {
  cor: string;
  fundo: string;
}

export interface Tema {
  escuro: boolean;
  fundo: string;
  superficie: string;
  texto: string;
  textoSuave: string;
  borda: string;
  primaria: string;
  primariaEscura: string;
  primariaFundo: string;
  perigo: string;
  perigoFundo: string;
  status: Record<StatusPedido, CoresStatus>;
}

export const temaClaro: Tema = {
  escuro: false,
  fundo: '#fbf5ec',
  superficie: '#fffdf9',
  texto: '#3b2a20',
  textoSuave: '#7a6455',
  borda: '#eadfd0',
  primaria: '#c93f1a',
  primariaEscura: '#a93213',
  primariaFundo: '#fdeae3',
  perigo: '#a61b2b',
  perigoFundo: '#fbe6e4',
  status: {
    pendente: { cor: '#8f5f00', fundo: '#fdf0cc' },
    em_andamento: { cor: '#7b3f8c', fundo: '#f2e5f6' },
    concluido: { cor: '#2f7a2c', fundo: '#e4f2dd' },
    cancelado: { cor: '#6f5f53', fundo: '#efe9e3' },
  },
};

export const temaEscuro: Tema = {
  escuro: true,
  fundo: '#0f1117',
  superficie: '#1a1d27',
  texto: '#e8eaf0',
  textoSuave: '#8b92a5',
  borda: '#2a2d3a',
  primaria: '#d0422d',
  primariaEscura: '#b53826',
  primariaFundo: '#2f1a1a',
  perigo: '#ec7aa6',
  perigoFundo: '#2d1a24',
  status: {
    pendente: { cor: '#e0a020', fundo: '#2a2010' },
    em_andamento: { cor: '#5b9bff', fundo: '#101e36' },
    concluido: { cor: '#34c76a', fundo: '#0d2318' },
    cancelado: { cor: '#9a9a9a', fundo: '#232323' },
  },
};

export const fonte: string = Platform.select({ ios: 'Menlo', default: 'Roboto' });

export const TemaContext = createContext<Tema>(temaClaro);

export function useTema(): Tema {
  return useContext(TemaContext);
}
