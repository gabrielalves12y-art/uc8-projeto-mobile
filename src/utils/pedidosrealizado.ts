import type { Pedido } from '../types/pedido';

export function calcularTotalPedido(pedido: Pick<Pedido, 'itens'>): number {
  return pedido.itens.reduce((soma, item) => soma + item.quantidade * item.valorUnitario, 0);
}

export function formatarMoeda(valor: number): string {
  const [inteiro, centavos] = valor.toFixed(2).split('.');
  const comMilhar = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `R$ ${comMilhar},${centavos}`;
}

function doisDigitos(numero: number): string {
  return String(numero).padStart(2, '0');
}

export function formatarDataHora(iso: string): string {
  const data = new Date(iso);
  const dia = doisDigitos(data.getDate());
  const mes = doisDigitos(data.getMonth() + 1);
  const hora = doisDigitos(data.getHours());
  const minuto = doisDigitos(data.getMinutes());
  return `${dia}/${mes}/${data.getFullYear()} ${hora}:${minuto}`;
}
