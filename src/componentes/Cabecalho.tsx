import { useMemo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fonte, useTema } from '../types/tema';
import type { Tema } from '../types/tema';

interface CabecalhoProps {
  aoAlternarTema: () => void;
}

function dataDeHoje(): string {
  try {
    return new Date().toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  } catch {
    return new Date().toLocaleDateString();
  }
}

export function Cabecalho({ aoAlternarTema }: CabecalhoProps) {
  const tema = useTema();
  const estilos = useMemo(() => criarEstilos(tema), [tema]);
  const data = useMemo(dataDeHoje, []);

  return (
    <View style={estilos.cabecalho}>
      <Image
        source={require('../../assets/icon.png')}
        style={estilos.logo}
        accessibilityLabel="Logo do Menu de Hoje"
      />

      <View style={estilos.textos}>
        <Text style={estilos.data} numberOfLines={1}>
          {data}
        </Text>
        <Text style={estilos.titulo} numberOfLines={1}>
          Menu de Hoje
        </Text>
        <Text style={estilos.subtitulo} numberOfLines={1}>
          Pedidos e cardápio do dia
        </Text>
      </View>

      <Pressable
        onPress={aoAlternarTema}
        accessibilityRole="button"
        accessibilityLabel={tema.escuro ? 'Usar tema claro' : 'Usar tema escuro'}
        style={({ pressed }) => [estilos.botaoTema, pressed && estilos.pressionado]}
      >
        <Ionicons
          name={tema.escuro ? 'sunny-outline' : 'moon-outline'}
          size={20}
          color={tema.texto}
        />
      </Pressable>
    </View>
  );
}

function criarEstilos(tema: Tema) {
  return StyleSheet.create({
    cabecalho: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 14,
      marginBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: tema.borda,
    },
    logo: { width: 52, height: 52, borderRadius: 13 },
    textos: { flex: 1, gap: 1 },
    data: {
      fontFamily: fonte,
      fontSize: 11,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      color: tema.primaria,
    },
    titulo: { fontFamily: fonte, fontSize: 20, fontWeight: '700', color: tema.texto },
    subtitulo: { fontFamily: fonte, fontSize: 12, color: tema.textoSuave },
    botaoTema: {
      width: 40,
      height: 40,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: tema.superficie,
      borderWidth: 1,
      borderColor: tema.borda,
    },
    pressionado: { opacity: 0.8 },
  });
}
