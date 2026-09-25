export type TabelaFuncionario = 'Garcom' | 'Gerente' | 'Atendente';

export interface Funcionario {
  id: number;
  nome: string;
  cargo: TabelaFuncionario;
}