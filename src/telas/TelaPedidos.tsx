import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Botao } from '../componentes/Botao';
import { FormularioPedido } from '../componentes/FormularioPedido';
import { ListaPedidos } from '../componentes/ListaPedidos';
import { buscarPedidos, salvarPedido } from '../servicos/pedidosServico';
import { fonte, useTema } from '../types/tema';
import type { Tema } from '../types/tema';
import type { NovoPedido, Pedido } from '../types/pedido';

export function TelaPedidos() {
  const tema = useTema();
  const estilos = useMemo(() => criarEstilos(tema), [tema]);

  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string>('');
  const [formularioAberto, setFormularioAberto] = useState<boolean>(false);

  const carregarPedidos = useCallback(async () => {
    try {
      setPedidos(await buscarPedidos());
      setErro('');
    } catch {
      setErro('Não foi possível carregar os pedidos. Verifique se a API está no ar.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarPedidos();
  }, [carregarPedidos]);

  async function criarPedido(dados: NovoPedido): Promise<string> {
    try {
      await salvarPedido(dados);
    } catch (e) {
      return e instanceof Error ? e.message : 'Não foi possível salvar o pedido.';
    }
    setFormularioAberto(false);
    await carregarPedidos();
    return '';
  }

  return (
    <View style={estilos.tela}>
      <View style={estilos.acoes}>
        <Botao titulo="+ Novo pedido" aoPressionar={() => setFormularioAberto(true)} />
      </View>

      {erro !== '' && <Text style={estilos.erro}>{erro}</Text>}

      {carregando ? (
        <View style={estilos.aviso}>
          <ActivityIndicator size="large" color={tema.primaria} />
          <Text style={estilos.textoAviso}>Carregando pedidos...</Text>
        </View>
      ) : (
        <ListaPedidos pedidos={pedidos} />
      )}

      <FormularioPedido
        visivel={formularioAberto}
        aoCriar={criarPedido}
        aoCancelar={() => setFormularioAberto(false)}
      />
    </View>
  );
}

function criarEstilos(tema: Tema) {
  return StyleSheet.create({
    tela: { flex: 1 },
    acoes: { paddingHorizontal: 16, paddingBottom: 12 },
    aviso: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    textoAviso: { fontFamily: fonte, fontSize: 14, color: tema.textoSuave, marginTop: 12 },
    erro: {
      fontFamily: fonte,
      fontSize: 13,
      color: tema.perigo,
      backgroundColor: tema.perigoFundo,
      borderRadius: 8,
      paddingVertical: 8,
      paddingHorizontal: 12,
      marginHorizontal: 16,
      marginBottom: 8,
    },
  });
}
