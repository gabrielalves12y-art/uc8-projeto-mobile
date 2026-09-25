import { useEffect, useState } from 'react';
import type { Funcionario } from './types/funcionario';
import type { Produto } from './types/produto';
import type { Pedido } from './types/pedido';
import { FormularioPedido } from './componentes/FormularioPedido';
import { ListaPedidos } from './componentes/ListaPedidos';

const funcionarios: Funcionario[] = [
  { id: 1, nome: 'Ana Souza', cargo: 'Garcom' },
  { id: 2, nome: 'Bruno Lima', cargo: 'Atendente' },
  { id: 3, nome: 'Carla Dias', cargo: 'Gerente' },
];

const produtos: Produto[] = [
  { id: 1, nome: 'X-Salada', categoria: 'Lanches', valorUnitario: 22.5 },
  { id: 2, nome: 'Suco de Laranja', categoria: 'Bebidas', valorUnitario: 8 },
  { id: 3, nome: 'Batata Frita', categoria: 'Porções', valorUnitario: 15 },
];

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

export default function App() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);

  useEffect(() => {
    let ativo = true;

    const tarefa = setTimeout(() => {
      if (ativo) {
        setPedidos(pedidosIniciais);
        setCarregando(false);
      }
    }, 400);

    return () => {
      ativo = false;
      clearTimeout(tarefa);
    };
  }, []);

  function adicionarPedido(pedido: Pedido) {
    setPedidos((atual) => [...atual, pedido]);
  }

  const proximoId =
    pedidos.length === 0 ? 1 : Math.max(...pedidos.map((pedido) => pedido.id)) + 1;

  return (
    <main>
      <h1>Comanda do restaurante</h1>

      <FormularioPedido
        funcionarios={funcionarios}
        produtos={produtos}
        aoAdicionar={adicionarPedido}
        proximoId={proximoId}
      />

      <h2>Pedidos</h2>
      <ListaPedidos pedidos={pedidos} carregando={carregando} />
    </main>
  );
}
