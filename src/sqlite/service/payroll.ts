import { getDBConnection } from "..";
import { TN_USERS } from "../model/user";
import { TN_ATTENDANCE } from "../model/attendance";
import { SalaryType } from "./user";

const db = getDBConnection();

export interface PayrollEntry {
  uuid: string;
  name: string;
  employee_id?: string;
  salary_type: SalaryType;
  salary_amount: number; // daily: one day's pay; fixed: whole month's salary
  present_days: number;
  pay: number; // computed payable for the month
  // Payment details — used in the payroll Excel so payouts can be made directly.
  bank_account?: string;
  ifsc?: string;
}

// Compute the payable amount for one employee for the month.
// daily  → present days × per-day amount
// fixed  → whole monthly salary (attendance doesn't reduce it)
const computePay = (type: SalaryType, amount: number, presentDays: number): number => {
  if (!amount) return 0;
  if (type === 'daily') return presentDays * amount;
  return amount; // 'fixed' (and anything else) → full stored amount
};

// PAYROLL for [startDate, endDate] (one calendar month). Returns every active user
// with their present-day count in the range and the computed pay.
export const getPayroll = async (
  startDate: string,
  endDate: string
): Promise<PayrollEntry[]> => {
  return new Promise((resolve) => {
    if (!startDate || !endDate) {
      resolve([]);
      return;
    }

    // present_days = distinct calendar days in the range with a punch-in for that user.
    const query = `SELECT
        u.uuid as uuid,
        u.name as name,
        u.employee_id as employee_id,
        u.salary_type as salary_type,
        u.salary_amount as salary_amount,
        u.bank_account as bank_account,
        u.ifsc as ifsc,
        COUNT(DISTINCT CASE WHEN a.punch_in IS NOT NULL THEN substr(a.created_at, 1, 10) END) as present_days
      FROM ${TN_USERS} u
      LEFT JOIN ${TN_ATTENDANCE} a
        ON a.user_id = u.uuid
        AND a.is_active = 1
        AND substr(a.created_at, 1, 10) BETWEEN ? AND ?
      WHERE u.is_active = 1
      GROUP BY u.uuid
      ORDER BY u.name COLLATE NOCASE ASC`;

    db.transaction((tx) => {
      tx.executeSql(
        query,
        [startDate, endDate],
        (_tx, result) => {
          const list: PayrollEntry[] = [];
          for (let i = 0; i < result.rows.length; i++) {
            const r = result.rows.item(i);
            const type = (r.salary_type ?? '') as SalaryType;
            const amount = r.salary_amount ?? 0;
            const presentDays = r.present_days ?? 0;
            list.push({
              uuid: r.uuid,
              name: r.name,
              employee_id: r.employee_id ?? undefined,
              salary_type: type,
              salary_amount: amount,
              present_days: presentDays,
              pay: computePay(type, amount, presentDays),
              bank_account: r.bank_account ?? undefined,
              ifsc: r.ifsc ?? undefined,
            });
          }
          resolve(list);
        },
        (_t, error) => {
          console.error("Error fetching payroll:", error);
          resolve([]);
          return false;
        }
      );
    }, (error) => {
      console.error("Payroll transaction error:", error);
      resolve([]);
    });
  });
};
