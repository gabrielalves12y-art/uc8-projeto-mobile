import { pool } from './db.js';

try {
  const { rows: tabelas } = await pool.query(
    `SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name`,
  );

  for (const { table_name: tabela } of tabelas) {
    const { rows: colunas } = await pool.query(
      `SELECT column_name AS coluna, data_type AS tipo, is_nullable AS aceita_nulo
         FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = $1
        ORDER BY ordinal_position`,
      [tabela],
    );
    const { rows: [contagem] } = await pool.query(`SELECT count(*)::int AS total FROM "${tabela}"`);
    console.log(`\n=== ${tabela} (${contagem.total} linhas) ===`);
    console.table(colunas);

    if (contagem.total > 0) {
      const { rows: amostra } = await pool.query(`SELECT * FROM "${tabela}" LIMIT 3`);
      console.log('Exemplo:');
      console.table(amostra);
    }
  }
} catch (erro) {
  console.error('Falha ao inspecionar:', erro.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
