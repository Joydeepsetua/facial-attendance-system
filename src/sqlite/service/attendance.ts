import { getDBConnection } from "..";
import { TN_ATTENDANCE } from "../model/attendance";
import { TN_USERS } from "../model/user";
import uuid from 'react-native-uuid';

const db = getDBConnection();

export interface Attendance {
  id: string;
  user_id: string;
  user_name?: string;
  user_phone?: string;
  user_employee_id?: string;
  punch_in?: string;
  punch_out?: string;
  created_at?: string;
  is_active?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
  };
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

// PEEK TODAY'S ATTENDANCE for a user — returns the current record (if any) so the
// caller can decide the next action (in/out/completed) and show punch times,
// without recording anything.
export interface TodayAttendance {
  punchIn: string | null;
  punchOut: string | null;
}

export const getTodayAttendance = async (
  userId: string
): Promise<TodayAttendance | null> => {
  return new Promise((resolve, reject) => {
    const currentDateTime = formatDateForSQLite(new Date());
    const query = `SELECT punch_in, punch_out FROM ${TN_ATTENDANCE} WHERE user_id = ? AND substr(created_at, 1, 10) = substr(?, 1, 10) AND is_active = 1`;
    db.transaction((tx) => {
      tx.executeSql(
        query,
        [userId, currentDateTime],
        (_tx, result) => {
          if (result.rows.length === 0) {
            // No record today — distinct from a read failure (which rejects below),
            // so the caller never mislabels the punch action.
            resolve(null);
          } else {
            const row = result.rows.item(0);
            resolve({ punchIn: row.punch_in ?? null, punchOut: row.punch_out ?? null });
          }
        },
        (_t, error) => {
          console.log("getTodayAttendance error: ", error);
          reject(error);
          return false;
        }
      );
    }, (txError) => {
      console.log("getTodayAttendance tx error: ", txError);
      reject(txError);
    });
  });
};

// GET ALL ATTENDANCE RECORDS (With Filters & API-like Pagination)
export const getAllAttendance = async (
  searchQuery: string = "",
  startDate: string = "",
  endDate: string = "",
  limit: number = 20,
  page: number = 1
): Promise<PaginatedResponse<Attendance>> => {
  return new Promise((resolve) => {
    // Shared WHERE clause and params for both COUNT and SELECT
    let whereClause = `WHERE a.is_active = 1 AND u.is_active = 1`;
    const params: any[] = [];
    
    // 1. Search by Name
    if (searchQuery.trim() !== "") {
      whereClause += ` AND u.name LIKE ?`;
      params.push(`%${searchQuery.trim()}%`);
    }

    // 2. Date Range Filter
    if (startDate && endDate) {
      whereClause += ` AND substr(a.created_at, 1, 10) BETWEEN ? AND ?`;
      params.push(startDate, endDate);
    } else if (startDate) {
      whereClause += ` AND substr(a.created_at, 1, 10) >= ?`;
      params.push(startDate);
    } else if (endDate) {
      whereClause += ` AND substr(a.created_at, 1, 10) <= ?`;
      params.push(endDate);
    }

    // Step 1: Get Total Count
    const countQuery = `SELECT COUNT(*) as total FROM ${TN_ATTENDANCE} a INNER JOIN ${TN_USERS} u ON a.user_id = u.uuid ${whereClause}`;

    db.transaction((tx) => {
      tx.executeSql(
        countQuery,
        params,
        (_tx, countResult) => {
          const totalCount = countResult.rows.item(0).total;
          const totalPages = Math.ceil(totalCount / limit);
          const offset = (page - 1) * limit;

          // Step 2: Get Paginated Data
          const dataQuery = `SELECT 
            a.id, 
            a.user_id, 
            a.punch_in,
            a.punch_out,
            a.created_at,
            a.is_active,
            u.name as user_name,
            u.phone as user_phone,
            u.employee_id as user_employee_id
          FROM ${TN_ATTENDANCE} a
          INNER JOIN ${TN_USERS} u ON a.user_id = u.uuid
          ${whereClause}
          ORDER BY a.created_at DESC 
          LIMIT ? OFFSET ?`;
          
          const dataParams = [...params, limit, offset];

          _tx.executeSql(
            dataQuery,
            dataParams,
            (__tx, dataResult) => {
              const attendance: Attendance[] = [];
              for (let i = 0; i < dataResult.rows.length; i++) {
                const item = dataResult.rows.item(i);
                attendance.push({
                  id: item.id,
                  user_id: item.user_id,
                  user_name: item.user_name,
                  user_phone: item.user_phone,
                  user_employee_id: item.user_employee_id,
                  punch_in: item.punch_in,
                  punch_out: item.punch_out,
                  created_at: item.created_at,
                  is_active: item.is_active === 1,
                });
              }
              
              resolve({
                data: attendance,
                pagination: {
                  currentPage: page,
                  totalPages,
                  totalCount,
                  limit,
                }
              });
            },
            (__t, error) => {
              console.error("Error fetching attendance data:", error);
              resolve({ data: [], pagination: { currentPage: page, totalPages: 0, totalCount: 0, limit } });
              return false;
            }
          );
        },
        (_t, error) => {
          console.error("Error fetching attendance count:", error);
          resolve({ data: [], pagination: { currentPage: page, totalPages: 0, totalCount: 0, limit } });
          return false;
        }
      );
    }, (error) => {
      console.error("Transaction error:", error);
      resolve({ data: [], pagination: { currentPage: page, totalPages: 0, totalCount: 0, limit } });
    });
  });
};

// Roster row — one entry per (day × active user) across a date range, present or not.
export interface RosterEntry {
  day: string; // YYYY-MM-DD
  user_id: string;
  user_name: string;
  user_phone?: string;
  user_employee_id?: string;
  punch_in?: string;
  punch_out?: string;
  status: 'present' | 'absent';
}

export type RosterStatus = 'all' | 'present' | 'absent';

// GET ATTENDANCE ROSTER — for every day in [startDate, endDate] and every active
// user, returns their attendance for that day (status 'present') or an 'absent'
// entry when there's no record. A recursive CTE generates the calendar days, then
// each day is cross-joined with users and left-joined onto attendance. Supports a
// status filter (all/present/absent), name search and pagination.
export const getAttendanceRoster = async (
  startDate: string,
  endDate: string,
  status: RosterStatus = "all",
  searchQuery: string = "",
  limit: number = 20,
  page: number = 1
): Promise<PaginatedResponse<RosterEntry>> => {
  return new Promise((resolve) => {
    const emptyResponse: PaginatedResponse<RosterEntry> = {
      data: [],
      pagination: { currentPage: page, totalPages: 0, totalCount: 0, limit },
    };

    if (!startDate || !endDate) {
      resolve(emptyResponse);
      return;
    }

    // Filters shared by the COUNT and SELECT queries.
    let filters = "";
    const filterParams: any[] = [];
    if (searchQuery.trim() !== "") {
      filters += ` AND u.name LIKE ?`;
      filterParams.push(`%${searchQuery.trim()}%`);
    }
    if (status === "present") filters += ` AND a.punch_in IS NOT NULL`;
    else if (status === "absent") filters += ` AND a.punch_in IS NULL`;

    // Build the date series in JS (so absent days still appear in the roster).
    const days: string[] = [];
    const cursor = new Date(`${startDate}T12:00:00`);
    const lastDay = new Date(`${endDate}T12:00:00`);
    let guard = 0;
    while (cursor <= lastDay && guard < 1000) {
      const y = cursor.getFullYear();
      const m = String(cursor.getMonth() + 1).padStart(2, "0");
      const d = String(cursor.getDate()).padStart(2, "0");
      days.push(`${y}-${m}-${d}`);
      cursor.setDate(cursor.getDate() + 1);
      guard++;
    }

    if (days.length === 0) {
      resolve(emptyResponse);
      return;
    }

    // The date series goes in a FROM subquery (not a leading `WITH` CTE) because
    // react-native-sqlite-2 routes any statement not starting with SELECT to
    // execSQL, which rejects row-returning queries ("Queries can be performed
    // using SQLiteDatabase query or rawQuery methods only.").
    const datesSubquery = days
      .map((_, i) => (i === 0 ? "SELECT ? AS d" : "SELECT ?"))
      .join(" UNION ALL ");

    const fromWhere = `FROM (${datesSubquery}) d
      CROSS JOIN ${TN_USERS} u
      LEFT JOIN ${TN_ATTENDANCE} a
        ON a.user_id = u.uuid
        AND a.is_active = 1
        AND substr(a.created_at, 1, 10) = d.d
      WHERE u.is_active = 1${filters}`;

    const countQuery = `SELECT COUNT(*) as total ${fromWhere}`;
    const countParams = [...days, ...filterParams];

    db.transaction((tx) => {
      tx.executeSql(
        countQuery,
        countParams,
        (_tx, countResult) => {
          const totalCount = countResult.rows.item(0).total;
          const totalPages = Math.ceil(totalCount / limit);
          const offset = (page - 1) * limit;

          const dataQuery = `SELECT
              d.d as day,
              u.uuid as user_id,
              u.name as user_name,
              u.phone as user_phone,
              u.employee_id as user_employee_id,
              a.punch_in,
              a.punch_out
            ${fromWhere}
            ORDER BY d.d DESC, (a.punch_in IS NULL) ASC, u.name COLLATE NOCASE ASC
            LIMIT ? OFFSET ?`;
          const dataParams = [...days, ...filterParams, limit, offset];

          _tx.executeSql(
            dataQuery,
            dataParams,
            (__tx, dataResult) => {
              const roster: RosterEntry[] = [];
              for (let i = 0; i < dataResult.rows.length; i++) {
                const item = dataResult.rows.item(i);
                roster.push({
                  day: item.day,
                  user_id: item.user_id,
                  user_name: item.user_name,
                  user_phone: item.user_phone,
                  user_employee_id: item.user_employee_id,
                  punch_in: item.punch_in,
                  punch_out: item.punch_out,
                  status: item.punch_in ? 'present' : 'absent',
                });
              }
              resolve({
                data: roster,
                pagination: { currentPage: page, totalPages, totalCount, limit },
              });
            },
            (__t, error) => {
              console.error("Error fetching roster data:", error);
              resolve(emptyResponse);
              return false;
            }
          );
        },
        (_t, error) => {
          console.error("Error fetching roster count:", error);
          resolve(emptyResponse);
          return false;
        }
      );
    }, (error) => {
      console.error("Transaction error:", error);
      resolve(emptyResponse);
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
