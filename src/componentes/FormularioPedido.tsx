import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { funcionarios, produtos } from '../types/dados/catalogo';
import { fonte, useTema } from '../types/tema';
import type { Tema } from '../types/tema';
import type { ItemPedido, NovoPedido } from '../types/pedido';
import { formatarMoeda } from '../utils/pedidosrealizado';
import { Botao } from './Botao';
import { CampoTexto } from './CampoTexto';
import { Seletor } from './Seletor';
import type { OpcaoSeletor } from './Seletor';

interface FormularioPedidoProps {
  visivel: boolean;
  aoCriar: (dados: NovoPedido) => Promise<string>;
  aoCancelar: () => void;
}

interface LinhaItem {
  chave: number;
  produtoId: number;
  quantidade: string;
}

function corCategoria(tema: Tema, categoria: string): string {
  if (categoria === 'Bebidas Quentes') return tema.status.pendente.cor;
  if (categoria === 'Bebidas Frias') return tema.status.em_andamento.cor;
  return tema.primaria;
}

function corCargo(tema: Tema, cargo: string): string {
  if (cargo === 'Garcom') return tema.status.concluido.cor;
  if (cargo === 'Atendente') return tema.status.em_andamento.cor;
  if (cargo === 'Gerente') return tema.status.pendente.cor;
  return tema.textoSuave;
}

function novaLinha(chave: number): LinhaItem {
  const primeiro = produtos[0];
  return {
    chave,
    produtoId: primeiro.id,
    quantidade: '1',
  };
}

function paraNumero(texto: string): number {
  return Number(texto.trim().replace(',', '.'));
}

function precoDe(produtoId: number): number {
  return produtos.find((produto) => produto.id === produtoId)?.valorUnitario ?? 0;
}

interface SecaoProps {
  icone: string;
  titulo: string;
  cor: string;
  acao?: ReactNode;
  children: ReactNode;
}

function Secao({ icone, titulo, cor, acao, children }: SecaoProps) {
  const tema = useTema();
  const estilos = useMemo(() => criarEstilosSecao(tema), [tema]);

  return (
    <View style={estilos.secao}>
      <View style={estilos.cabecalho}>
        <View style={[estilos.icone, { backgroundColor: `${cor}26`, borderColor: `${cor}55` }]}>
          <Text style={estilos.emoji}>{icone}</Text>
        </View>
        <Text style={estilos.titulo}>{titulo}</Text>
        {acao}
      </View>
      {children}
    </View>
  );
}

export function FormularioPedido({ visivel, aoCriar, aoCancelar }: FormularioPedidoProps) {
  const tema = useTema();
  const estilos = useMemo(() => criarEstilos(tema), [tema]);

  const opcoesAtendente = useMemo<OpcaoSeletor[]>(
    () =>
      funcionarios.map((funcionario) => ({
        valor: funcionario.id,
        rotulo: funcionario.nome,
        detalhe: funcionario.cargo,
        cor: corCargo(tema, funcionario.cargo),
      })),
    [tema],
  );

  const opcoesProduto = useMemo<OpcaoSeletor[]>(
    () =>
      produtos.map((produto) => ({
        valor: produto.id,
        rotulo: produto.nome,
        detalhe: formatarMoeda(produto.valorUnitario),
        cor: corCategoria(tema, produto.categoria),
      })),
    [tema],
  );

  const [mesa, setMesa] = useState<string>('');
  const [atendenteId, setAtendenteId] = useState<number>(funcionarios[0].id);
  const [cliente, setCliente] = useState<string>('');
  const [observacoes, setObservacoes] = useState<string>('');
  const [linhas, setLinhas] = useState<LinhaItem[]>([]);
  const [erro, setErro] = useState<string>('');
  const [salvando, setSalvando] = useState<boolean>(false);

  const total = linhas.reduce((soma, linha) => {
    const quantidade = paraNumero(linha.quantidade) || 0;
    return soma + quantidade * precoDe(linha.produtoId);
  }, 0);

  const unidades = linhas.reduce((soma, linha) => {
    const quantidade = paraNumero(linha.quantidade);
    return soma + (Number.isFinite(quantidade) && quantidade > 0 ? quantidade : 0);
  }, 0);

  function atualizarLinha(chave: number, mudancas: Partial<LinhaItem>) {
    setLinhas((atual) =>
      atual.map((linha) => (linha.chave === chave ? { ...linha, ...mudancas } : linha)),
    );
  }

  function trocarProduto(chave: number, produtoId: number) {
    atualizarLinha(chave, { produtoId });
  }

  function adicionarLinha() {
    setLinhas((atual) => [
      ...atual,
      novaLinha(atual.length === 0 ? 1 : Math.max(...atual.map((l) => l.chave)) + 1),
    ]);
  }

  function removerLinha(chave: number) {
    setLinhas((atual) => atual.filter((l) => l.chave !== chave));
  }

  function reiniciar() {
    setMesa('');
    setAtendenteId(funcionarios[0].id);
    setCliente('');
    setObservacoes('');
    setLinhas([]);
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

  async function salvar() {
    if (salvando) return;

    const itens: ItemPedido[] = linhas.map((linha) => ({
      produtoId: linha.produtoId,
      quantidade: paraNumero(linha.quantidade),
      valorUnitario: precoDe(linha.produtoId),
    }));

    const mensagem = validar(itens);
    if (mensagem !== '') {
      setErro(mensagem);
      return;
    }

    setSalvando(true);
    const falha = await aoCriar({
      mesa: mesa.trim(),
      atendenteId,
      cliente: cliente.trim(),
      observacoes: observacoes.trim(),
      itens,
    });
    setSalvando(false);

    if (falha !== '') {
      setErro(falha);
      return;
    }
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
          <View style={estilos.cabecalho}>
            <View style={estilos.circuloGrande} />
            <View style={estilos.circuloPequeno} />
            <View style={estilos.cabecalhoLinha}>
              <View style={estilos.iconeCabecalho}>
                <Text style={estilos.emojiCabecalho}>🍽️</Text>
              </View>
              <View style={estilos.cabecalhoTextos}>
                <Text style={estilos.titulo}>Novo pedido</Text>
                <Text style={estilos.subtitulo}>Registre o atendimento da mesa</Text>
              </View>
              <Pressable style={estilos.fechar} onPress={cancelar} hitSlop={8}>
                <Text style={estilos.textoFechar}>✕</Text>
              </Pressable>
            </View>
          </View>

          <ScrollView
            style={estilos.rolagem}
            contentContainerStyle={estilos.conteudo}
            keyboardShouldPersistTaps="handled"
          >
            <Secao icone="🧾" titulo="Atendimento" cor={tema.status.em_andamento.cor}>
              <View style={estilos.linhaCampos}>
                <View style={estilos.colunaMesa}>
                  <Text style={estilos.rotulo}>Mesa</Text>
                  <CampoTexto
                    value={mesa}
                    onChangeText={setMesa}
                    placeholder="Ex: 5"
                    maxLength={20}
                  />
                </View>
                <View style={estilos.colunaCliente}>
                  <Text style={estilos.rotulo}>Cliente</Text>
                  <CampoTexto
                    value={cliente}
                    onChangeText={setCliente}
                    placeholder="Nome do cliente"
                    maxLength={120}
                  />
                </View>
              </View>

              <Text style={estilos.rotulo}>Atendente / Garçom</Text>
              <Seletor opcoes={opcoesAtendente} valor={atendenteId} aoMudar={setAtendenteId} />
            </Secao>

            <Secao
              icone="🥪"
              titulo="Itens do pedido"
              cor={tema.status.pendente.cor}
              acao={
                <Pressable
                  style={({ pressed }) => [estilos.botaoItem, pressed && estilos.pressionado]}
                  onPress={adicionarLinha}
                >
                  <Text style={estilos.textoBotaoItem}>
                    <Text style={estilos.maisBotaoItem}>＋ </Text>Item
                  </Text>
                </Pressable>
              }
            >
              {linhas.length === 0 && (
                <View style={estilos.vazio}>
                  <Text style={estilos.tituloVazio}>Nenhum item adicionado</Text>
                  <Text style={estilos.textoVazio}>Toque em ＋ Item para começar o pedido.</Text>
                </View>
              )}

              {linhas.map((linha, indice) => {
                const produto = produtos.find((item) => item.id === linha.produtoId);
                const cor = corCategoria(tema, produto?.categoria ?? '');
                const preco = precoDe(linha.produtoId);
                const subtotal = (paraNumero(linha.quantidade) || 0) * preco;

                return (
                  <View key={linha.chave} style={[estilos.cartaoItem, { borderLeftColor: cor }]}>
                    <View style={estilos.topoItem}>
                      <View style={[estilos.numero, { backgroundColor: `${cor}26` }]}>
                        <Text style={[estilos.textoNumero, { color: cor }]}>{indice + 1}</Text>
                      </View>
                      {produto !== undefined && (
                        <View style={[estilos.chip, { backgroundColor: `${cor}26` }]}>
                          <Text style={[estilos.textoChip, { color: cor }]}>
                            {produto.categoria}
                          </Text>
                        </View>
                      )}
                      <View style={estilos.espaco} />
                      <Pressable
                        style={estilos.remover}
                        onPress={() => removerLinha(linha.chave)}
                        hitSlop={6}
                      >
                        <Text style={estilos.textoRemover}>✕</Text>
                      </Pressable>
                    </View>

                    <Seletor
                      opcoes={opcoesProduto}
                      valor={linha.produtoId}
                      aoMudar={(produtoId) => trocarProduto(linha.chave, produtoId)}
                    />

                    <View style={estilos.camposItem}>
                      <View style={estilos.colunaQtd}>
                        <Text style={estilos.rotuloMini}>Qtd.</Text>
                        <CampoTexto
                          value={linha.quantidade}
                          onChangeText={(texto) => atualizarLinha(linha.chave, { quantidade: texto })}
                          placeholder="1"
                          keyboardType="number-pad"
                        />
                      </View>
                      <View style={estilos.colunaValor}>
                        <Text style={estilos.rotuloMini}>Valor unit.</Text>
                        <Text style={estilos.valorFixo}>{formatarMoeda(preco)}</Text>
                      </View>
                      <View style={estilos.colunaSubtotal}>
                        <Text style={estilos.rotuloMini}>Subtotal</Text>
                        <Text style={[estilos.subtotal, { color: cor }]} numberOfLines={1}>
                          {formatarMoeda(subtotal)}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </Secao>

            <Secao icone="📝" titulo="Observações" cor={tema.status.concluido.cor}>
              <CampoTexto
                style={estilos.entradaLonga}
                value={observacoes}
                onChangeText={setObservacoes}
                placeholder="Opcional: sem cebola, ponto da carne…"
                multiline
                maxLength={500}
              />
            </Secao>
          </ScrollView>

          <View style={estilos.rodape}>
            {erro !== '' && (
              <View style={estilos.erro}>
                <Text style={estilos.iconeErro}>⚠️</Text>
                <Text style={estilos.textoErro}>{erro}</Text>
              </View>
            )}

            <View style={estilos.resumo}>
              <View>
                <Text style={estilos.rotuloResumo}>Total do pedido</Text>
                <Text style={estilos.detalheResumo}>
                  {unidades} {unidades === 1 ? 'unidade' : 'unidades'} · {linhas.length}{' '}
                  {linhas.length === 1 ? 'item' : 'itens'}
                </Text>
              </View>
              <Text style={estilos.valorResumo}>{formatarMoeda(total)}</Text>
            </View>

            <View style={estilos.acoes}>
              <View style={estilos.acaoCancelar}>
                <Botao titulo="Cancelar" variante="secundario" aoPressionar={cancelar} />
              </View>
              <View style={estilos.acaoSalvar}>
                <Botao
                  titulo={salvando ? 'Salvando…' : 'Salvar pedido'}
                  aoPressionar={salvar}
                />
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function criarEstilosSecao(tema: Tema) {
  return StyleSheet.create({
    secao: {
      backgroundColor: tema.superficie,
      borderWidth: 1,
      borderColor: tema.borda,
      borderRadius: 16,
      padding: 14,
      marginBottom: 14,
    },
    cabecalho: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 },
    icone: {
      width: 32,
      height: 32,
      borderRadius: 10,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emoji: { fontSize: 16 },
    titulo: {
      flex: 1,
      fontFamily: fonte,
      fontSize: 15,
      fontWeight: '700',
      color: tema.texto,
    },
  });
}

function criarEstilos(tema: Tema) {
  return StyleSheet.create({
    fundo: {
      flex: 1,
      backgroundColor: tema.escuro ? 'rgba(0, 0, 0, 0.7)' : 'rgba(43, 26, 15, 0.55)',
      justifyContent: 'center',
      padding: 16,
    },
    dialogo: {
      maxHeight: '92%',
      backgroundColor: tema.fundo,
      borderRadius: 24,
      overflow: 'hidden',
      borderWidth: tema.escuro ? 1 : 0,
      borderColor: tema.borda,
      shadowColor: '#000000',
      shadowOpacity: 0.25,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 12 },
      elevation: 16,
    },

    cabecalho: {
      backgroundColor: tema.primaria,
      paddingHorizontal: 20,
      paddingVertical: 18,
      overflow: 'hidden',
    },
    circuloGrande: {
      position: 'absolute',
      top: -50,
      right: -30,
      width: 150,
      height: 150,
      borderRadius: 75,
      backgroundColor: 'rgba(255, 255, 255, 0.10)',
    },
    circuloPequeno: {
      position: 'absolute',
      bottom: -40,
      left: 90,
      width: 90,
      height: 90,
      borderRadius: 45,
      backgroundColor: 'rgba(255, 255, 255, 0.07)',
    },
    cabecalhoLinha: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    iconeCabecalho: {
      width: 46,
      height: 46,
      borderRadius: 15,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    emojiCabecalho: { fontSize: 24 },
    cabecalhoTextos: { flex: 1 },
    titulo: {
      fontFamily: fonte,
      fontSize: 19,
      fontWeight: '800',
      color: '#ffffff',
    },
    subtitulo: {
      fontFamily: fonte,
      fontSize: 12,
      color: 'rgba(255, 255, 255, 0.85)',
      marginTop: 2,
    },
    fechar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    textoFechar: { fontFamily: fonte, fontSize: 14, fontWeight: '700', color: '#ffffff' },

    rolagem: { flexShrink: 1 },
    conteudo: { padding: 16, paddingBottom: 4 },
    rotulo: {
      fontFamily: fonte,
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 0.8,
      textTransform: 'uppercase',
      color: tema.textoSuave,
      marginTop: 12,
      marginBottom: 6,
    },
    rotuloMini: {
      fontFamily: fonte,
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 0.6,
      textTransform: 'uppercase',
      color: tema.textoSuave,
      marginBottom: 6,
    },
    linhaCampos: { flexDirection: 'row', gap: 10 },
    colunaMesa: { flex: 1 },
    colunaCliente: { flex: 2 },
    entradaLonga: { minHeight: 76, textAlignVertical: 'top', marginTop: 10 },

    botaoItem: {
      backgroundColor: tema.primariaFundo,
      borderWidth: 1.5,
      borderColor: tema.primaria,
      borderRadius: 999,
      paddingVertical: 6,
      paddingHorizontal: 12,
    },
    pressionado: { opacity: 0.75 },
    textoBotaoItem: { fontFamily: fonte, fontSize: 13, fontWeight: '700', color: tema.texto },
    maisBotaoItem: { color: tema.primaria },
    cartaoItem: {
      backgroundColor: tema.fundo,
      borderWidth: 1,
      borderColor: tema.borda,
      borderLeftWidth: 5,
      borderRadius: 14,
      padding: 12,
      marginTop: 10,
      gap: 10,
    },
    topoItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    numero: {
      width: 26,
      height: 26,
      borderRadius: 13,
      alignItems: 'center',
      justifyContent: 'center',
    },
    textoNumero: { fontFamily: fonte, fontSize: 13, fontWeight: '800' },
    chip: { borderRadius: 999, paddingVertical: 3, paddingHorizontal: 10 },
    textoChip: { fontFamily: fonte, fontSize: 11, fontWeight: '700' },
    espaco: { flex: 1 },
    remover: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: tema.perigoFundo,
      alignItems: 'center',
      justifyContent: 'center',
    },
    vazio: {
      alignItems: 'center',
      borderWidth: 1.5,
      borderStyle: 'dashed',
      borderColor: tema.borda,
      borderRadius: 14,
      paddingVertical: 18,
      paddingHorizontal: 14,
      marginTop: 10,
      gap: 4,
    },
    tituloVazio: { fontFamily: fonte, fontSize: 14, fontWeight: '700', color: tema.texto },
    textoVazio: { fontFamily: fonte, fontSize: 12, color: tema.textoSuave, textAlign: 'center' },
    textoRemover: { fontFamily: fonte, fontSize: 12, fontWeight: '700', color: tema.perigo },
    camposItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
    colunaQtd: { flex: 1 },
    colunaValor: { flex: 1.5 },
    colunaSubtotal: { flex: 1.5, alignItems: 'flex-end' },
    valorFixo: {
      fontFamily: fonte,
      fontSize: 14,
      color: tema.textoSuave,
      paddingTop: 11,
    },
    subtotal: {
      fontFamily: fonte,
      fontSize: 15,
      fontWeight: '800',
      paddingTop: 11,
    },

    rodape: {
      backgroundColor: tema.superficie,
      borderTopWidth: 1,
      borderTopColor: tema.borda,
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 16,
      gap: 10,
    },
    erro: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: tema.perigoFundo,
      borderRadius: 12,
      paddingVertical: 9,
      paddingHorizontal: 12,
    },
    iconeErro: { fontSize: 14 },
    textoErro: { flex: 1, fontFamily: fonte, fontSize: 13, color: tema.perigo },
    resumo: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: tema.primariaFundo,
      borderLeftWidth: 5,
      borderLeftColor: tema.primaria,
      borderRadius: 14,
      paddingVertical: 10,
      paddingHorizontal: 14,
    },
    rotuloResumo: {
      fontFamily: fonte,
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 0.8,
      textTransform: 'uppercase',
      color: tema.textoSuave,
    },
    detalheResumo: { fontFamily: fonte, fontSize: 12, color: tema.textoSuave, marginTop: 2 },
    valorResumo: { fontFamily: fonte, fontSize: 22, fontWeight: '800', color: tema.texto },
    acoes: { flexDirection: 'row', gap: 10 },
    acaoCancelar: { flex: 1 },
    acaoSalvar: { flex: 1.4 },
  });
}