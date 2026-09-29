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
  perigo: string;
  perigoFundo: string;
  status: Record<StatusPedido, CoresStatus>;
}

export const temaClaro: Tema = {
  escuro: false,
  fundo: '#f4f5f7',
  superficie: '#ffffff',
  texto: '#1f2430',
  textoSuave: '#6b7280',
  borda: '#e3e5ea',
  primaria: '#3b5bfd',
  primariaEscura: '#2d47cc',
  perigo: '#e0483e',
  perigoFundo: '#fdecea',
  status: {
    pendente: { cor: '#b7791f', fundo: '#fef3d9' },
    em_andamento: { cor: '#2563eb', fundo: '#e2ebff' },
    concluido: { cor: '#1f9d55', fundo: '#e2f6e9' },
    cancelado: { cor: '#6b7280', fundo: '#eceff1' },
  },
};

export const temaEscuro: Tema = {
  escuro: true,
  fundo: '#0f1117',
  superficie: '#1a1d27',
  texto: '#e8eaf0',
  textoSuave: '#8b92a5',
  borda: '#2a2d3a',
  primaria: '#5b7cfd',
  primariaEscura: '#4a68e8',
  perigo: '#f06b62',
  perigoFundo: '#2d1a19',
  status: {
    pendente: { cor: '#e0a020', fundo: '#2a2010' },
    em_andamento: { cor: '#5b9bff', fundo: '#101e36' },
    concluido: { cor: '#34c76a', fundo: '#0d2318' },
    cancelado: { cor: '#8b92a5', fundo: '#1e2030' },
  },
};

export const fonte: string = Platform.select({ ios: 'Menlo', default: 'Roboto' });

export const TemaContext = createContext<Tema>(temaClaro);

export function useTema(): Tema {
  return useContext(TemaContext);
}
