import { NativeModules } from 'react-native';
import * as XLSX from 'xlsx';
import Share from 'react-native-share';
import { RosterEntry } from '../sqlite/service/attendance';
import { formatPunchTime, formatDurationHm } from './datetime';

const FileExport = NativeModules.FileExport as
  | { writeBase64ToCache(base64: string, filename: string): Promise<string> }
  | undefined;

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

  const ws = XLSX.utils.json_to_sheet(sheetData);
  ws['!cols'] = [
    { wch: 12 }, { wch: 12 }, { wch: 22 }, { wch: 14 },
    { wch: 10 }, { wch: 11 }, { wch: 11 }, { wch: 12 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Attendance');

  const base64 = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });

  const range = meta.startDate === meta.endDate ? meta.startDate : `${meta.startDate}_to_${meta.endDate}`;
  const fileName = `attendance_${range}.xlsx`;
  const mime = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

  if (!FileExport) {
    throw new Error('FileExport native module not linked — rebuild the app.');
  }

  // Write to a real file and share its file:// path. Sharing a data: URI directly
  // crashes react-native-share with a Uri.getScheme() NPE on some devices.
  const path = await FileExport.writeBase64ToCache(base64, fileName);

  await Share.open({
    title: 'Attendance Report',
    subject: `Attendance Report (${range})`,
    failOnCancel: false,
    filename: fileName,
    url: `file://${path}`,
    type: mime,
  });

  return true;
};
