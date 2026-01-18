import SQLite from 'react-native-sqlite-2';
import { createTableQureyUsers, TN_USERS } from './model/user';

const db = SQLite.openDatabase('FacialAttendance.db', '1.0', '', 1);

export const getDBConnection = () => {
    return db;
};

export const createTable = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            // Check if table exists
            tx.executeSql(
                `SELECT name FROM sqlite_master WHERE type='table' AND name=?`,
                [TN_USERS],
                (_tx, result) => {
                    if (result.rows.length === 0) {
                        // Table doesn't exist, create it
                        console.log(`Creating table: ${TN_USERS}`);
                        tx.executeSql(
                            createTableQureyUsers,
                            [],
                            () => {
                                console.log(`Table ${TN_USERS} created successfully`);
                                resolve();
                            },
                            (_t, error) => {
                                console.log("Error creating table:", error);
                                reject(error);
                                return false;
                            }
                        );
                    } else {
                        // Table already exists
                        console.log(`Table ${TN_USERS} already exists, skipping creation`);
                        resolve();
                    }
                },
                (_t, error) => {
                    console.log("Error checking table existence:", error);
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