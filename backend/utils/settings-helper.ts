/**
 * Settings Helper
 *
 * Utility to read/write plugin settings stored in the OpenTYME database.
 */

import { Pool } from 'pg';

export async function getPluginSetting(
  db: Pool,
  pluginName: string,
  key: string,
  userId: string,
): Promise<string | null> {
  const result = await db.query(
    `SELECT value FROM plugin_settings
     WHERE plugin_name = $1 AND setting_key = $2 AND user_id = $3`,
    [pluginName, key, userId],
  );
  return result.rows[0]?.value ?? null;
}

export async function setPluginSetting(
  db: Pool,
  pluginName: string,
  key: string,
  userId: string,
  value: string,
): Promise<void> {
  await db.query(
    `INSERT INTO plugin_settings (plugin_name, setting_key, user_id, value)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (plugin_name, setting_key, user_id)
     DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
    [pluginName, key, userId, value],
  );
}
