import type { StatusPedido } from '../types/pedido';

interface BadgeStatusPedidoProps {
  status: StatusPedido;
}

const rotulos: Record<StatusPedido, string> = {
  pendente: 'Pendente',
  em_andamento: 'Em andamento',
  concluido: 'Concluído',
  cancelado: 'Cancelado',
};

export function BadgeStatusPedido({ status }: BadgeStatusPedidoProps) {
  return <span className={`badge badge-${status}`}>{rotulos[status]}</span>;
}
