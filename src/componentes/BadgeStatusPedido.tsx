import { StyleSheet, Text, View } from 'react-native';
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
  return (
    <View style={[estilos.base, estilos[status]]}>
      <Text style={estilos.texto}>{rotulos[status]}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  base: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  texto: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  pendente: { backgroundColor: '#b45309' },
  em_andamento: { backgroundColor: '#1d4ed8' },
  concluido: { backgroundColor: '#15803d' },
  cancelado: { backgroundColor: '#b91c1c' },
});
