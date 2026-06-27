import { getDBConnection } from '..';
import { TN_SETTINGS, SETTING_KEYS } from '../model/settings';

const db = getDBConnection();

export interface Setting {
  id?: number;
  key: string;
  is_enabled: boolean;
  value: string | null;
  created_at?: string;
  updated_at?: string;
}

const rowToSetting = (row: any): Setting => ({
  id: row.id,
  key: row.key,
  is_enabled: row.is_enabled === 1,
  value: row.value ?? null,
  created_at: row.created_at,
  updated_at: row.updated_at,
});

// GET SETTING — the full row for a key, or null if not set yet.
export const getSetting = async (key: string): Promise<Setting | null> => {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM ${TN_SETTINGS} WHERE key = ?`,
        [key],
        (_tx, result) => {
          resolve(result.rows.length > 0 ? rowToSetting(result.rows.item(0)) : null);
        },
        (_t, error) => {
          console.log('getSetting error:', error);
          resolve(null);
          return false;
        }
      );
    });
  });
};

// SAVE SETTING — upsert a key. ON CONFLICT keeps the original created_at and only
// refreshes is_enabled / value / updated_at, so creation time is preserved.
export const saveSetting = async (
  key: string,
  isEnabled: boolean,
  value: string | null = null
): Promise<boolean> => {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO ${TN_SETTINGS} (key, is_enabled, value, created_at, updated_at)
         VALUES (?, ?, ?, datetime('now'), datetime('now'))
         ON CONFLICT(key) DO UPDATE SET
           is_enabled = excluded.is_enabled,
           value = excluded.value,
           updated_at = datetime('now')`,
        [key, isEnabled ? 1 : 0, value],
        () => resolve(true),
        (_t, error) => {
          console.log('saveSetting error:', error);
          resolve(false);
          return false;
        }
      );
    }, (error) => {
      console.log('saveSetting transaction error:', error);
      resolve(false);
    });
  });
};

// Read just the on/off state for a key (with a fallback when unset).
export const isFeatureEnabled = async (key: string, fallback = false): Promise<boolean> => {
  const setting = await getSetting(key);
  return setting ? setting.is_enabled : fallback;
};

// ---- Feature flags ----
export const isPayrollEnabled = (): Promise<boolean> =>
  isFeatureEnabled(SETTING_KEYS.PAYROLL_ENABLED, true);

export const setPayrollEnabled = (enabled: boolean): Promise<boolean> =>
  saveSetting(SETTING_KEYS.PAYROLL_ENABLED, enabled, null);
