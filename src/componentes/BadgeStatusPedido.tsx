import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { fonte, useTema } from '../types/tema';
import type { Tema } from '../types/tema';
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
  const tema = useTema();
  const estilos = useMemo(() => criarEstilos(tema), [tema]);

  return (
    <View style={[estilos.selo, estilos[status]]}>
      <Text style={[estilos.texto, { color: tema.status[status].cor }]}>{rotulos[status]}</Text>
    </View>
  );
}

function criarEstilos(tema: Tema) {
  return StyleSheet.create({
    selo: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
    },
    texto: { fontFamily: fonte, fontSize: 12, fontWeight: '600' },
    pendente: { backgroundColor: tema.status.pendente.fundo },
    em_andamento: { backgroundColor: tema.status.em_andamento.fundo },
    concluido: { backgroundColor: tema.status.concluido.fundo },
    cancelado: { backgroundColor: tema.status.cancelado.fundo },
  });
}
