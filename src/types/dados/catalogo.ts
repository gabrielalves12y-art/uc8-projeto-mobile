import type { Funcionario } from '../funcionario';
import type { Produto } from '../produto';

export const produtos: Produto[] = [
  { id: 1, nome: 'Café', categoria: 'Bebidas Quentes', valorUnitario: 2.5 },
  { id: 2, nome: 'Chá', categoria: 'Bebidas Quentes', valorUnitario: 2 },
  { id: 3, nome: 'Suco', categoria: 'Bebidas Frias', valorUnitario: 2.5 },
  { id: 4, nome: 'Refrigerante', categoria: 'Bebidas Frias', valorUnitario: 5 },
  { id: 5, nome: 'Água', categoria: 'Bebidas Frias', valorUnitario: 2 },
  { id: 6, nome: 'Sanduíche', categoria: 'Lanches', valorUnitario: 12 },
  { id: 7, nome: 'Coxinha', categoria: 'Lanches', valorUnitario: 3 },
  { id: 8, nome: 'Salsichão', categoria: 'Lanches', valorUnitario: 4 },
  { id: 9, nome: 'Hambúrguer', categoria: 'Lanches', valorUnitario: 5 },
  { id: 10, nome: 'Fatia de Bolo', categoria: 'Lanches', valorUnitario: 2 },
  { id: 11, nome: 'Torta', categoria: 'Lanches', valorUnitario: 3.5 },
  { id: 12, nome: 'Fatia de Pizza', categoria: 'Lanches', valorUnitario: 4 },
  { id: 13, nome: 'Salada', categoria: 'Lanches', valorUnitario: 6 },
];

export const funcionarios: Funcionario[] = [
  { id: 1, nome: 'João', cargo: 'Garcom' },
  { id: 2, nome: 'Maria', cargo: 'Atendente' },
  { id: 3, nome: 'Carlos', cargo: 'Gerente' },
  { id: 4, nome: 'Ana', cargo: 'Garcom' },
  { id: 5, nome: 'Pedro', cargo: 'Atendente' },
  { id: 6, nome: 'Fernanda', cargo: 'Gerente' },
  { id: 7, nome: 'Lucas', cargo: 'Garcom' },
  { id: 8, nome: 'Juliana', cargo: 'Atendente' },
  { id: 9, nome: 'Rafael', cargo: 'Garcom' },
  { id: 10, nome: 'Camila', cargo: 'Garcom' },
];

export function nomeDoProduto(id: Produto['id']): string {
  return produtos.find((produto) => produto.id === id)?.nome ?? 'Produto removido';
}

export function nomeDoFuncionario(id: Funcionario['id']): string {
  return funcionarios.find((funcionario) => funcionario.id === id)?.nome ?? 'Não informado';
}
