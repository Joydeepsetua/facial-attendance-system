export const TN_SETTINGS = 'settings';

// App-level settings & feature flags. One row per key.
//  - is_enabled : the on/off state (used by pure toggles like payroll).
//  - value      : optional extra config; NULL for boolean-only flags.
//                 e.g. theme_mode -> is_enabled = 1, value = 'dark'.
export const createTableQuerySettings = `CREATE TABLE IF NOT EXISTS ${TN_SETTINGS} (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT NOT NULL UNIQUE,
  is_enabled INTEGER NOT NULL DEFAULT 0,
  value TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;

// Known setting keys.
export const SETTING_KEYS = {
  PAYROLL_ENABLED: 'feature_payroll_enabled',
} as const;

// Seed values inserted when the table is first created. Uses INSERT OR IGNORE,
// so an existing row (e.g. a user-toggled flag) is never overwritten.
export const DEFAULT_SETTINGS: { key: string; is_enabled: number; value: string | null }[] = [
  { key: SETTING_KEYS.PAYROLL_ENABLED, is_enabled: 1, value: null },
];
