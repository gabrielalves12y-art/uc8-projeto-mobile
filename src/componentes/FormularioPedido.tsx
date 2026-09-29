import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export interface DadosNovoPedido {
  mesa: string;
  cliente: string;
  observacoes: string;
}

interface FormularioPedidoProps {
  aoCriar: (dados: DadosNovoPedido) => void;
}

export function FormularioPedido({ aoCriar }: FormularioPedidoProps) {
  const [mesa, setMesa] = useState<string>('');
  const [cliente, setCliente] = useState<string>('');
  const [observacoes, setObservacoes] = useState<string>('');

  function enviar() {
    aoCriar({
      mesa: mesa.trim(),
      cliente: cliente.trim(),
      observacoes: observacoes.trim(),
    });
    setMesa('');
    setCliente('');
    setObservacoes('');
  }

  return (
    <View style={estilos.formulario}>
      <Text style={estilos.titulo}>Novo pedido</Text>

      <Text style={estilos.rotulo}>Mesa</Text>
      <TextInput
        style={estilos.campo}
        value={mesa}
        onChangeText={setMesa}
        placeholder="Ex.: 5"
        keyboardType="numeric"
      />

      <Text style={estilos.rotulo}>Cliente</Text>
      <TextInput
        style={estilos.campo}
        value={cliente}
        onChangeText={setCliente}
        placeholder="Nome do cliente"
      />

      <Text style={estilos.rotulo}>Observações</Text>
      <TextInput
        style={estilos.campo}
        value={observacoes}
        onChangeText={setObservacoes}
        placeholder="Opcional"
      />

      <Pressable style={estilos.botao} onPress={enviar}>
        <Text style={estilos.textoBotao}>Adicionar pedido</Text>
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  formulario: {
    marginBottom: 16,
  },
  titulo: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  rotulo: {
    fontSize: 14,
    color: '#374151',
    marginTop: 8,
    marginBottom: 4,
  },
  campo: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  botao: {
    backgroundColor: '#1d4ed8',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  textoBotao: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
