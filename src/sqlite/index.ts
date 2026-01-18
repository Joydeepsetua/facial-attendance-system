import SQLite from 'react-native-sqlite-2';
import { createTableQureyUsers, TN_USERS } from './model/user';
import { createTableQueryAttendance, TN_ATTENDANCE } from './model/attendance';

const db = SQLite.openDatabase('FacialAttendance.db', '1.0', '', 1);

export const getDBConnection = () => {
    return db;
};

export const createTable = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            // Enable foreign keys
            tx.executeSql('PRAGMA foreign_keys = ON', [], () => { return true; }, () => { return false; });
            
            // Check and create users table first
            tx.executeSql(
                `SELECT name FROM sqlite_master WHERE type='table' AND name=?`,
                [TN_USERS],
                (_tx, result) => {
                    if (result.rows.length === 0) {
                        console.log(`Creating table: ${TN_USERS}`);
                        tx.executeSql(
                            createTableQureyUsers,
                            [],
                            () => {
                                console.log(`Table ${TN_USERS} created successfully`);
                                // After users table is created, check and create attendance table
                                checkAndCreateAttendanceTable(tx, resolve, reject);
                            },
                            (_t, error) => {
                                console.log("Error creating users table:", error);
                                reject(error);
                                return false;
                            }
                        );
                    } else {
                        console.log(`Table ${TN_USERS} already exists, skipping creation`);
                        // Users table exists, check and create attendance table
                        checkAndCreateAttendanceTable(tx, resolve, reject);
                    }
                },
                (_t, error) => {
                    console.log("Error checking users table existence:", error);
                    reject(error);
                    return false;
                }
            );
        }, (error) => {
            console.log("Transaction error:", error);
            reject(error);
        });
    });
};

const checkAndCreateAttendanceTable = (tx: any, resolve: () => void, reject: (error: any) => void) => {
    tx.executeSql(
        `SELECT name FROM sqlite_master WHERE type='table' AND name=?`,
        [TN_ATTENDANCE],
        (_tx: any, result: any) => {
            if (result.rows.length === 0) {
                console.log(`Creating table: ${TN_ATTENDANCE}`);
                tx.executeSql(
                    createTableQueryAttendance,
                    [],
                    () => {
                        console.log(`Table ${TN_ATTENDANCE} created successfully`);
                        resolve();
                    },
                    (_t: any, error: any) => {
                        console.log(`Error creating attendance table:`, error);
                        reject(error);
                        return false;
                    }
                );
            } else {
                console.log(`Table ${TN_ATTENDANCE} already exists, skipping creation`);
                resolve();
            }
        },
        (_t: any, error: any) => {
            console.log(`Error checking attendance table existence:`, error);
            reject(error);
            return false;
        }
    );
};