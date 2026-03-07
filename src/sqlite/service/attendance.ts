import { getDBConnection } from "..";
import { TN_ATTENDANCE } from "../model/attendance";
import { TN_USERS } from "../model/user";
import uuid from 'react-native-uuid';

const db = getDBConnection();

export interface Attendance {
  id: string;
  user_id: string;
  user_name?: string;
  punch_in?: string;
  punch_out?: string;
  created_at?: string;
  is_active?: boolean;
}

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

// CREATE ATTENDANCE RECORD
export const createAttendance = async (userId: string): Promise<{ success: boolean; message: string }> => {
  if (!userId) {
    console.log("createAttendance error: userId is required");
    return { success: false, message: "User ID is required" };
  }

  return new Promise((resolve) => {
    const currentDateTime = formatDateForSQLite(new Date());
    // Using substr to match YYYY-MM-DD
    const queryCheck = `SELECT * FROM ${TN_ATTENDANCE} WHERE user_id = ? AND substr(created_at, 1, 10) = substr(?, 1, 10) AND is_active = 1`;
    
    db.transaction((tx) => {
      tx.executeSql(
        queryCheck,
        [userId, currentDateTime],
        (_tx, result) => {
          if (result.rows.length === 0) {
            // No record for today, punch in
            const attendanceId = uuid.v4() as string;
            const insertQuery = `INSERT INTO ${TN_ATTENDANCE} (id, user_id, punch_in, created_at, is_active) VALUES (?, ?, ?, ?, ?)`;
            tx.executeSql(
              insertQuery,
              [attendanceId, userId, currentDateTime, currentDateTime, 1],
              () => {
                console.log("Punch in successful for user:", userId);
                resolve({ success: true, message: "Punch-in successful!" });
              },
              (_t, error) => {
                console.log("Punch-in error: ", error);
                resolve({ success: false, message: "Failed to punch in" });
                return false;
              }
            );
          } else {
            // Record exists for today
            const record = result.rows.item(0);
            if (!record.punch_out) {
              // Not punched out yet
              const updateQuery = `UPDATE ${TN_ATTENDANCE} SET punch_out = ? WHERE id = ?`;
              tx.executeSql(
                updateQuery,
                [currentDateTime, record.id],
                () => {
                  console.log("Punch out successful for user:", userId);
                  resolve({ success: true, message: "Punch-out successful!" });
                },
                (_t, error) => {
                  console.log("Punch-out error: ", error);
                  resolve({ success: false, message: "Failed to punch out" });
                  return false;
                }
              );
            } else {
              // Already punched out
              console.log("Attendance already completed today for user:", userId);
              resolve({ success: false, message: "Attendance for today already completed!" });
            }
          }
        },
        (_t, error) => {
          console.log("Check attendance error: ", error);
          resolve({ success: false, message: "Database check failed" });
          return false;
        }
      );
    }, (error) => {
      console.log("Transaction error:", error);
      resolve({ success: false, message: "Transaction failed" });
    });
  });
};

// GET ALL ATTENDANCE RECORDS
export const getAllAttendance = async (): Promise<Attendance[]> => {
  return new Promise((resolve) => {
    const query = `SELECT 
      a.id, 
      a.user_id, 
      a.punch_in,
      a.punch_out,
      a.created_at, 
      a.is_active,
      u.name as user_name
    FROM ${TN_ATTENDANCE} a
    INNER JOIN ${TN_USERS} u ON a.user_id = u.uuid
    WHERE a.is_active = 1 AND u.is_active = 1
    ORDER BY a.created_at DESC`;
    
    db.transaction((tx) => {
      tx.executeSql(
        query,
        [],
        (_tx, result) => {
          const attendance: Attendance[] = [];
          
          for (let i = 0; i < result.rows.length; i++) {
            const item = result.rows.item(i);
            attendance.push({
              id: item.id,
              user_id: item.user_id,
              user_name: item.user_name,
              punch_in: item.punch_in,
              punch_out: item.punch_out,
              created_at: item.created_at,
              is_active: item.is_active === 1,
            });
          }
          
          resolve(attendance);
        },
        (_t, error) => {
          console.error("Error fetching attendance list:", error);
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

// GET ATTENDANCE BY USER ID
export const getAttendanceByUserId = async (userId: string): Promise<Attendance[]> => {
  return new Promise((resolve) => {
    const query = `SELECT * FROM ${TN_ATTENDANCE} WHERE user_id = ? AND is_active = 1 ORDER BY created_at DESC`;
    
    db.transaction((tx) => {
      tx.executeSql(
        query,
        [userId],
        (_tx, result) => {
          const attendance: Attendance[] = [];
          
          for (let i = 0; i < result.rows.length; i++) {
            const item = result.rows.item(i);
            attendance.push({
              id: item.id,
              user_id: item.user_id,
              punch_in: item.punch_in,
              punch_out: item.punch_out,
              created_at: item.created_at,
              is_active: item.is_active === 1,
            });
          }
          
          resolve(attendance);
        },
        (_t, error) => {
          console.error("Error fetching attendance by user id:", error);
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

// DELETE ATTENDANCE (soft delete - set is_active to 0)
export const deleteAttendance = async (attendanceId: string): Promise<boolean> => {
  if (!attendanceId) {
    console.log("deleteAttendance error: attendanceId is required");
    return false;
  }

  return new Promise((resolve) => {
    const query = `UPDATE ${TN_ATTENDANCE} SET is_active = 0 WHERE id = ?`;
    
    db.transaction((tx) => {
      tx.executeSql(
        query,
        [attendanceId],
        () => {
          console.log("Attendance deleted successfully:", attendanceId);
          resolve(true);
        },
        (_t, error) => {
          console.log("deleteAttendance error: ", error);
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
