import { StyleSheet, Text, View } from 'react-native';
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
    <View style={estilos.cartao}>
      <View style={estilos.cabecalho}>
        <Text style={estilos.titulo}>Mesa {pedido.mesa}</Text>
        <BadgeStatusPedido status={pedido.status} />
      </View>
      <Text style={estilos.texto}>Cliente: {pedido.cliente}</Text>
      <Text style={estilos.texto}>
        {totalItens} item(ns) — R$ {valorTotal.toFixed(2)}
      </Text>
      {pedido.observacoes !== '' && (
        <Text style={estilos.texto}>Obs.: {pedido.observacoes}</Text>
      )}
      {totalItens > limiteItens && <Text style={estilos.destaque}>Pedido grande</Text>}
    </View>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titulo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  texto: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 2,
  },
  destaque: {
    fontSize: 12,
    fontWeight: '600',
    color: '#b45309',
    marginTop: 4,
  },
});
