import type { ReactElement } from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';
import type { Pedido } from '../types/pedido';
import { CartaoPedido } from './CartaoPedido';

interface ListaPedidosProps {
  pedidos: Pedido[];
  cabecalho?: ReactElement;
}

export function ListaPedidos({ pedidos, cabecalho }: ListaPedidosProps) {
  return (
    <FlatList
      data={pedidos}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => <CartaoPedido pedido={item} />}
      ListHeaderComponent={cabecalho}
      ListEmptyComponent={<Text style={estilos.vazio}>Nenhum pedido cadastrado.</Text>}
      contentContainerStyle={estilos.conteudo}
      keyboardShouldPersistTaps="handled"
    />
  );
}

const estilos = StyleSheet.create({
  conteudo: {
    padding: 16,
  },
  vazio: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 16,
  },
});
