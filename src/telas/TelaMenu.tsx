import { useMemo } from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import { CartaoProduto } from '../componentes/CartaoProduto';
import { produtos } from '../types/dados/catalogo';
import { fonte, useTema } from '../types/tema';
import type { Tema } from '../types/tema';
import type { Produto } from '../types/produto';

const COLUNAS = 2;

type Linha = Produto[];

interface Secao {
  titulo: string;
  data: Linha[];
}

function montarSecoes(lista: Produto[]): Secao[] {
  const porCategoria = new Map<string, Produto[]>();
  for (const produto of lista) {
    const grupo = porCategoria.get(produto.categoria) ?? [];
    grupo.push(produto);
    porCategoria.set(produto.categoria, grupo);
  }

  return [...porCategoria].map(([titulo, itens]) => {
    const linhas: Linha[] = [];
    for (let i = 0; i < itens.length; i += COLUNAS) {
      linhas.push(itens.slice(i, i + COLUNAS));
    }
    return { titulo, data: linhas };
  });
}

export function TelaMenu() {
  const tema = useTema();
  const estilos = useMemo(() => criarEstilos(tema), [tema]);
  const secoes = useMemo(() => montarSecoes(produtos), []);

  return (
    <SectionList
      sections={secoes}
      keyExtractor={(linha) => linha.map((produto) => produto.id).join('-')}
      renderItem={({ item: linha }) => (
        <View style={estilos.linha}>
          {linha.map((produto) => (
            <CartaoProduto key={produto.id} produto={produto} />
          ))}
          {Array.from({ length: COLUNAS - linha.length }, (_, i) => (
            <View key={`vazio-${i}`} style={estilos.vazio} />
          ))}
        </View>
      )}
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
    linha: { flexDirection: 'row', gap: 12, marginBottom: 12 },
    vazio: { flex: 1 },
  });
}