import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL não definida. Copie .env.example para .env e preencha com a string do Neon.');
  process.exit(1);
}

neonConfig.webSocketConstructor = ws;

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
