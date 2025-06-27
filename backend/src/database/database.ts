
import { Pool, PoolClient } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export class Database {
  private static pool: Pool;

  static async connect(): Promise<void> {
    this.pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      user: process.env.DB_USER || 'idm_user',
      password: process.env.DB_PASSWORD || 'idm_password',
      database: process.env.DB_NAME || 'idm_database',
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    try {
      const client = await this.pool.connect();
      client.release();
      console.log('Database connection established');
    } catch (error) {
      console.error('Database connection failed:', error);
      throw error;
    }
  }

  static async query(text: string, params?: any[]): Promise<any> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(text, params);
      return result;
    } finally {
      client.release();
    }
  }

  static async getClient(): Promise<PoolClient> {
    return await this.pool.connect();
  }

  static async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
    }
  }
}
