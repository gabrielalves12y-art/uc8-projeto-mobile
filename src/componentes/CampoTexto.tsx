import { useMemo, useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import type { TextInputProps } from 'react-native';
import { fonte, useTema } from '../types/tema';
import type { Tema } from '../types/tema';

export function CampoTexto({ style, onFocus, onBlur, ...resto }: TextInputProps) {
  const tema = useTema();
  const estilos = useMemo(() => criarEstilos(tema), [tema]);
  const [focado, setFocado] = useState<boolean>(false);

  return (
    <TextInput
      placeholderTextColor={tema.textoSuave}
      selectionColor={tema.primaria}
      {...resto}
      onFocus={(evento) => {
        setFocado(true);
        onFocus?.(evento);
      }}
      onBlur={(evento) => {
        setFocado(false);
        onBlur?.(evento);
      }}
      style={[estilos.campo, focado && estilos.focado, style]}
    />
  );
}

function criarEstilos(tema: Tema) {
  return StyleSheet.create({
    campo: {
      backgroundColor: tema.fundo,
      borderWidth: 1.5,
      borderColor: tema.borda,
      borderRadius: 12,
      paddingVertical: 11,
      paddingHorizontal: 14,
      fontFamily: fonte,
      fontSize: 14,
      color: tema.texto,
    },
    focado: {
      borderColor: tema.primaria,
      backgroundColor: tema.superficie,
    },
  });
}