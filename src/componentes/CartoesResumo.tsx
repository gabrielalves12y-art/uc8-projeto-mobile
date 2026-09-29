import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { fonte, useTema } from '../types/tema';
import type { Tema } from '../types/tema';
import type { Pedido, StatusPedido } from '../types/pedido';
import { calcularTotalPedido, formatarMoeda } from '../utils/pedidosrealizado';

interface CartoesResumoProps {
  pedidos: Pedido[];
}

export function CartoesResumo({ pedidos }: CartoesResumoProps) {
  const tema = useTema();
  const estilos = useMemo(() => criarEstilos(tema), [tema]);

  function contar(status: StatusPedido): number {
    return pedidos.filter((pedido) => pedido.status === status).length;
  }

  const valorTotal = pedidos.reduce((soma, pedido) => soma + calcularTotalPedido(pedido), 0);

  const cartoes: Array<{ rotulo: string; valor: string }> = [
    { rotulo: 'Total de pedidos', valor: String(pedidos.length) },
    { rotulo: 'Valor total', valor: formatarMoeda(valorTotal) },
    { rotulo: 'Pendentes', valor: String(contar('pendente')) },
    { rotulo: 'Em andamento', valor: String(contar('em_andamento')) },
    { rotulo: 'Concluídos', valor: String(contar('concluido')) },
  ];

  return (
    <View style={estilos.grade}>
      {cartoes.map((cartao) => (
        <View key={cartao.rotulo} style={estilos.cartao}>
          <Text style={estilos.valor}>{cartao.valor}</Text>
          <Text style={estilos.rotulo}>{cartao.rotulo}</Text>
        </View>
      ))}
    </View>
  );
}

function criarEstilos(tema: Tema) {
  return StyleSheet.create({
    grade: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
    cartao: {
      flexGrow: 1,
      flexBasis: '45%',
      backgroundColor: tema.superficie,
      borderWidth: 1,
      borderColor: tema.borda,
      borderRadius: 10,
      paddingVertical: 14,
      paddingHorizontal: 16,
    },
    valor: { fontFamily: fonte, fontSize: 22, fontWeight: '700', color: tema.texto },
    rotulo: { fontFamily: fonte, fontSize: 13, color: tema.textoSuave },
  });
}
