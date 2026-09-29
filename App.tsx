import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { FormularioPedido } from './src/componentes/FormularioPedido';
import type { DadosNovoPedido } from './src/componentes/FormularioPedido';
import { ListaPedidos } from './src/componentes/ListaPedidos';
import { buscarPedidos } from './src/servicos/pedidosServico';
import type { Pedido } from './src/types/pedido';

const ATENDENTE_PADRAO_ID = 1;

export default function App() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);

  useEffect(() => {
    let ativo = true;

    buscarPedidos().then((dados) => {
      if (ativo) {
        setPedidos(dados);
        setCarregando(false);
      }
    });

    return () => {
      ativo = false;
    };
  }, []);

  function criarPedido(dados: DadosNovoPedido) {
    setPedidos((atual) => {
      const proximoId = atual.length === 0 ? 1 : Math.max(...atual.map((p) => p.id)) + 1;
      const agora = new Date().toISOString();
      const novo: Pedido = {
        id: proximoId,
        mesa: dados.mesa,
        cliente: dados.cliente,
        atendenteId: ATENDENTE_PADRAO_ID,
        itens: [],
        status: 'pendente',
        observacoes: dados.observacoes,
        criadoEm: agora,
        atualizadoEm: agora,
      };
      return [...atual, novo];
    });
  }

  return (
    <SafeAreaView style={estilos.tela}>
      <Text style={estilos.titulo}>Comanda do restaurante</Text>

      {carregando ? (
        <View style={estilos.aviso}>
          <ActivityIndicator size="large" />
          <Text style={estilos.textoAviso}>Carregando pedidos...</Text>
        </View>
      ) : (
        <ListaPedidos
          pedidos={pedidos}
          cabecalho={<FormularioPedido aoCriar={criarPedido} />}
        />
      )}
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  titulo: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  aviso: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoAviso: {
    marginTop: 12,
    fontSize: 16,
    color: '#374151',
  },
});
