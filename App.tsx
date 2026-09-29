import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Botao } from './src/componentes/Botao';
import { CartoesResumo } from './src/componentes/CartoesResumo';
import { FormularioPedido } from './src/componentes/FormularioPedido';
import { ListaPedidos } from './src/componentes/ListaPedidos';
import { buscarPedidos } from './src/servicos/pedidosServico';
import { TemaContext, fonte, temaClaro, temaEscuro } from './src/types/tema';
import type { Tema } from './src/types/tema';
import type { NovoPedido, Pedido } from './src/types/pedido';

export default function App() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [escuro, setEscuro] = useState<boolean>(false);
  const [formularioAberto, setFormularioAberto] = useState<boolean>(false);

  const tema = escuro ? temaEscuro : temaClaro;
  const estilos = useMemo(() => criarEstilos(tema), [tema]);

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

  function criarPedido(dados: NovoPedido) {
    setPedidos((atual) => {
      const proximoId = atual.length === 0 ? 1 : Math.max(...atual.map((p) => p.id)) + 1;
      const agora = new Date().toISOString();
      const novo: Pedido = {
        id: proximoId,
        mesa: dados.mesa,
        atendenteId: dados.atendenteId,
        cliente: dados.cliente,
        itens: dados.itens,
        status: 'pendente',
        observacoes: dados.observacoes,
        criadoEm: agora,
        atualizadoEm: agora,
      };
      return [novo, ...atual];
    });
    setFormularioAberto(false);
  }

  return (
    <SafeAreaProvider>
      <TemaContext.Provider value={tema}>
        <SafeAreaView style={estilos.tela}>
          <StatusBar style={escuro ? 'light' : 'dark'} />

          <View style={estilos.topo}>
            <View style={estilos.linhaTitulo}>
              <Text style={estilos.titulo}>Gerenciamento de Pedidos</Text>
              <Botao
                titulo={escuro ? '☀️' : '🌑'}
                variante="secundario"
                aoPressionar={() => setEscuro((atual) => !atual)}
              />
            </View>
            <Botao titulo="+ Novo pedido" aoPressionar={() => setFormularioAberto(true)} />
          </View>

          {carregando ? (
            <View style={estilos.aviso}>
              <ActivityIndicator size="large" color={tema.primaria} />
              <Text style={estilos.textoAviso}>Carregando pedidos...</Text>
            </View>
          ) : (
            <ListaPedidos pedidos={pedidos} cabecalho={<CartoesResumo pedidos={pedidos} />} />
          )}

          <FormularioPedido
            visivel={formularioAberto}
            aoCriar={criarPedido}
            aoCancelar={() => setFormularioAberto(false)}
          />
        </SafeAreaView>
      </TemaContext.Provider>
    </SafeAreaProvider>
  );
}

function criarEstilos(tema: Tema) {
  return StyleSheet.create({
    tela: { flex: 1, backgroundColor: tema.fundo },
    topo: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12, gap: 12 },
    linhaTitulo: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    },
    titulo: {
      flex: 1,
      fontFamily: fonte,
      fontSize: 20,
      fontWeight: '700',
      color: tema.texto,
    },
    aviso: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    textoAviso: { fontFamily: fonte, fontSize: 14, color: tema.textoSuave, marginTop: 12 },
  });
}