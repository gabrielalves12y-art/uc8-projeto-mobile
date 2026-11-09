import cors from 'cors';
import express from 'express';
import { pool } from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/saude', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true });
  } catch {
    res.status(503).json({ ok: false });
  }
});

app.get('/pedidos', async (req, res) => {
  let inicio = null;
  let fim = null;
  if (req.query.inicio !== undefined || req.query.fim !== undefined) {
    inicio = new Date(String(req.query.inicio));
    fim = new Date(String(req.query.fim));
    if (Number.isNaN(inicio.getTime()) || Number.isNaN(fim.getTime()) || inicio >= fim) {
      res.status(400).json({ erro: 'Período inválido.' });
      return;
    }
  }

  try {
    const { rows } = await pool.query(`
      SELECT p.id,
             p.mesa,
             COALESCE((SELECT f.id FROM funcionarios f WHERE f.nome = p.atendente ORDER BY f.id LIMIT 1), 0)
                              AS "atendenteId",
             p.cliente,
             p.status,
             p.observacoes,
             p.criado_em     AS "criadoEm",
             p.atualizado_em AS "atualizadoEm",
             COALESCE(
               json_agg(
                 json_build_object(
                   'produtoId', COALESCE((SELECT pr.id FROM produtos pr WHERE pr.nome = i.produto ORDER BY pr.id LIMIT 1), 0),
                   'quantidade', i.quantidade,
                   'valorUnitario', i.valor_unitario::float8
                 ) ORDER BY i.id
               ) FILTER (WHERE i.id IS NOT NULL),
               '[]'::json
             ) AS itens
        FROM pedidos p
        LEFT JOIN itens_pedido i ON i.pedido_id = p.id
       WHERE p.criado_em >= COALESCE($1::timestamptz,
               date_trunc('day', now() AT TIME ZONE 'America/Sao_Paulo') AT TIME ZONE 'America/Sao_Paulo')
         AND p.criado_em <  COALESCE($2::timestamptz,
               (date_trunc('day', now() AT TIME ZONE 'America/Sao_Paulo') + interval '1 day') AT TIME ZONE 'America/Sao_Paulo')
       GROUP BY p.id
       ORDER BY p.criado_em DESC, p.id DESC`, [inicio, fim]);
    res.json(rows);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Falha ao ler os pedidos.' });
  }
});

function validar(corpo) {
  if (typeof corpo?.mesa !== 'string' || corpo.mesa.trim() === '') return 'Informe a mesa.';
  if (typeof corpo.cliente !== 'string' || corpo.cliente.trim() === '') return 'Informe o cliente.';
  if (!Number.isInteger(corpo.atendenteId)) return 'Atendente inválido.';
  if (!Array.isArray(corpo.itens) || corpo.itens.length === 0) return 'Adicione ao menos um item.';
  for (const item of corpo.itens) {
    if (!Number.isInteger(item?.produtoId)) return 'Produto inválido.';
    if (!Number.isInteger(item.quantidade) || item.quantidade <= 0) return 'Quantidade inválida.';
    if (typeof item.valorUnitario !== 'number' || !(item.valorUnitario >= 0)) return 'Valor inválido.';
  }
  return '';
}

app.post('/pedidos', async (req, res) => {
  const mensagem = validar(req.body);
  if (mensagem !== '') {
    res.status(400).json({ erro: mensagem });
    return;
  }

  const { mesa, cliente, atendenteId, observacoes = '', itens } = req.body;
  const conexao = await pool.connect();
  try {
  
    const { rows: [atendente] } = await conexao.query(
      'SELECT nome FROM funcionarios WHERE id = $1',
      [atendenteId],
    );
    if (!atendente) {
      res.status(400).json({ erro: 'Atendente não existe.' });
      return;
    }

    const idsProdutos = [...new Set(itens.map((item) => item.produtoId))];
    const { rows: produtosEncontrados } = await conexao.query(
      'SELECT id, nome FROM produtos WHERE id = ANY($1::int[])',
      [idsProdutos],
    );
    const nomePorId = new Map(produtosEncontrados.map((produto) => [produto.id, produto.nome]));
    if (idsProdutos.some((id) => !nomePorId.has(id))) {
      res.status(400).json({ erro: 'Produto não existe.' });
      return;
    }

    await conexao.query('BEGIN');
    const { rows: [pedido] } = await conexao.query(
      `INSERT INTO pedidos (mesa, atendente, cliente, status, observacoes, criado_em, atualizado_em)
       VALUES ($1, $2, $3, 'pendente', $4, now(), now()) RETURNING id`,
      [mesa.trim(), atendente.nome, cliente.trim(), String(observacoes).trim()],
    );
    for (const item of itens) {
      await conexao.query(
        `INSERT INTO itens_pedido (pedido_id, produto, quantidade, valor_unitario)
         VALUES ($1, $2, $3, $4)`,
        [pedido.id, nomePorId.get(item.produtoId), item.quantidade, item.valorUnitario],
      );
    }
    await conexao.query('COMMIT');
    res.status(201).json({ id: pedido.id });
  } catch (erro) {
    await conexao.query('ROLLBACK').catch(() => {});
    console.error(erro);
    res.status(500).json({ erro: 'Falha ao salvar o pedido.' });
  } finally {
    conexao.release();
  }
});

const porta = Number(process.env.PORT ?? 3000);
app.listen(porta, '0.0.0.0', () => console.log(`API de pedidos em http://localhost:${porta}`));

