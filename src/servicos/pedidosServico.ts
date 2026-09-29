import type { Pedido } from '../types/pedido';

export function buscarPedidos(): Promise<Pedido[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve([]), 1200);
  });
}
