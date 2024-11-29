import { Pool, QueryResult } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: 'localhost',
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: 5432
})

export const query = (text: string, params?: any[]): Promise<QueryResult<any>> => {
    return pool.query(text, params);
  };

export default { query };