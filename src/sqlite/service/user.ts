import { getDBConnection } from "..";
import { TN_USERS } from "../model/user";
import uuid from 'react-native-uuid';

const db = getDBConnection();

export type SalaryType = 'fixed' | 'daily' | '';

export interface User {
  uuid: string;
  name: string;
  embedding: string; // JSON string of face embedding array
  employee_id?: string;
  phone?: string;
  gender?: string;
  email?: string;
  address?: string;
  salary_type?: SalaryType;
  salary_amount?: number | null;
  bank_account?: string;
  ifsc?: string;
  pan?: string;
  pf?: string;
  esi?: string;
  uan?: string;
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
}

// Fields the form can set (employee_id is auto-generated, not part of this).
export interface UserInput {
  name: string;
  phone: string;
  gender: string;
  email?: string;
  address?: string;
  salaryType?: SalaryType;
  salaryAmount?: number | null;
  bankAccount?: string;
  ifsc?: string;
  pan?: string;
  pf?: string;
  esi?: string;
  uan?: string;
}

// Maps a UserInput key to its DB column.
const INPUT_COLUMN: Record<keyof UserInput, string> = {
  name: 'name',
  phone: 'phone',
  gender: 'gender',
  email: 'email',
  address: 'address',
  salaryType: 'salary_type',
  salaryAmount: 'salary_amount',
  bankAccount: 'bank_account',
  ifsc: 'ifsc',
  pan: 'pan',
  pf: 'pf',
  esi: 'esi',
  uan: 'uan',
};

// Helper function to format date for SQLite (YYYY-MM-DD HH:MM:SS)
const formatDateForSQLite = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const rowToUser = (row: any): User => ({
  uuid: row.uuid,
  name: row.name,
  embedding: row.embedding,
  employee_id: row.employee_id ?? undefined,
  phone: row.phone ?? undefined,
  gender: row.gender ?? undefined,
  email: row.email ?? undefined,
  address: row.address ?? undefined,
  salary_type: (row.salary_type ?? '') as SalaryType,
  salary_amount: row.salary_amount ?? null,
  bank_account: row.bank_account ?? undefined,
  ifsc: row.ifsc ?? undefined,
  pan: row.pan ?? undefined,
  pf: row.pf ?? undefined,
  esi: row.esi ?? undefined,
  uan: row.uan ?? undefined,
  created_at: row.created_at,
  updated_at: row.updated_at,
  is_active: row.is_active === 1,
});

// GET NEXT EMPLOYEE ID — auto-increment, zero-padded to 5 digits ("00001").
export const getNextEmployeeId = async (): Promise<string> => {
  return new Promise((resolve) => {
    const query = `SELECT MAX(CAST(employee_id AS INTEGER)) AS maxId FROM ${TN_USERS}
      WHERE employee_id IS NOT NULL AND employee_id != ''`;
    db.transaction((tx) => {
      tx.executeSql(
        query,
        [],
        (_tx, result) => {
          const maxId = result.rows.item(0)?.maxId || 0;
          resolve(String(maxId + 1).padStart(5, '0'));
        },
        (_t, error) => {
          console.log('getNextEmployeeId error:', error);
          resolve('00001');
          return false;
        }
      );
    });
  });
};

// CREATE USER
export const createUser = async (input: UserInput, embedding: number[]): Promise<boolean> => {
  if (!input?.name || !embedding || !input.phone || !input.gender) {
    console.log("createUser error: name, phone, gender and embedding are required");
    return false;
  }

  const employeeId = await getNextEmployeeId();

  return new Promise((resolve) => {
    const userUuid = uuid.v4() as string;
    const embeddingJson = JSON.stringify(embedding);
    const currentDateTime = formatDateForSQLite(new Date());

    const columns = [
      'uuid', 'name', 'embedding', 'employee_id', 'phone', 'gender', 'email', 'address',
      'salary_type', 'salary_amount', 'bank_account', 'ifsc', 'pan', 'pf', 'esi', 'uan',
      'created_at', 'updated_at', 'is_active',
    ];
    const values = [
      userUuid,
      input.name.trim(),
      embeddingJson,
      employeeId,
      input.phone.trim(),
      input.gender,
      input.email?.trim() || null,
      input.address?.trim() || null,
      input.salaryType || null,
      input.salaryAmount ?? null,
      input.bankAccount?.trim() || null,
      input.ifsc?.trim() || null,
      input.pan?.trim() || null,
      input.pf?.trim() || null,
      input.esi?.trim() || null,
      input.uan?.trim() || null,
      currentDateTime,
      currentDateTime,
      1,
    ];

    const placeholders = columns.map(() => '?').join(', ');
    const query = `INSERT INTO ${TN_USERS} (${columns.join(', ')}) VALUES (${placeholders})`;

    db.transaction((tx) => {
      tx.executeSql(
        query,
        values,
        () => {
          console.log("User created successfully:", userUuid, employeeId);
          resolve(true);
        },
        (_t, error) => {
          console.log("createUser error: ", error);
          resolve(false);
          return false;
        }
      );
    }, (error) => {
      console.log("Transaction error:", error);
      resolve(false);
    });
  });
};

// GET ALL USERS
export const getAllUsers = async (): Promise<User[]> => {
  return new Promise((resolve) => {
    const query = `SELECT * FROM ${TN_USERS} WHERE is_active = 1 ORDER BY created_at DESC`;

    db.transaction((tx) => {
      tx.executeSql(
        query,
        [],
        (_tx, result) => {
          const users: User[] = [];
          for (let i = 0; i < result.rows.length; i++) {
            users.push(rowToUser(result.rows.item(i)));
          }
          resolve(users);
        },
        (_t, error) => {
          console.error("Error fetching users list:", error);
          resolve([]);
          return false;
        }
      );
    }, (error) => {
      console.error("Transaction error:", error);
      resolve([]);
    });
  });
};

// GET USER BY UUID
export const getUserByUuid = async (userUuid: string): Promise<User | null> => {
  return new Promise((resolve) => {
    const query = `SELECT * FROM ${TN_USERS} WHERE uuid = ? AND is_active = 1`;

    db.transaction((tx) => {
      tx.executeSql(
        query,
        [userUuid],
        (_tx, result) => {
          if (result.rows.length > 0) {
            resolve(rowToUser(result.rows.item(0)));
          } else {
            resolve(null);
          }
        },
        (_t, error) => {
          console.error("Error fetching user by uuid:", error);
          resolve(null);
          return false;
        }
      );
    }, (error) => {
      console.error("Transaction error:", error);
      resolve(null);
    });
  });
};

// UPDATE USER — pass any subset of fields to change; optionally a new embedding.
export const updateUser = async (
  userUuid: string,
  input?: Partial<UserInput>,
  embedding?: number[]
): Promise<boolean> => {
  if (!userUuid) {
    console.log("updateUser error: uuid is required");
    return false;
  }

  return new Promise((resolve) => {
    const updates: string[] = [];
    const values: any[] = [];

    if (input) {
      (Object.keys(input) as (keyof UserInput)[]).forEach((key) => {
        const value = input[key];
        if (value === undefined) return;
        const column = INPUT_COLUMN[key];
        updates.push(`${column} = ?`);
        if (typeof value === 'string') {
          values.push(value.trim() === '' ? null : value.trim());
        } else {
          values.push(value ?? null);
        }
      });
    }

    if (embedding) {
      updates.push('embedding = ?');
      values.push(JSON.stringify(embedding));
    }

    if (updates.length === 0) {
      console.log("updateUser error: no fields to update");
      resolve(false);
      return;
    }

    const currentDateTime = formatDateForSQLite(new Date());
    updates.push('updated_at = ?');
    values.push(currentDateTime);
    values.push(userUuid);

    const query = `UPDATE ${TN_USERS} SET ${updates.join(', ')} WHERE uuid = ?`;

    db.transaction((tx) => {
      tx.executeSql(
        query,
        values,
        () => {
          console.log("User updated successfully:", userUuid);
          resolve(true);
        },
        (_t, error) => {
          console.log("updateUser error: ", error);
          resolve(false);
          return false;
        }
      );
    }, (error) => {
      console.log("Transaction error:", error);
      resolve(false);
    });
  });
};

// DELETE USER (soft delete - set is_active to 0)
export const deleteUser = async (userUuid: string): Promise<boolean> => {
  if (!userUuid) {
    console.log("deleteUser error: uuid is required");
    return false;
  }

  return new Promise((resolve) => {
    const currentDateTime = formatDateForSQLite(new Date());
    const query = `UPDATE ${TN_USERS} SET is_active = 0, updated_at = ? WHERE uuid = ?`;

    db.transaction((tx) => {
      tx.executeSql(
        query,
        [currentDateTime, userUuid],
        () => {
          console.log("User deleted successfully:", userUuid);
          resolve(true);
        },
        (_t, error) => {
          console.log("deleteUser error: ", error);
          resolve(false);
          return false;
        }
      );
    }, (error) => {
      console.log("Transaction error:", error);
      resolve(false);
    });
  });
};
