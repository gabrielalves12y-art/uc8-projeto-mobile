import type { Pedido } from '../types/pedido';
import { CartaoPedido } from './CartaoPedido';

interface ListaPedidosProps {
  pedidos: Pedido[];
  carregando?: boolean;
}

export function ListaPedidos({ pedidos, carregando = false }: ListaPedidosProps) {
  if (carregando) {
    return <p>Carregando pedidos...</p>;
  }

  if (pedidos.length === 0) {
    return <p>Nenhum pedido cadastrado.</p>;
  }

  return (
    <ul>
      {pedidos.map((pedido) => (
        <li key={pedido.id}>
          <CartaoPedido pedido={pedido} />
        </li>
      ))}
    </ul>
  );
}
