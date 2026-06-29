import * as XLSX from 'xlsx-js-style';
import { PayrollEntry } from '../sqlite/service/payroll';
import { Organization } from '../sqlite/service/organization';
import { shareWorksheet } from './excel';

const COLS = 7; // S.No, Employee ID, Name, Paid Days, Account Number, IFSC, Amount
const lastCol = COLS - 1;

// Cell-style presets (xlsx-js-style).
const center = { horizontal: 'center' as const };
const companyStyle = { font: { bold: true, sz: 15 }, alignment: center };
const subStyle = { font: { sz: 10, color: { rgb: '7A8398' } }, alignment: center };
const titleStyle = { font: { bold: true, sz: 12 }, alignment: center };
const headerStyle = {
  font: { bold: true, color: { rgb: 'FFFFFF' } },
  fill: { fgColor: { rgb: '1E66E0' } },
  alignment: center,
};
const boldStyle = { font: { bold: true } };

/**
 * Build a standard payroll register .xlsx for one month and open the share sheet.
 * Layout: company header block → month title → table (bold header) → bold TOTAL row.
 * Returns false if there's nothing to export.
 */
export const exportPayrollToExcel = async (
  entries: PayrollEntry[],
  meta: { year: number; month: number; monthLabel: string },
  org: Organization | null,
): Promise<boolean> => {
  if (!entries || entries.length === 0) return false;

  const daysInMonth = new Date(meta.year, meta.month + 1, 0).getDate();
  const paidDaysOf = (e: PayrollEntry) =>
    e.salary_type === 'daily' ? e.present_days : daysInMonth;
  const totalPay = entries.reduce((s, e) => s + e.pay, 0);

  // --- Build rows (array of arrays) so we can prepend a company header block ---
  const rows: any[][] = [];
  const merges: any[] = [];
  const blank = () => Array(COLS).fill('');

  const companyName = org?.name && org.name.trim() ? org.name : 'Company Name';
  rows.push([companyName, ...Array(COLS - 1).fill('')]);
  if (org?.address) rows.push([org.address, ...Array(COLS - 1).fill('')]);
  const contact = [org?.phone, org?.email, org?.gstin ? `GSTIN: ${org.gstin}` : null]
    .filter(Boolean).join('   |   ');
  if (contact) rows.push([contact, ...Array(COLS - 1).fill('')]);
  rows.push(blank());
  rows.push([`Payroll Register — ${meta.monthLabel}`, ...Array(COLS - 1).fill('')]);
  rows.push(blank());

  // Merge each header-block row across all columns.
  for (let r = 0; r < rows.length; r++) {
    const firstCell = rows[r][0];
    if (firstCell !== '') merges.push({ s: { r, c: 0 }, e: { r, c: lastCol } });
  }

  const headerRowIdx = rows.length;
  rows.push(['S.No', 'Employee ID', 'Name', 'Paid Days', 'Account Number', 'IFSC', 'Amount']);

  entries.forEach((e, i) => {
    rows.push([
      i + 1,
      e.employee_id || '',
      e.name || '',
      paidDaysOf(e),
      e.bank_account || '',
      e.ifsc || '',
      e.pay,
    ]);
  });

  const totalRowIdx = rows.length;
  rows.push(['TOTAL', '', '', '', '', '', totalPay]);
  // Merge the "TOTAL" label across all columns except the Amount column.
  merges.push({ s: { r: totalRowIdx, c: 0 }, e: { r: totalRowIdx, c: lastCol - 1 } });

  // --- Worksheet + styling ---
  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!merges'] = merges;
  ws['!cols'] = [6, 12, 24, 11, 20, 14, 14].map((w) => ({ wch: w }));

  const setStyle = (r: number, c: number, s: any) => {
    const addr = XLSX.utils.encode_cell({ r, c });
    if (ws[addr]) ws[addr].s = s;
  };

  // Header block styles (first cell of each merged row).
  let r = 0;
  setStyle(r++, 0, companyStyle);
  if (org?.address) setStyle(r++, 0, subStyle);
  if (contact) setStyle(r++, 0, subStyle);
  r++; // blank
  setStyle(r, 0, titleStyle);

  // Table header row (bold, filled).
  for (let c = 0; c < COLS; c++) setStyle(headerRowIdx, c, headerStyle);
  // Total row: merged "TOTAL" label centered + bold, amount bold.
  setStyle(totalRowIdx, 0, { font: { bold: true }, alignment: center });
  setStyle(totalRowIdx, lastCol, boldStyle);

  const mm = String(meta.month + 1).padStart(2, '0');
  await shareWorksheet(ws, `payroll_${meta.year}-${mm}.xlsx`, {
    sheetName: 'Payroll',
    title: 'Payroll',
    subject: `Payroll — ${meta.monthLabel}`,
  });

  return true;
};
