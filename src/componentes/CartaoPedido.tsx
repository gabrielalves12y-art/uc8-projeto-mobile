import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { nomeDoFuncionario, nomeDoProduto } from '../types/dados/catalogo';
import { fonte, useTema } from '../types/tema';
import type { Tema } from '../types/tema';
import type { Pedido } from '../types/pedido';
import { calcularTotalPedido, formatarDataHora, formatarMoeda } from '../utils/pedidosrealizado';
import { BadgeStatusPedido } from './BadgeStatusPedido';

interface CartaoPedidoProps {
  pedido: Pedido;
}

export function CartaoPedido({ pedido }: CartaoPedidoProps) {
  const tema = useTema();
  const estilos = useMemo(() => criarEstilos(tema), [tema]);

  const resumoItens = pedido.itens
    .map((item) => `${item.quantidade}x ${nomeDoProduto(item.produtoId)}`)
    .join(', ');

  return (
    <View style={estilos.cartao}>
      <View style={estilos.cabecalho}>
        <Text style={estilos.mesa}>{pedido.mesa}</Text>
        <BadgeStatusPedido status={pedido.status} />
      </View>

      <View style={estilos.grade}>
        <View style={estilos.celula}>
          <Text style={estilos.legenda}>Atendente</Text>
          <Text style={estilos.valor}>{nomeDoFuncionario(pedido.atendenteId)}</Text>
        </View>
        <View style={estilos.celula}>
          <Text style={estilos.legenda}>Cliente</Text>
          <Text style={estilos.valor}>{pedido.cliente}</Text>
        </View>
      </View>

      <Text style={estilos.legenda}>Itens</Text>
      <Text style={estilos.itens}>{resumoItens === '' ? 'Sem itens' : resumoItens}</Text>

      {pedido.observacoes !== '' && (
        <View style={estilos.observacoes}>
          <Text style={estilos.textoObservacoes}>{pedido.observacoes}</Text>
        </View>
      )}

      <View style={estilos.rodape}>
        <Text style={estilos.data}>{formatarDataHora(pedido.criadoEm)}</Text>
        <Text style={estilos.total}>{formatarMoeda(calcularTotalPedido(pedido))}</Text>
      </View>
    </View>
  );
}

function criarEstilos(tema: Tema) {
  return StyleSheet.create({
    cartao: {
      backgroundColor: tema.superficie,
      borderWidth: 1,
      borderColor: tema.borda,
      borderRadius: 10,
      padding: 16,
      marginBottom: 12,
    },
    cabecalho: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    mesa: { fontFamily: fonte, fontSize: 16, fontWeight: '700', color: tema.texto },
    grade: { flexDirection: 'row', gap: 16, marginBottom: 12 },
    celula: { flex: 1 },
    legenda: {
      fontFamily: fonte,
      fontSize: 12,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      color: tema.textoSuave,
      marginBottom: 2,
    },
    valor: { fontFamily: fonte, fontSize: 14, color: tema.texto },
    itens: { fontFamily: fonte, fontSize: 13, color: tema.textoSuave },
    observacoes: {
      backgroundColor: tema.fundo,
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 12,
      marginTop: 12,
    },
    textoObservacoes: { fontFamily: fonte, fontSize: 14, color: tema.texto },
    rodape: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: tema.borda,
      marginTop: 12,
      paddingTop: 12,
    },
    data: { fontFamily: fonte, fontSize: 12, color: tema.textoSuave },
    total: { fontFamily: fonte, fontSize: 16, fontWeight: '700', color: tema.texto },
  });
}
