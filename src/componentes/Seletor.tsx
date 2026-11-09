import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { fonte, useTema } from '../types/tema';
import type { Tema } from '../types/tema';

export interface OpcaoSeletor {
  valor: number;
  rotulo: string;
  // Texto secundário à direita (ex.: preço ou cargo).
  detalhe?: string;
  // Cor da bolinha que identifica a opção (ex.: categoria).
  cor?: string;
}

interface SeletorProps {
  opcoes: OpcaoSeletor[];
  valor: number;
  aoMudar: (valor: number) => void;
}

export function Seletor({ opcoes, valor, aoMudar }: SeletorProps) {
  const tema = useTema();
  const estilos = useMemo(() => criarEstilos(tema), [tema]);
  const [aberto, setAberto] = useState<boolean>(false);

  const selecionada = opcoes.find((opcao) => opcao.valor === valor);

  function escolher(novoValor: number) {
    aoMudar(novoValor);
    setAberto(false);
  }

  return (
    <View>
      <Pressable
        style={[estilos.campo, aberto && estilos.campoAberto]}
        onPress={() => setAberto((atual) => !atual)}
      >
        <View style={[estilos.bolinha, { backgroundColor: selecionada?.cor ?? tema.borda }]} />
        <Text style={estilos.textoCampo} numberOfLines={1}>
          {selecionada ? selecionada.rotulo : 'Selecione'}
        </Text>
        {selecionada?.detalhe !== undefined && (
          <Text style={estilos.detalheCampo}>{selecionada.detalhe}</Text>
        )}
        <Text style={[estilos.seta, aberto && estilos.setaAberta]}>▾</Text>
      </Pressable>

      {aberto && (
        <View style={estilos.lista}>
          <ScrollView nestedScrollEnabled style={estilos.rolagem}>
            {opcoes.map((opcao) => {
              const ativa = opcao.valor === valor;
              return (
                <Pressable
                  key={opcao.valor}
                  style={({ pressed }) => [
                    estilos.opcao,
                    ativa && estilos.opcaoAtiva,
                    pressed && !ativa && estilos.opcaoPressionada,
                  ]}
                  onPress={() => escolher(opcao.valor)}
                >
                  <View
                    style={[estilos.bolinha, { backgroundColor: opcao.cor ?? tema.borda }]}
                  />
                  <Text
                    style={[estilos.textoOpcao, ativa && estilos.textoOpcaoAtiva]}
                    numberOfLines={1}
                  >
                    {opcao.rotulo}
                  </Text>
                  {opcao.detalhe !== undefined && (
                    <Text style={estilos.detalheOpcao}>{opcao.detalhe}</Text>
                  )}
                  {ativa && <Text style={estilos.check}>✓</Text>}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

function criarEstilos(tema: Tema) {
  return StyleSheet.create({
    campo: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: tema.fundo,
      borderWidth: 1.5,
      borderColor: tema.borda,
      borderRadius: 12,
      paddingVertical: 11,
      paddingHorizontal: 14,
      gap: 10,
    },
    campoAberto: { borderColor: tema.primaria, backgroundColor: tema.superficie },
    bolinha: { width: 10, height: 10, borderRadius: 5 },
    textoCampo: { flex: 1, fontFamily: fonte, fontSize: 14, color: tema.texto },
    detalheCampo: { fontFamily: fonte, fontSize: 12, color: tema.textoSuave },
    seta: { fontFamily: fonte, fontSize: 14, color: tema.textoSuave },
    setaAberta: { color: tema.primaria, transform: [{ rotate: '180deg' }] },
    lista: {
      backgroundColor: tema.superficie,
      borderWidth: 1.5,
      borderColor: tema.borda,
      borderRadius: 12,
      marginTop: 6,
      overflow: 'hidden',
    },
    rolagem: { maxHeight: 200 },
    opcao: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingVertical: 11,
      paddingHorizontal: 14,
    },
    opcaoAtiva: { backgroundColor: tema.primariaFundo },
    opcaoPressionada: { backgroundColor: tema.fundo },
    textoOpcao: { flex: 1, fontFamily: fonte, fontSize: 14, color: tema.texto },
    textoOpcaoAtiva: { fontWeight: '700' },
    detalheOpcao: { fontFamily: fonte, fontSize: 12, color: tema.textoSuave },
    check: { fontFamily: fonte, fontSize: 14, fontWeight: '700', color: tema.primaria },
  });
}