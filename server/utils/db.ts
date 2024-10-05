// server/utils/db.ts
import mysql from "mysql2/promise";
import { createPool, Pool } from "mysql2/promise";

let globalPool: Pool | undefined = undefined;

export async function connect(): Promise<Pool> {
  // If the pool was already created, return it instead of creating a new one.
  if (typeof globalPool !== "undefined") {
    return globalPool;
  }

  // If we have gotten this far, the pool doesn't exist, so lets create one.
  globalPool = await createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 10,
  });
  return globalPool;
}

export const query = (
  pool: mysql.Pool,
  sql: string,
  params: any[]
): Promise<any> => {
  return new Promise((resolve, reject) => {
    pool
      .execute(sql, params)
      .then(([results]) => resolve(results))
      .catch((err) => reject(err));
  });
};
