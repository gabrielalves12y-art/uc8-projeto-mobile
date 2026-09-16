import { Funcionario } from './funcionario';
import { Produto } from './produto';

export type StatusPedido = 'pendente' | 'em_andamento' | 'concluido' | 'cancelado';

export interface ItemPedido {
  produtoId: Produto['id'];
  quantidade: number;
  valorUnitario: number;
}

export interface Pedido {
  id: number;
  mesa: string;
  atendenteId: Funcionario['id'];
  cliente: string;
  itens: ItemPedido[];
  status: StatusPedido;
  observacoes: string;
  criadoEm: string;
  atualizadoEm: string;
}