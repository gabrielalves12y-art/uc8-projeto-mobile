import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { fonte, useTema } from '../types/tema';
import type { Tema } from '../types/tema';

export type Aba = 'pedidos' | 'menu';

const ABAS: { chave: Aba; titulo: string; icone: string }[] = [
  { chave: 'pedidos', titulo: 'Pedidos', icone: '🧾' },
  { chave: 'menu', titulo: 'Menu', icone: '🍽️' },
];

interface BarraAbasProps {
  ativa: Aba;
  aoMudar: (aba: Aba) => void;
}

export function BarraAbas({ ativa, aoMudar }: BarraAbasProps) {
  const tema = useTema();
  const estilos = useMemo(() => criarEstilos(tema), [tema]);

  return (
    <View style={estilos.barra} accessibilityRole="tablist">
      {ABAS.map((aba) => {
        const selecionada = aba.chave === ativa;
        return (
          <Pressable
            key={aba.chave}
            onPress={() => aoMudar(aba.chave)}
            accessibilityRole="tab"
            accessibilityState={{ selected: selecionada }}
            style={({ pressed }) => [estilos.aba, pressed && estilos.pressionada]}
          >
            <View style={[estilos.indicador, selecionada && estilos.indicadorAtivo]} />
            <Text style={[estilos.icone, !selecionada && estilos.iconeInativo]}>{aba.icone}</Text>
            <Text style={[estilos.titulo, selecionada && estilos.tituloAtivo]}>{aba.titulo}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function criarEstilos(tema: Tema) {
  return StyleSheet.create({
    barra: {
      flexDirection: 'row',
      backgroundColor: tema.superficie,
      borderTopWidth: 1,
      borderTopColor: tema.borda,
    },
    aba: { flex: 1, alignItems: 'center', paddingBottom: 8 },
    pressionada: { opacity: 0.7 },
    indicador: { height: 3, alignSelf: 'stretch', backgroundColor: 'transparent', marginBottom: 6 },
    indicadorAtivo: { backgroundColor: tema.primaria },
    icone: { fontSize: 20 },
    iconeInativo: { opacity: 0.55 },
    titulo: { fontFamily: fonte, fontSize: 12, fontWeight: '600', color: tema.textoSuave, marginTop: 2 },
    tituloAtivo: { color: tema.primaria },
  });
}
