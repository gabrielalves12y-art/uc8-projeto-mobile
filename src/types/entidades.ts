export type SituacaoEmprestimo = "aberto" | "devolvido";

export interface Livro {
  id: number;
  titulo: string;
  autor: string;
  sinopse?: string;
  exemplares: number;
}

export interface Emprestimo {
  id: number;
  livroId: number;
  leitor: string;
  situacao: SituacaoEmprestimo;
  devolucao?: string;
}
