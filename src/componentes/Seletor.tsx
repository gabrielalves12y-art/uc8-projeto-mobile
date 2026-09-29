import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { fonte, useTema } from '../types/tema';
import type { Tema } from '../types/tema';

export interface OpcaoSeletor {
  valor: number;
  rotulo: string;
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
      <Pressable style={estilos.campo} onPress={() => setAberto((atual) => !atual)}>
        <Text style={estilos.textoCampo} numberOfLines={1}>
          {selecionada ? selecionada.rotulo : 'Selecione'}
        </Text>
        <Text style={estilos.seta}>{aberto ? '▴' : '▾'}</Text>
      </Pressable>

      {aberto && (
        <View style={estilos.lista}>
          <ScrollView nestedScrollEnabled style={estilos.rolagem}>
            {opcoes.map((opcao) => (
              <Pressable
                key={opcao.valor}
                style={[estilos.opcao, opcao.valor === valor && estilos.opcaoAtiva]}
                onPress={() => escolher(opcao.valor)}
              >
                <Text style={estilos.textoOpcao}>{opcao.rotulo}</Text>
              </Pressable>
            ))}
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
      justifyContent: 'space-between',
      backgroundColor: tema.fundo,
      borderWidth: 1,
      borderColor: tema.borda,
      borderRadius: 8,
      paddingVertical: 9,
      paddingHorizontal: 12,
    },
    textoCampo: { flex: 1, fontFamily: fonte, fontSize: 14, color: tema.texto },
    seta: { fontSize: 14, color: tema.textoSuave, marginLeft: 8 },
    lista: {
      backgroundColor: tema.superficie,
      borderWidth: 1,
      borderColor: tema.borda,
      borderRadius: 8,
      marginTop: 4,
      overflow: 'hidden',
    },
    rolagem: { maxHeight: 180 },
    opcao: { paddingVertical: 10, paddingHorizontal: 12 },
    opcaoAtiva: { backgroundColor: tema.fundo },
    textoOpcao: { fontFamily: fonte, fontSize: 14, color: tema.texto },
  });
}
