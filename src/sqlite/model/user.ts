export const TN_USERS = 'users';

export const createTableQureyUsers = `CREATE TABLE IF NOT EXISTS ${TN_USERS} (
  uuid TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  embedding TEXT NOT NULL,
  employee_id TEXT,
  phone TEXT,
  gender TEXT,
  email TEXT,
  address TEXT,
  salary_type TEXT,
  salary_amount REAL,
  bank_account TEXT,
  ifsc TEXT,
  pan TEXT,
  pf TEXT,
  esi TEXT,
  uan TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT 1
);
`;

// Columns added after the original schema — applied via ALTER TABLE for
// existing installs that already have a `users` table without them.
export const USER_COLUMN_MIGRATIONS: { col: string; type: string }[] = [
  { col: 'employee_id', type: 'TEXT' },
  { col: 'phone', type: 'TEXT' },
  { col: 'gender', type: 'TEXT' },
  { col: 'email', type: 'TEXT' },
  { col: 'address', type: 'TEXT' },
  { col: 'salary_type', type: 'TEXT' },
  { col: 'salary_amount', type: 'REAL' },
  { col: 'bank_account', type: 'TEXT' },
  { col: 'ifsc', type: 'TEXT' },
  { col: 'pan', type: 'TEXT' },
  { col: 'pf', type: 'TEXT' },
  { col: 'esi', type: 'TEXT' },
  { col: 'uan', type: 'TEXT' },
];
