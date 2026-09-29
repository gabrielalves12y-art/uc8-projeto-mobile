import { useMemo } from 'react';
import type { ReactElement } from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';
import { fonte, useTema } from '../types/tema';
import type { Tema } from '../types/tema';
import type { Pedido } from '../types/pedido';
import { CartaoPedido } from './CartaoPedido';

interface ListaPedidosProps {
  pedidos: Pedido[];
  cabecalho?: ReactElement;
}

export function ListaPedidos({ pedidos, cabecalho }: ListaPedidosProps) {
  const tema = useTema();
  const estilos = useMemo(() => criarEstilos(tema), [tema]);

  return (
    <FlatList
      data={pedidos}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => <CartaoPedido pedido={item} />}
      ListHeaderComponent={cabecalho}
      ListEmptyComponent={<Text style={estilos.vazio}>Nenhum pedido encontrado.</Text>}
      contentContainerStyle={estilos.conteudo}
    />
  );
}

function criarEstilos(tema: Tema) {
  return StyleSheet.create({
    conteudo: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 32 },
    vazio: {
      fontFamily: fonte,
      fontSize: 14,
      color: tema.textoSuave,
      textAlign: 'center',
      paddingVertical: 32,
    },
  });
}
