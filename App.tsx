import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { BarraAbas } from './src/componentes/BarraAbas';
import type { Aba } from './src/componentes/BarraAbas';
import { Botao } from './src/componentes/Botao';
import { TelaMenu } from './src/telas/TelaMenu';
import { TelaPedidos } from './src/telas/TelaPedidos';
import { TemaContext, fonte, temaClaro, temaEscuro } from './src/types/tema';
import type { Tema } from './src/types/tema';

export default function App() {
  const [escuro, setEscuro] = useState<boolean>(false);
  const [aba, setAba] = useState<Aba>('pedidos');

  const tema = escuro ? temaEscuro : temaClaro;
  const estilos = useMemo(() => criarEstilos(tema), [tema]);

  return (
    <SafeAreaProvider>
      <TemaContext.Provider value={tema}>
        <SafeAreaView style={estilos.tela}>
          <StatusBar style={escuro ? 'light' : 'dark'} />

          <View style={estilos.topo}>
            <Text style={estilos.titulo}>Menu de Hoje</Text>
            <Botao
              titulo={escuro ? '☀️' : '🌑'}
              variante="secundario"
              aoPressionar={() => setEscuro((atual) => !atual)}
            />
          </View>

          {/* As duas telas ficam montadas: trocar de aba não recarrega os pedidos. */}
          <View style={[estilos.conteudo, aba !== 'pedidos' && estilos.oculta]}>
            <TelaPedidos />
          </View>
          <View style={[estilos.conteudo, aba !== 'menu' && estilos.oculta]}>
            <TelaMenu />
          </View>

          <BarraAbas ativa={aba} aoMudar={setAba} />
        </SafeAreaView>
      </TemaContext.Provider>
    </SafeAreaProvider>
  );
}

function criarEstilos(tema: Tema) {
  return StyleSheet.create({
    tela: { flex: 1, backgroundColor: tema.fundo },
    topo: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 12,
    },
    titulo: {
      flex: 1,
      fontFamily: fonte,
      fontSize: 20,
      fontWeight: '700',
      color: tema.texto,
    },
    conteudo: { flex: 1 },
    oculta: { display: 'none' },
  });
}
