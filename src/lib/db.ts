import { Pool } from 'pg';

let pool: Pool | undefined;

export function getPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      return undefined;
    }
    pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } as any });
  }
  return pool;
}

export async function query(text: string, params?: any[]) {
  const p = getPool();
  if (!p) {
    throw new Error('No database connection configured. Set DATABASE_URL.');
  }
  const res = await p.query(text, params);
  return res;
}
