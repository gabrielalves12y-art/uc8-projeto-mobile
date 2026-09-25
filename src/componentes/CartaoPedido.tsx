import type { Pedido } from '../types/pedido';
import { BadgeStatusPedido } from './BadgeStatusPedido';

interface CartaoPedidoProps {
  pedido: Pedido;
  limiteItens?: number;
}

export function CartaoPedido({ pedido, limiteItens = 3 }: CartaoPedidoProps) {
  const totalItens = pedido.itens.length;
  const valorTotal = pedido.itens.reduce(
    (soma, item) => soma + item.quantidade * item.valorUnitario,
    0,
  );

  return (
    <article className="cartao-pedido">
      <header>
        <h3>Mesa {pedido.mesa}</h3>
        <BadgeStatusPedido status={pedido.status} />
      </header>
      <p>Cliente: {pedido.cliente}</p>
      <p>
        {totalItens} item(ns) — R$ {valorTotal.toFixed(2)}
      </p>
      {pedido.observacoes && <p>Obs.: {pedido.observacoes}</p>}
      {totalItens > limiteItens && <p>Pedido grande</p>}
    </article>
  );
}
