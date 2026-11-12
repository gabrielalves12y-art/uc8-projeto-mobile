import type { Funcionario } from '../funcionario';
import type { Produto } from '../produto';

export const produtos: Produto[] = [
  {
    id: 1,
    nome: 'Café',
    categoria: 'Bebidas Quentes',
    valorUnitario: 2.5,
    emoji: '☕',
    descricao:
      'Café coado na hora, de torra média, encorpado e aromático. Servido quente em xícara de 150 ml, com açúcar ou adoçante à parte.',
  },
  {
    id: 2,
    nome: 'Chá',
    categoria: 'Bebidas Quentes',
    valorUnitario: 2,
    emoji: '🍵',
    descricao:
      'Infusão quente de ervas, à escolha entre camomila, hortelã e erva-doce. Servido em xícara de 200 ml, suave e sem conservantes.',
  },
  {
    id: 3,
    nome: 'Suco',
    categoria: 'Bebidas Frias',
    valorUnitario: 2.5,
    emoji: '🧃',
    descricao:
      'Suco natural preparado na hora com a fruta do dia, sem conservantes. Copo de 300 ml, com opção de açúcar ou adoçante.',
  },
  {
    id: 4,
    nome: 'Refrigerante',
    categoria: 'Bebidas Frias',
    valorUnitario: 5,
    emoji: '🥤',
    descricao:
      'Lata de 350 ml bem gelada, nos sabores cola, guaraná ou laranja, conforme a disponibilidade do dia.',
  },
  {
    id: 5,
    nome: 'Água',
    categoria: 'Bebidas Frias',
    valorUnitario: 2,
    emoji: '💧',
    descricao: 'Garrafa de 500 ml de água mineral, com ou sem gás, servida gelada ou natural.',
  },
  {
    id: 6,
    nome: 'Sanduíche',
    categoria: 'Lanches',
    valorUnitario: 12,
    emoji: '🥪',
    descricao:
      'Pão fresco recheado com presunto, queijo, alface e tomate, com maionese da casa. Prensado na chapa, quente e crocante por fora.',
  },
  {
    id: 7,
    nome: 'Coxinha',
    categoria: 'Lanches',
    valorUnitario: 3,
    emoji: '🍗',
    descricao:
      'Massa macia e dourada, recheada com frango desfiado bem temperado. Frita na hora, crocante por fora e cremosa por dentro.',
  },
  {
    id: 8,
    nome: 'Salsichão',
    categoria: 'Lanches',
    valorUnitario: 4,
    emoji: '🌭',
    descricao:
      'Salsichão assado no pão, com molho da casa e vinagrete. Lanche rápido e bem servido, ideal para matar a fome.',
  },
  {
    id: 9,
    nome: 'Hambúrguer',
    categoria: 'Lanches',
    valorUnitario: 5,
    emoji: '🍔',
    descricao:
      'Pão macio com hambúrguer bovino grelhado de 90 g, queijo derretido, alface e tomate. Servido quente.',
  },
  {
    id: 10,
    nome: 'Fatia de Bolo',
    categoria: 'Lanches',
    valorUnitario: 2,
    emoji: '🍰',
    descricao:
      'Fatia generosa de bolo caseiro do dia, como cenoura com cobertura de chocolate, fubá ou laranja. Fofinho e feito na casa.',
  },
  {
    id: 11,
    nome: 'Torta',
    categoria: 'Lanches',
    valorUnitario: 3.5,
    emoji: '🥧',
    descricao:
      'Fatia de torta salgada de frango, com massa amanteigada e recheio cremoso e bem temperado. Servida morna.',
  },
  {
    id: 12,
    nome: 'Fatia de Pizza',
    categoria: 'Lanches',
    valorUnitario: 4,
    emoji: '🍕',
    descricao:
      'Fatia grande de pizza de mussarela, com molho de tomate caseiro e orégano, em massa fina e levemente crocante.',
  },
  {
    id: 13,
    nome: 'Salada',
    categoria: 'Lanches',
    valorUnitario: 6,
    emoji: '🥗',
    descricao:
      'Mix de folhas verdes com tomate, cenoura ralada, pepino e milho, temperado com azeite e limão. Leve e refrescante.',
  },
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