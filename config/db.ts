import { Pool, QueryResult } from 'pg';
import dotenv from 'dotenv';
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const poolConfig = process.env.NODE_ENV === 'production'
  ? {
    connectionString: process.env.INTERNAL_DATABASE_URL, // Use the DATABASE_URL provided by Render
    ssl: {
      rejectUnauthorized: false, // Required for connecting securely to Render's PostgreSQL
    },
  } : {
    connectionString: process.env.EXTERNAL_DATABASE_URL, // Use the DATABASE_URL provided by Render
    ssl: {
      rejectUnauthorized: false, // Required for connecting securely to Render's PostgreSQL
    },
  }

  const pool = new Pool(poolConfig);
/*
const pool = new Pool({
    user: process.env.DB_USER,
    host: 'localhost',
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: 5432
});*/

export const query = (text: string, params?: any[]): Promise<QueryResult<any>> => {
    return pool.query(text, params);
  };

export default { query };