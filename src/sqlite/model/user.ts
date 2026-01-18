export const TN_USERS = 'users';

export const createTableQureyUsers = `CREATE TABLE IF NOT EXISTS ${TN_USERS} (
  uuid TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  embedding TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT 1
);
`