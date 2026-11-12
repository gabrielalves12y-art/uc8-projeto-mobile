import { useMemo } from 'react';
import { SectionList, StyleSheet, Text } from 'react-native';
import { CartaoProduto } from '../componentes/CartaoProduto';
import { produtos } from '../types/dados/catalogo';
import { fonte, useTema } from '../types/tema';
import type { Tema } from '../types/tema';
import type { Produto } from '../types/produto';

interface Secao {
  titulo: string;
  data: Produto[];
}

function agruparPorCategoria(lista: Produto[]): Secao[] {
  const secoes: Secao[] = [];
  for (const produto of lista) {
    const existente = secoes.find((secao) => secao.titulo === produto.categoria);
    if (existente) {
      existente.data.push(produto);
    } else {
      secoes.push({ titulo: produto.categoria, data: [produto] });
    }
  }
  return secoes;
}

export function TelaMenu() {
  const tema = useTema();
  const estilos = useMemo(() => criarEstilos(tema), [tema]);
  const secoes = useMemo(() => agruparPorCategoria(produtos), []);

  return (
    <SectionList
      sections={secoes}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => <CartaoProduto produto={item} />}
      renderSectionHeader={({ section }) => <Text style={estilos.secao}>{section.titulo}</Text>}
      stickySectionHeadersEnabled={false}
      contentContainerStyle={estilos.conteudo}
    />
  );
}

function criarEstilos(tema: Tema) {
  return StyleSheet.create({
    conteudo: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 32 },
    secao: {
      fontFamily: fonte,
      fontSize: 12,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      color: tema.primaria,
      marginTop: 12,
      marginBottom: 8,
    },
  });
}
