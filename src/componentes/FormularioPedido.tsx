import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { funcionarios, produtos } from '../types/dados/catalogo';
import { fonte, useTema } from '../types/tema';
import type { Tema } from '../types/tema';
import type { ItemPedido, NovoPedido } from '../types/pedido';
import { formatarMoeda } from '../utils/pedidosrealizado';
import { Botao } from './Botao';
import { Seletor } from './Seletor';
import type { OpcaoSeletor } from './Seletor';

interface FormularioPedidoProps {
  visivel: boolean;
  aoCriar: (dados: NovoPedido) => void;
  aoCancelar: () => void;
}

interface LinhaItem {
  chave: number;
  produtoId: number;
  quantidade: string;
  valorUnitario: string;
}

const opcoesAtendente: OpcaoSeletor[] = funcionarios.map((funcionario) => ({
  valor: funcionario.id,
  rotulo: `${funcionario.nome} — ${funcionario.cargo}`,
}));

const opcoesProduto: OpcaoSeletor[] = produtos.map((produto) => ({
  valor: produto.id,
  rotulo: `${produto.nome} — ${formatarMoeda(produto.valorUnitario)}`,
}));

function novaLinha(chave: number): LinhaItem {
  const primeiro = produtos[0];
  return {
    chave,
    produtoId: primeiro.id,
    quantidade: '1',
    valorUnitario: String(primeiro.valorUnitario),
  };
}

function paraNumero(texto: string): number {
  return Number(texto.trim().replace(',', '.'));
}

export function FormularioPedido({ visivel, aoCriar, aoCancelar }: FormularioPedidoProps) {
  const tema = useTema();
  const estilos = useMemo(() => criarEstilos(tema), [tema]);

  const [mesa, setMesa] = useState<string>('');
  const [atendenteId, setAtendenteId] = useState<number>(funcionarios[0].id);
  const [cliente, setCliente] = useState<string>('');
  const [observacoes, setObservacoes] = useState<string>('');
  const [linhas, setLinhas] = useState<LinhaItem[]>([novaLinha(1)]);
  const [erro, setErro] = useState<string>('');

  const total = linhas.reduce((soma, linha) => {
    const quantidade = paraNumero(linha.quantidade) || 0;
    const valor = paraNumero(linha.valorUnitario) || 0;
    return soma + quantidade * valor;
  }, 0);

  function atualizarLinha(chave: number, mudancas: Partial<LinhaItem>) {
    setLinhas((atual) =>
      atual.map((linha) => (linha.chave === chave ? { ...linha, ...mudancas } : linha)),
    );
  }

  function trocarProduto(chave: number, produtoId: number) {
    const produto = produtos.find((item) => item.id === produtoId);
    if (produto) {
      atualizarLinha(chave, { produtoId, valorUnitario: String(produto.valorUnitario) });
    }
  }

  function adicionarLinha() {
    setLinhas((atual) => [...atual, novaLinha(Math.max(...atual.map((l) => l.chave)) + 1)]);
  }

  function removerLinha(chave: number) {
    setLinhas((atual) => (atual.length <= 1 ? atual : atual.filter((l) => l.chave !== chave)));
  }

  function reiniciar() {
    setMesa('');
    setAtendenteId(funcionarios[0].id);
    setCliente('');
    setObservacoes('');
    setLinhas([novaLinha(1)]);
    setErro('');
  }

  function validar(itens: ItemPedido[]): string {
    if (mesa.trim() === '') return 'Informe o número da mesa.';
    if (cliente.trim() === '') return 'Informe o nome do cliente.';
    if (itens.length === 0) return 'Adicione ao menos um item ao pedido.';
    for (const item of itens) {
      if (!Number.isInteger(item.quantidade) || item.quantidade <= 0) {
        return 'A quantidade deve ser um número inteiro maior que zero.';
      }
      if (!Number.isFinite(item.valorUnitario) || item.valorUnitario < 0) {
        return 'O valor unitário não pode ser negativo.';
      }
    }
    return '';
  }

  function salvar() {
    const itens: ItemPedido[] = linhas.map((linha) => ({
      produtoId: linha.produtoId,
      quantidade: paraNumero(linha.quantidade),
      valorUnitario: paraNumero(linha.valorUnitario),
    }));

    const mensagem = validar(itens);
    if (mensagem !== '') {
      setErro(mensagem);
      return;
    }

    aoCriar({
      mesa: mesa.trim(),
      atendenteId,
      cliente: cliente.trim(),
      observacoes: observacoes.trim(),
      itens,
    });
    reiniciar();
  }

  function cancelar() {
    reiniciar();
    aoCancelar();
  }

  return (
    <Modal visible={visivel} transparent animationType="fade" onRequestClose={cancelar}>
      <KeyboardAvoidingView
        style={estilos.fundo}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={estilos.dialogo}>
          <ScrollView contentContainerStyle={estilos.conteudo} keyboardShouldPersistTaps="handled">
            <Text style={estilos.titulo}>Novo pedido</Text>

            <Text style={estilos.rotulo}>Mesa</Text>
            <TextInput
              style={estilos.entrada}
              value={mesa}
              onChangeText={setMesa}
              placeholder="Ex: Mesa 5"
              placeholderTextColor={tema.textoSuave}
              maxLength={20}
            />

            <Text style={estilos.rotulo}>Atendente / Garçom</Text>
            <Seletor opcoes={opcoesAtendente} valor={atendenteId} aoMudar={setAtendenteId} />

            <Text style={estilos.rotulo}>Cliente</Text>
            <TextInput
              style={estilos.entrada}
              value={cliente}
              onChangeText={setCliente}
              placeholder="Nome do cliente"
              placeholderTextColor={tema.textoSuave}
              maxLength={120}
            />

            <Text style={estilos.rotulo}>Observações (opcional)</Text>
            <TextInput
              style={[estilos.entrada, estilos.entradaLonga]}
              value={observacoes}
              onChangeText={setObservacoes}
              multiline
              maxLength={500}
              placeholderTextColor={tema.textoSuave}
            />

            <View style={estilos.cabecalhoItens}>
              <Text style={estilos.rotuloItens}>Itens do pedido</Text>
              <Botao titulo="+ Item" variante="secundario" aoPressionar={adicionarLinha} />
            </View>

            {linhas.map((linha) => (
              <View key={linha.chave} style={estilos.linhaItem}>
                <Seletor
                  opcoes={opcoesProduto}
                  valor={linha.produtoId}
                  aoMudar={(produtoId) => trocarProduto(linha.chave, produtoId)}
                />
                <View style={estilos.camposItem}>
                  <TextInput
                    style={[estilos.entrada, estilos.entradaItem]}
                    value={linha.quantidade}
                    onChangeText={(texto) => atualizarLinha(linha.chave, { quantidade: texto })}
                    placeholder="Qtd."
                    placeholderTextColor={tema.textoSuave}
                    keyboardType="number-pad"
                  />
                  <TextInput
                    style={[estilos.entrada, estilos.entradaItem]}
                    value={linha.valorUnitario}
                    onChangeText={(texto) => atualizarLinha(linha.chave, { valorUnitario: texto })}
                    placeholder="Valor unit."
                    placeholderTextColor={tema.textoSuave}
                    keyboardType="decimal-pad"
                  />
                  <Pressable style={estilos.remover} onPress={() => removerLinha(linha.chave)}>
                    <Text style={estilos.textoRemover}>✕</Text>
                  </Pressable>
                </View>
              </View>
            ))}

            <Text style={estilos.total}>
              Total: <Text style={estilos.totalValor}>{formatarMoeda(total)}</Text>
            </Text>

            {erro !== '' && <Text style={estilos.erro}>{erro}</Text>}

            <View style={estilos.acoes}>
              <Botao titulo="Cancelar" variante="secundario" aoPressionar={cancelar} />
              <Botao titulo="Salvar pedido" aoPressionar={salvar} />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function criarEstilos(tema: Tema) {
  return StyleSheet.create({
    fundo: {
      flex: 1,
      backgroundColor: 'rgba(15, 23, 42, 0.55)',
      justifyContent: 'center',
      padding: 16,
    },
    dialogo: {
      maxHeight: '90%',
      backgroundColor: tema.superficie,
      borderRadius: 12,
      overflow: 'hidden',
    },
    conteudo: { padding: 24 },
    titulo: {
      fontFamily: fonte,
      fontSize: 18,
      fontWeight: '700',
      color: tema.texto,
      marginBottom: 4,
    },
    rotulo: {
      fontFamily: fonte,
      fontSize: 13,
      color: tema.textoSuave,
      marginTop: 14,
      marginBottom: 6,
    },
    entrada: {
      backgroundColor: tema.fundo,
      borderWidth: 1,
      borderColor: tema.borda,
      borderRadius: 8,
      paddingVertical: 9,
      paddingHorizontal: 12,
      fontFamily: fonte,
      fontSize: 14,
      color: tema.texto,
    },
    entradaLonga: { minHeight: 64, textAlignVertical: 'top' },
    cabecalhoItens: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 18,
      marginBottom: 8,
    },
    rotuloItens: { fontFamily: fonte, fontSize: 13, color: tema.textoSuave },
    linhaItem: {
      borderWidth: 1,
      borderColor: tema.borda,
      borderRadius: 8,
      padding: 10,
      marginBottom: 8,
      gap: 8,
    },
    camposItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    entradaItem: { flex: 1 },
    remover: { paddingVertical: 4, paddingHorizontal: 8 },
    textoRemover: { fontSize: 16, color: tema.perigo },
    total: {
      fontFamily: fonte,
      fontSize: 14,
      color: tema.texto,
      textAlign: 'right',
      marginTop: 8,
    },
    totalValor: { fontWeight: '700' },
    erro: {
      fontFamily: fonte,
      fontSize: 13,
      color: tema.perigo,
      backgroundColor: tema.perigoFundo,
      borderRadius: 8,
      paddingVertical: 8,
      paddingHorizontal: 12,
      marginTop: 14,
    },
    acoes: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      flexWrap: 'wrap',
      gap: 10,
      marginTop: 18,
    },
  });
}
