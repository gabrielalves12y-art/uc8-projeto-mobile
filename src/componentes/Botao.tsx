import { useMemo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { fonte, useTema } from '../types/tema';
import type { Tema } from '../types/tema';

type VarianteBotao = 'primario' | 'secundario' | 'perigo';

interface BotaoProps {
  titulo: string;
  aoPressionar: () => void;
  variante?: VarianteBotao;
}

export function Botao({ titulo, aoPressionar, variante = 'primario' }: BotaoProps) {
  const tema = useTema();
  const estilos = useMemo(() => criarEstilos(tema), [tema]);

  const estiloBotao = {
    primario: estilos.primario,
    secundario: estilos.secundario,
    perigo: estilos.perigo,
  }[variante];
  const estiloTexto = {
    primario: estilos.textoPrimario,
    secundario: estilos.textoSecundario,
    perigo: estilos.textoPerigo,
  }[variante];

  return (
    <Pressable
      onPress={aoPressionar}
      style={({ pressed }) => [estilos.base, estiloBotao, pressed && estilos.pressionado]}
    >
      <Text style={[estilos.texto, estiloTexto]}>{titulo}</Text>
    </Pressable>
  );
}

function criarEstilos(tema: Tema) {
  return StyleSheet.create({
    base: {
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    pressionado: { opacity: 0.8 },
    primario: { backgroundColor: tema.primaria },
    secundario: {
      backgroundColor: tema.superficie,
      borderWidth: 1,
      borderColor: tema.borda,
    },
    perigo: { backgroundColor: tema.perigoFundo },
    texto: { fontFamily: fonte, fontSize: 14, fontWeight: '600' },
    textoPrimario: { color: '#ffffff' },
    textoSecundario: { color: tema.texto },
    textoPerigo: { color: tema.perigo },
  });
}
