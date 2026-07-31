import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { logger } from '../utils/logger';

dotenv.config();

// MySQL Connection Pool Configuration
const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'kinetic_cms',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

export const pool = mysql.createPool(dbConfig);

let isPoolConnected = false;

// Check connection health on startup
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    const connection = await pool.getConnection();
    logger.info('MySQL Database connected successfully to ' + dbConfig.host);
    connection.release();
    isPoolConnected = true;
    return true;
  } catch (error: any) {
    logger.warn('MySQL pool connection notice: ' + error.message + '. Operating with high-availability memory store.');
    isPoolConnected = false;
    return false;
  }
}

export function isDbConnected(): boolean {
  return isPoolConnected;
}

// Wrapper to safely execute MySQL queries
export async function query<T = any>(sql: string, params: any[] = []): Promise<T> {
  if (!isPoolConnected) {
    throw new Error('Database connection not established.');
  }
  const [rows] = await pool.execute(sql, params);
  return rows as T;
}
