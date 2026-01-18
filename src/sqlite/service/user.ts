import { getDBConnection } from "..";
import { TN_USERS } from "../model/user";
import uuid from 'react-native-uuid';

const db = getDBConnection();

export interface User {
  uuid: string;
  name: string;
  embedding: string; // JSON string of face embedding array
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
}

// CREATE USER
export const createUser = async (name: string, embedding: number[]): Promise<boolean> => {
  if (!name || !embedding) {
    console.log("createUser error: name and embedding are required");
    return false;
  }

  return new Promise((resolve) => {
    const userUuid = uuid.v4() as string;
    const embeddingJson = JSON.stringify(embedding);
    
    const query = `INSERT INTO ${TN_USERS} (
      uuid, name, embedding, is_active
    ) VALUES (?, ?, ?, ?)`;
  
    const values = [
      userUuid,
      name,
      embeddingJson,
      1
    ];
    
    db.transaction((tx) => {
      tx.executeSql(
        query,
        values,
        () => {
          console.log("User created successfully:", userUuid);
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
            const item = result.rows.item(i);
            users.push({
              uuid: item.uuid,
              name: item.name,
              embedding: item.embedding,
              created_at: item.created_at,
              updated_at: item.updated_at,
              is_active: item.is_active === 1,
            });
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
            const row = result.rows.item(0);
            resolve({
              uuid: row.uuid,
              name: row.name,
              embedding: row.embedding,
              created_at: row.created_at,
              updated_at: row.updated_at,
              is_active: row.is_active === 1,
            });
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

// UPDATE USER
export const updateUser = async (userUuid: string, name?: string, embedding?: number[]): Promise<boolean> => {
  if (!userUuid) {
    console.log("updateUser error: uuid is required");
    return false;
  }

  return new Promise((resolve) => {
    const updates: string[] = [];
    const values: any[] = [];

    if (name) {
      updates.push('name = ?');
      values.push(name);
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

    updates.push('updated_at = CURRENT_TIMESTAMP');
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
    const query = `UPDATE ${TN_USERS} SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE uuid = ?`;
    
    db.transaction((tx) => {
      tx.executeSql(
        query,
        [userUuid],
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
