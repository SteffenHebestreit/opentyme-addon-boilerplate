/**
 * Example Service
 *
 * Replace with your addon's business logic.
 */

import { Pool } from 'pg';
import { PluginLogger } from '../types';

export class ExampleService {
  constructor(
    private readonly db: Pool,
    private readonly logger: PluginLogger,
  ) {}

  async getStatus(): Promise<{ initialized: boolean; version: string; timestamp: string }> {
    return {
      initialized: true,
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    };
  }

  async getData(userId: string): Promise<any[]> {
    this.logger.debug(`[Example] Loading data for user ${userId}`);
    const result = await this.db.query(
      'SELECT id, data, created_at FROM example_data WHERE user_id = $1 ORDER BY created_at DESC',
      [userId],
    );
    return result.rows;
  }

  async processData(userId: string, input: string): Promise<any> {
    this.logger.info(`[Example] Processing data for user ${userId}`);
    const result = await this.db.query(
      'INSERT INTO example_data (user_id, data) VALUES ($1, $2) RETURNING *',
      [userId, { input, processed: input.toUpperCase(), processedAt: new Date().toISOString() }],
    );
    return result.rows[0];
  }
}
