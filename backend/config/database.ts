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
let lastConnectionError: string | null = null;

// Check connection health on startup
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    const connection = await pool.getConnection();
    logger.info('MySQL Database connected successfully to ' + dbConfig.host);
    connection.release();
    isPoolConnected = true;
    lastConnectionError = null;
    return true;
  } catch (error: any) {
    logger.warn('MySQL pool connection notice: ' + error.message + '. Operating with high-availability memory store.');
    isPoolConnected = false;
    lastConnectionError = `${error.code || 'ERROR'}: ${error.message}`;
    return false;
  }
}

export function isDbConnected(): boolean {
  return isPoolConnected;
}

export function getLastDbError(): string | null {
  return lastConnectionError;
}

export function getDbConfigSummary() {
  // Never expose the actual password. Only enough to confirm which values are
  // actually being used at runtime, since env vars can silently differ from what's
  // set in a hosting panel (typos, wrong app, stale cached value, etc.).
  return {
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    database: dbConfig.database,
    password_set: !!dbConfig.password,
    password_length: dbConfig.password ? dbConfig.password.length : 0,
  };
}

// Wrapper to safely execute MySQL queries
export async function query<T = any>(sql: string, params: any[] = []): Promise<T> {
  try {
    const [rows] = await pool.execute(sql, params);
    isPoolConnected = true;
    return rows as T;
  } catch (error: any) {
    if (!isPoolConnected) {
      // Try testing connection once more
      const retested = await testDatabaseConnection();
      if (retested) {
        const [rows] = await pool.execute(sql, params);
        return rows as T;
      }
    }
    throw error;
  }
}
