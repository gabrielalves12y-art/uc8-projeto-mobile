import { useMemo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { fonte, useTema } from '../types/tema';
import type { Tema } from '../types/tema';
import type { Produto } from '../types/produto';
import { formatarMoeda } from '../utils/pedidosrealizado';

interface CartaoProdutoProps {
  produto: Produto;
}

export function CartaoProduto({ produto }: CartaoProdutoProps) {
  const tema = useTema();
  const estilos = useMemo(() => criarEstilos(tema), [tema]);

  return (
    <View style={estilos.cartao}>
      {produto.foto !== undefined ? (
        <Image
          source={produto.foto}
          style={estilos.foto}
          resizeMode="cover"
          accessibilityLabel={`Foto de ${produto.nome}`}
        />
      ) : (
        <View style={[estilos.foto, estilos.fotoVazia]}>
          <Text style={estilos.emoji}>{produto.emoji}</Text>
        </View>
      )}

      <View style={estilos.corpo}>
        <View style={estilos.linhaTitulo}>
          <Text style={estilos.nome}>{produto.nome}</Text>
          <Text style={estilos.valor}>{formatarMoeda(produto.valorUnitario)}</Text>
        </View>
        <Text style={estilos.descricao}>{produto.descricao}</Text>
      </View>
    </View>
  );
}

function criarEstilos(tema: Tema) {
  return StyleSheet.create({
    cartao: {
      backgroundColor: tema.superficie,
      borderWidth: 1,
      borderColor: tema.borda,
      borderRadius: 10,
      overflow: 'hidden',
      marginBottom: 12,
    },
    foto: { width: '100%', height: 160 },
    fotoVazia: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: tema.primariaFundo,
    },
    emoji: { fontSize: 64 },
    corpo: { padding: 16, gap: 8 },
    linhaTitulo: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    },
    nome: { flex: 1, fontFamily: fonte, fontSize: 16, fontWeight: '700', color: tema.texto },
    valor: { fontFamily: fonte, fontSize: 16, fontWeight: '700', color: tema.primaria },
    descricao: { fontFamily: fonte, fontSize: 13, lineHeight: 19, color: tema.textoSuave },
  });
}
