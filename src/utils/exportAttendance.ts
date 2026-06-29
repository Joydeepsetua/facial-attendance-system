import { RosterEntry } from '../sqlite/service/attendance';
import { formatPunchTime, formatDurationHm } from './datetime';
import { shareRowsAsExcel } from './excel';

/**
 * Build an .xlsx from the roster rows and open the system share sheet so the user
 * can save/send it. Returns false if there's nothing to export.
 */
export const exportAttendanceToExcel = async (
  rows: RosterEntry[],
  meta: { startDate: string; endDate: string },
): Promise<boolean> => {
  if (!rows || rows.length === 0) return false;

  const sheetData = rows.map((r) => ({
    Date: r.day,
    'Employee ID': r.user_employee_id || '',
    Name: r.user_name || '',
    Phone: r.user_phone || '',
    Status: r.status === 'present' ? 'Present' : 'Absent',
    'In Time': formatPunchTime(r.punch_in, ''),
    'Out Time': formatPunchTime(r.punch_out, ''),
    'Total Hours': formatDurationHm(r.punch_in, r.punch_out),
  }));

  const range = meta.startDate === meta.endDate ? meta.startDate : `${meta.startDate}_to_${meta.endDate}`;

  await shareRowsAsExcel(sheetData, `attendance_${range}.xlsx`, {
    sheetName: 'Attendance',
    colWidths: [12, 12, 22, 14, 10, 11, 11, 12],
    title: 'Attendance Report',
    subject: `Attendance Report (${range})`,
    boldHeader: true,
  });

  return true;
};
