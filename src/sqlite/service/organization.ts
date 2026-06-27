import { getDBConnection } from '..';
import { TN_ORGANIZATION } from '../model/organization';

const db = getDBConnection();

export interface Organization {
  name?: string;
  logo?: string | null; // base64 JPEG/PNG (no data: prefix)
  phone?: string;
  email?: string;
  address?: string;
  website?: string;
  gstin?: string;
  pan?: string;
  updated_at?: string;
}

const formatDateForSQLite = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const rowToOrganization = (row: any): Organization => ({
  name: row.name ?? undefined,
  logo: row.logo ?? null,
  phone: row.phone ?? undefined,
  email: row.email ?? undefined,
  address: row.address ?? undefined,
  website: row.website ?? undefined,
  gstin: row.gstin ?? undefined,
  pan: row.pan ?? undefined,
  updated_at: row.updated_at,
});

// GET ORGANIZATION — the single profile row (id = 1), or null if not set yet.
export const getOrganization = async (): Promise<Organization | null> => {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM ${TN_ORGANIZATION} WHERE id = 1`,
        [],
        (_tx, result) => {
          resolve(result.rows.length > 0 ? rowToOrganization(result.rows.item(0)) : null);
        },
        (_t, error) => {
          console.log('getOrganization error:', error);
          resolve(null);
          return false;
        }
      );
    });
  });
};

// SAVE ORGANIZATION — upsert the single profile row (id = 1).
export const saveOrganization = async (input: Organization): Promise<boolean> => {
  const name = input?.name?.trim();
  if (!name) {
    console.log('saveOrganization error: name is required');
    return false;
  }

  const clean = (v?: string | null) => (v && v.trim() !== '' ? v.trim() : null);

  return new Promise((resolve) => {
    const query = `INSERT OR REPLACE INTO ${TN_ORGANIZATION}
      (id, name, logo, phone, email, address, website, gstin, pan, updated_at)
      VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      name,
      input.logo ?? null,
      clean(input.phone),
      clean(input.email),
      clean(input.address),
      clean(input.website),
      clean(input.gstin),
      clean(input.pan),
      formatDateForSQLite(new Date()),
    ];

    db.transaction((tx) => {
      tx.executeSql(
        query,
        values,
        () => {
          console.log('Organization saved');
          resolve(true);
        },
        (_t, error) => {
          console.log('saveOrganization error:', error);
          resolve(false);
          return false;
        }
      );
    }, (error) => {
      console.log('Transaction error:', error);
      resolve(false);
    });
  });
};
