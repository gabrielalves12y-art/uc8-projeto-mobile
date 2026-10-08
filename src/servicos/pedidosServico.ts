import { Platform } from 'react-native';
import type { NovoPedido, Pedido } from '../types/pedido';

const PORTA_API = 3000;

function obterUrlApi(): string {
  if (Platform.OS === 'web') {
    const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    return process.env.EXPO_PUBLIC_API_URL_WEB ?? `http://${host}:${PORTA_API}`;
  }
  return (
    process.env.EXPO_PUBLIC_API_URL ??
    (Platform.OS === 'android'
      ? `http://10.0.2.2:${PORTA_API}`
      : `http://localhost:${PORTA_API}`)
  );
}

const URL_API: string = obterUrlApi();

async function chamarApi(caminho: string, opcoes?: RequestInit): Promise<Response> {
  try {
    return await fetch(`${URL_API}${caminho}`, opcoes);
  } catch {
    throw new Error('Não foi possível conectar à API. Verifique se ela está no ar.');
  }
}

async function lerErro(resposta: Response, padrao: string): Promise<string> {
  try {
    const corpo = (await resposta.json()) as { erro?: string };
    return corpo.erro ?? padrao;
  } catch {
    return padrao;
  }
}

export async function buscarPedidos(): Promise<Pedido[]> {
  const resposta = await chamarApi('/pedidos');
  if (!resposta.ok) {
    throw new Error(await lerErro(resposta, 'Falha ao ler os pedidos.'));
  }
  return (await resposta.json()) as Pedido[];
}

export async function salvarPedido(dados: NovoPedido): Promise<void> {
  const resposta = await chamarApi('/pedidos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  if (!resposta.ok) {
    throw new Error(await lerErro(resposta, 'Falha ao salvar o pedido.'));
  }
}

