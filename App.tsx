import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { BarraAbas } from './src/componentes/BarraAbas';
import type { Aba } from './src/componentes/BarraAbas';
import { Cabecalho } from './src/componentes/Cabecalho';
import { TelaMenu } from './src/telas/TelaMenu';
import { TelaPedidos } from './src/telas/TelaPedidos';
import { TemaContext, temaClaro, temaEscuro } from './src/types/tema';
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

          <Cabecalho aoAlternarTema={() => setEscuro((atual) => !atual)} />

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
    conteudo: { flex: 1 },
    oculta: { display: 'none' },
  });
}