import SQLite from 'react-native-sqlite-2';
import { createTableQureyUsers, TN_USERS, USER_COLUMN_MIGRATIONS } from './model/user';
import { createTableQueryAttendance } from './model/attendance';
import { createTableQueryOrganization } from './model/organization';
import { createTableQuerySettings, TN_SETTINGS, DEFAULT_SETTINGS } from './model/settings';

const db = SQLite.openDatabase('FacialAttendance.db', '1.0', '', 1);

export const getDBConnection = () => {
    return db;
};

// ────────────────────────────────────────────────────────────────────────────
// Schema versioning (PRAGMA user_version)
//
// The DB stores its own schema version in the file. On launch we read it and
// run only the migrations newer than it, then bump it. To add a schema change:
//   1. bump DB_VERSION
//   2. add a MIGRATIONS[<new version>] entry that performs the change
// Migrations are written to be idempotent so re-running is always safe.
// ────────────────────────────────────────────────────────────────────────────

const DB_VERSION = 5;

type Tx = any;

// Adds any HR columns that are missing on the users table (idempotent).
const addMissingUserColumns = (tx: Tx, done: () => void) => {
    tx.executeSql(
        `PRAGMA table_info(${TN_USERS})`,
        [],
        (_t: Tx, result: any) => {
            const existing = new Set<string>();
            for (let i = 0; i < result.rows.length; i++) {
                existing.add(result.rows.item(i).name);
            }
            const missing = USER_COLUMN_MIGRATIONS.filter((m) => !existing.has(m.col));
            if (missing.length === 0) {
                done();
                return;
            }
            console.log(`Adding user columns: ${missing.map((m) => m.col).join(', ')}`);
            let completed = 0;
            const finishOne = () => {
                completed += 1;
                if (completed === missing.length) done();
            };
            missing.forEach((m) => {
                tx.executeSql(
                    `ALTER TABLE ${TN_USERS} ADD COLUMN ${m.col} ${m.type}`,
                    [],
                    () => finishOne(),
                    (_t2: Tx, error: any) => {
                        console.log(`Error adding column ${m.col}:`, error);
                        finishOne();
                        return false;
                    }
                );
            });
        },
        (_t: Tx, error: any) => {
            console.log('Error reading users table info:', error);
            done();
            return false;
        }
    );
};

// Inserts default feature flags (INSERT OR IGNORE keeps any existing rows).
const seedSettings = (tx: Tx, done: () => void) => {
    if (DEFAULT_SETTINGS.length === 0) {
        done();
        return;
    }
    let completed = 0;
    const finishOne = () => {
        completed += 1;
        if (completed === DEFAULT_SETTINGS.length) done();
    };
    DEFAULT_SETTINGS.forEach((s) => {
        tx.executeSql(
            `INSERT OR IGNORE INTO ${TN_SETTINGS} (key, is_enabled, value) VALUES (?, ?, ?)`,
            [s.key, s.is_enabled, s.value],
            () => finishOne(),
            (_t: Tx, error: any) => {
                console.log(`Error seeding setting ${s.key}:`, error);
                finishOne();
                return false;
            }
        );
    });
};

// Creates the settings table and seeds its default rows.
const createAndSeedSettings = (tx: Tx, done: () => void) => {
    tx.executeSql(
        createTableQuerySettings,
        [],
        () => seedSettings(tx, done),
        (_t: Tx, error: any) => {
            console.log('Error creating settings table:', error);
            done();
            return false;
        }
    );
};

// Each entry upgrades the schema TO that version number.
const MIGRATIONS: { [version: number]: (tx: Tx, done: () => void) => void } = {
    // v1 — base tables
    1: (tx, done) => {
        tx.executeSql(createTableQureyUsers, [], () => {
            tx.executeSql(
                createTableQueryAttendance,
                [],
                () => done(),
                (_t: Tx, error: any) => {
                    console.log('Error creating attendance table:', error);
                    done();
                    return false;
                }
            );
        }, (_t: Tx, error: any) => {
            console.log('Error creating users table:', error);
            done();
            return false;
        });
    },
    // v2 — HR fields on users (employee_id, phone, salary, bank, statutory, …)
    2: (tx, done) => addMissingUserColumns(tx, done),
    // v3 — organization profile (company details for payslips / payroll)
    3: (tx, done) => {
        tx.executeSql(
            createTableQueryOrganization,
            [],
            () => done(),
            (_t: Tx, error: any) => {
                console.log('Error creating organization table:', error);
                done();
                return false;
            }
        );
    },
    // v4 — settings / feature flags store (created + seeded with defaults)
    4: (tx, done) => createAndSeedSettings(tx, done),
    // v5 — settings schema reshaped (id, is_enabled, value, created_at). The table
    // only holds regenerable feature flags, so drop & recreate + reseed is safe.
    5: (tx, done) => {
        tx.executeSql(
            `DROP TABLE IF EXISTS ${TN_SETTINGS}`,
            [],
            () => createAndSeedSettings(tx, done),
            (_t: Tx, error: any) => {
                console.log('Error dropping settings table:', error);
                done();
                return false;
            }
        );
    },
};

// Run migrations from the current version up to DB_VERSION, in order.
const runMigrations = (tx: Tx, fromVersion: number, allDone: () => void) => {
    let version = fromVersion;
    const next = () => {
        version += 1;
        if (version > DB_VERSION) {
            allDone();
            return;
        }
        const migration = MIGRATIONS[version];
        if (!migration) {
            next();
            return;
        }
        console.log(`Running DB migration → v${version}`);
        migration(tx, next);
    };
    next();
};

export const createTable = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        db.transaction((tx: Tx) => {
            tx.executeSql('PRAGMA foreign_keys = ON', [], () => true, () => false);
            tx.executeSql(
                'PRAGMA user_version',
                [],
                (_t: Tx, result: any) => {
                    const currentVersion = result.rows.item(0)?.user_version ?? 0;
                    if (currentVersion >= DB_VERSION) {
                        console.log(`DB up to date (v${currentVersion})`);
                        resolve();
                        return;
                    }
                    console.log(`Migrating DB from v${currentVersion} to v${DB_VERSION}`);
                    runMigrations(tx, currentVersion, () => {
                        tx.executeSql(
                            `PRAGMA user_version = ${DB_VERSION}`,
                            [],
                            () => {
                                console.log(`DB migrated to v${DB_VERSION}`);
                                resolve();
                            },
                            (_t2: Tx, error: any) => {
                                console.log('Error setting user_version:', error);
                                reject(error);
                                return false;
                            }
                        );
                    });
                },
                (_t: Tx, error: any) => {
                    console.log('Error reading user_version:', error);
                    reject(error);
                    return false;
                }
            );
        }, (error: any) => {
            console.log('Transaction error:', error);
            reject(error);
        });
    });
};
