import type { Pedido } from '../types/pedido';

const pedidosIniciais: Pedido[] = [
  {
    id: 1,
    mesa: '4',
    cliente: 'Mariana Alves',
    atendenteId: 1,
    itens: [
      { produtoId: 1, quantidade: 2, valorUnitario: 22.5 },
      { produtoId: 2, quantidade: 2, valorUnitario: 8 },
    ],
    status: 'em_andamento',
    observacoes: 'Sem cebola no lanche.',
    criadoEm: '2026-09-20T18:30:00.000Z',
    atualizadoEm: '2026-09-20T18:35:00.000Z',
  },
  {
    id: 2,
    mesa: '7',
    cliente: 'João Pereira',
    atendenteId: 2,
    itens: [{ produtoId: 3, quantidade: 1, valorUnitario: 15 }],
    status: 'pendente',
    observacoes: '',
    criadoEm: '2026-09-20T19:00:00.000Z',
    atualizadoEm: '2026-09-20T19:00:00.000Z',
  },
];

// Hoje devolve dados fixos após um atraso simulado.
// Um dia esta função passa a buscar de uma API de verdade.
export function buscarPedidos(): Promise<Pedido[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(pedidosIniciais), 1200);
  });
}
