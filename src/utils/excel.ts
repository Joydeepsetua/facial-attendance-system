import { NativeModules } from 'react-native';
import * as XLSX from 'xlsx-js-style';
import Share from 'react-native-share';

const FileExport = NativeModules.FileExport as
  | { writeBase64ToCache(base64: string, filename: string): Promise<string> }
  | undefined;

const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

interface ShareExcelOptions {
  sheetName?: string;
  colWidths?: number[]; // column widths in characters
  title?: string;
  subject?: string;
  boldHeader?: boolean; // bold the first (header) row
  boldLastRow?: boolean; // bold the last (e.g. TOTAL) row
}

const BOLD = { font: { bold: true } };

/**
 * Build a single-sheet .xlsx from an array of row objects, write it to a cache
 * file and open the system share sheet. Shared by the attendance and payroll
 * exports. Sharing a file:// path (not a data: URI) avoids react-native-share's
 * Uri.getScheme() NPE on some Android builds.
 */
export const shareRowsAsExcel = async (
  sheetData: Record<string, any>[],
  fileName: string,
  opts: ShareExcelOptions = {},
): Promise<void> => {
  const ws = XLSX.utils.json_to_sheet(sheetData);
  if (opts.colWidths) {
    ws['!cols'] = opts.colWidths.map((w) => ({ wch: w }));
  }

  // Apply bold to the header and/or last row.
  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
  const styleRow = (r: number) => {
    for (let c = range.s.c; c <= range.e.c; c++) {
      const addr = XLSX.utils.encode_cell({ r, c });
      const cell = ws[addr];
      if (cell) cell.s = { ...(cell.s || {}), ...BOLD };
    }
  };
  if (opts.boldHeader) styleRow(range.s.r);
  if (opts.boldLastRow) styleRow(range.e.r);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, opts.sheetName || 'Sheet1');
  const base64 = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });

  if (!FileExport) {
    throw new Error('FileExport native module not linked — rebuild the app.');
  }

  const path = await FileExport.writeBase64ToCache(base64, fileName);

  await Share.open({
    title: opts.title || 'Export',
    subject: opts.subject || opts.title,
    failOnCancel: false,
    filename: fileName,
    url: `file://${path}`,
    type: XLSX_MIME,
  });
};

/**
 * Share an already-built worksheet (for custom layouts like a payroll register
 * with a company header block). Handles the workbook → base64 → file → share steps.
 */
export const shareWorksheet = async (
  ws: any,
  fileName: string,
  opts: { sheetName?: string; title?: string; subject?: string } = {},
): Promise<void> => {
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, opts.sheetName || 'Sheet1');
  const base64 = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });

  if (!FileExport) {
    throw new Error('FileExport native module not linked — rebuild the app.');
  }
  const path = await FileExport.writeBase64ToCache(base64, fileName);

  await Share.open({
    title: opts.title || 'Export',
    subject: opts.subject || opts.title,
    failOnCancel: false,
    filename: fileName,
    url: `file://${path}`,
    type: XLSX_MIME,
  });
};
