import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { Funcionario } from '../types/funcionario';
import type { Produto } from '../types/produto';
import type { Pedido, StatusPedido } from '../types/pedido';

interface FormularioPedidoProps {
  funcionarios: Funcionario[];
  produtos: Produto[];
  aoAdicionar: (pedido: Pedido) => void;
  proximoId: number;
}

interface CamposFormulario {
  mesa: string;
  cliente: string;
  observacoes: string;
  status: StatusPedido;
  atendenteId: string;
  produtoId: string;
  quantidade: string;
}

function camposIniciais(funcionarios: Funcionario[], produtos: Produto[]): CamposFormulario {
  return {
    mesa: '',
    cliente: '',
    observacoes: '',
    status: 'pendente',
    atendenteId: funcionarios[0] ? String(funcionarios[0].id) : '',
    produtoId: produtos[0] ? String(produtos[0].id) : '',
    quantidade: '1',
  };
}

export function FormularioPedido({
  funcionarios,
  produtos,
  aoAdicionar,
  proximoId,
}: FormularioPedidoProps) {
  const [campos, setCampos] = useState<CamposFormulario>(
    camposIniciais(funcionarios, produtos),
  );

  function tratarMudanca(
    evento: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = evento.target;
    setCampos((atual) => ({ ...atual, [name]: value }));
  }

  function tratarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    if (campos.mesa.trim() === '' || campos.cliente.trim() === '') {
      return;
    }

    const produto = produtos.find((item) => item.id === Number(campos.produtoId));
    const agora = new Date().toISOString();

    const novoPedido: Pedido = {
      id: proximoId,
      mesa: campos.mesa.trim(),
      cliente: campos.cliente.trim(),
      atendenteId: Number(campos.atendenteId),
      observacoes: campos.observacoes.trim(),
      status: campos.status,
      itens: produto
        ? [
            {
              produtoId: produto.id,
              quantidade: Number(campos.quantidade) || 1,
              valorUnitario: produto.valorUnitario,
            },
          ]
        : [],
      criadoEm: agora,
      atualizadoEm: agora,
    };

    aoAdicionar(novoPedido);
    setCampos(camposIniciais(funcionarios, produtos));
  }

  return (
    <form onSubmit={tratarEnvio}>
      <h2>Novo pedido</h2>

      <label>
        Mesa
        <input name="mesa" value={campos.mesa} onChange={tratarMudanca} />
      </label>

      <label>
        Cliente
        <input name="cliente" value={campos.cliente} onChange={tratarMudanca} />
      </label>

      <label>
        Atendente
        <select name="atendenteId" value={campos.atendenteId} onChange={tratarMudanca}>
          {funcionarios.map((funcionario) => (
            <option key={funcionario.id} value={funcionario.id}>
              {funcionario.nome}
            </option>
          ))}
        </select>
      </label>

      <label>
        Produto
        <select name="produtoId" value={campos.produtoId} onChange={tratarMudanca}>
          {produtos.map((produto) => (
            <option key={produto.id} value={produto.id}>
              {produto.nome}
            </option>
          ))}
        </select>
      </label>

      <label>
        Quantidade
        <input
          name="quantidade"
          type="number"
          min={1}
          value={campos.quantidade}
          onChange={tratarMudanca}
        />
      </label>

      <label>
        Status
        <select name="status" value={campos.status} onChange={tratarMudanca}>
          <option value="pendente">Pendente</option>
          <option value="em_andamento">Em andamento</option>
          <option value="concluido">Concluído</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </label>

      <label>
        Observações
        <textarea name="observacoes" value={campos.observacoes} onChange={tratarMudanca} />
      </label>

      <p>
        Pré-visualização: mesa <strong>{campos.mesa || '(vazia)'}</strong>
        {campos.cliente && ` — ${campos.cliente}`}
      </p>

      <button type="submit">Adicionar pedido</button>
    </form>
  );
}
