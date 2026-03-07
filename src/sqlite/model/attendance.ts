import { TN_USERS } from './user';

export const TN_ATTENDANCE = 'attendance';

export const createTableQueryAttendance = `CREATE TABLE IF NOT EXISTS ${TN_ATTENDANCE} (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  punch_in DATETIME,
  punch_out DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT 1,
  FOREIGN KEY (user_id) REFERENCES ${TN_USERS}(uuid)
);
`;
