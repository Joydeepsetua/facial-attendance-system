import { generatePDF } from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import { User } from '../sqlite/service/user';
import { Organization } from '../sqlite/service/organization';
import { rupeesInWords } from './numberToWords';

export interface PayslipData {
  user: User | null;
  org: Organization | null;
  monthLabel: string;
  totalDays: number;
  paidDays: number;
  present: number;
  absent: number;
  isDaily: boolean;
  salaryAmount: number;
  pay: number;
}

const money = (n: number) => `Rs. ${(n || 0).toLocaleString('en-IN')}`;
const esc = (s?: string | null) =>
  (s == null || String(s).trim() === '' ? '—' : String(s))
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const row = (label: string, value?: string | null) =>
  `<div class="cell"><div class="lbl">${label}</div><div class="val">${esc(value)}</div></div>`;

const buildHtml = (d: PayslipData): string => {
  const company = d.org?.name && d.org.name.trim() ? esc(d.org.name) : 'Company Name';
  const contact = [d.org?.phone, d.org?.email].filter(Boolean).map(esc).join(' &nbsp;·&nbsp; ');
  const earnLabel = d.isDaily
    ? `Wages (${d.present} × ${money(d.salaryAmount)})`
    : 'Basic Salary';

  return `<!DOCTYPE html><html><head><meta charset="utf-8" />
  <style>
    * { box-sizing: border-box; }
    body { font-family: -apple-system, Roboto, Arial, sans-serif; color: #1A2233; margin: 0; padding: 24px; }
    .sheet { border: 1px solid #E2E8F0; border-radius: 10px; padding: 24px; }
    .center { text-align: center; }
    .letterhead { position: relative; text-align: center; min-height: 56px; }
    .logo { position: absolute; left: 0; top: 0; height: 56px; width: auto; object-fit: contain; }
    .company { font-size: 22px; font-weight: 800; }
    .muted { color: #7A8398; font-size: 12px; }
    .hr { height: 1px; background: #E2E8F0; margin: 16px 0; }
    .title { color: #1E66E0; font-size: 18px; font-weight: 800; letter-spacing: .5px; }
    .section { font-size: 12px; font-weight: 800; color: #1E66E0; letter-spacing: .8px; margin: 22px 0 10px; }
    .grid { display: flex; flex-wrap: wrap; }
    .cell { width: 50%; margin-bottom: 12px; }
    .lbl { font-size: 11px; color: #7A8398; }
    .val { font-size: 14px; font-weight: 600; }
    table { width: 100%; border-collapse: collapse; }
    td { padding: 9px 0; border-bottom: 1px solid #EAEEF5; font-size: 13.5px; }
    td.amt { text-align: right; font-weight: 600; }
    tr.gross td { border-bottom: none; font-weight: 800; font-size: 15px; }
    .net { background: #EAF1FF; border-radius: 10px; padding: 14px; margin-top: 16px; }
    .net-top { display: flex; justify-content: space-between; align-items: center; }
    .net-lbl { font-size: 15px; font-weight: 800; }
    .net-val { font-size: 20px; font-weight: 800; color: #1E66E0; }
    .net-words { font-size: 12.5px; font-style: italic; color: #7A8398; margin-top: 6px; }
    .footer { text-align: center; color: #7A8398; font-size: 11px; margin-top: 18px; }
    .watermark { text-align: center; color: #C5CCD6; font-size: 11px; font-weight: 700; letter-spacing: 2px; margin-top: 26px; }
  </style></head>
  <body><div class="sheet">
    <div class="letterhead">
      ${d.org?.logo ? `<img class="logo" src="data:image/jpeg;base64,${d.org.logo}" />` : ''}
      <div class="company">${company}</div>
      ${d.org?.address ? `<div class="muted">${esc(d.org.address)}</div>` : ''}
      ${contact ? `<div class="muted">${contact}</div>` : ''}
    </div>
    <div class="hr"></div>
    <div class="center title">PAYSLIP</div>
    <div class="center muted">For the month of ${esc(d.monthLabel)}</div>

    <div class="section">EMPLOYEE DETAILS</div>
    <div class="grid">
      ${row('Name', d.user?.name)}
      ${row('Employee ID', d.user?.employee_id)}
      ${row('PAN', d.user?.pan)}
      ${row('UAN', d.user?.uan)}
      ${row('PF No.', d.user?.pf)}
      ${row('ESI No.', d.user?.esi)}
      ${row('Bank A/C', d.user?.bank_account)}
      ${row('IFSC', d.user?.ifsc)}
    </div>

    <div class="section">ATTENDANCE</div>
    <div class="grid">
      ${row('Total Days', String(d.totalDays))}
      ${row('Paid Days', String(d.paidDays))}
      ${row('Present', String(d.present))}
      ${row('LOP / Absent', String(d.absent))}
    </div>

    <div class="section">EARNINGS</div>
    <table>
      <tr><td>${earnLabel}</td><td class="amt">${money(d.pay)}</td></tr>
      <tr class="gross"><td>Gross Earnings</td><td class="amt">${money(d.pay)}</td></tr>
    </table>

    <div class="net">
      <div class="net-top"><div class="net-lbl">Net Pay</div><div class="net-val">${money(d.pay)}</div></div>
      <div class="net-words">${rupeesInWords(d.pay)}</div>
    </div>

    <div class="footer">This is a computer-generated payslip and does not require a signature.</div>
  </div>
  <div class="watermark">Powered by FaceTen</div>
  </body></html>`;
};

/** Generate a PDF payslip and open the share sheet. */
export const sharePayslipPdf = async (d: PayslipData): Promise<void> => {
  const html = buildHtml(d);
  const safeName = (d.user?.name || 'employee').replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `payslip_${safeName}_${d.monthLabel.replace(/\s+/g, '_')}`;

  const { filePath } = await generatePDF({ html, fileName, padding: 0 });
  if (!filePath) throw new Error('Could not generate PDF');

  await Share.open({
    title: 'Payslip',
    subject: `Payslip — ${d.user?.name || ''} (${d.monthLabel})`,
    failOnCancel: false,
    filename: `${fileName}.pdf`,
    url: filePath.startsWith('file://') ? filePath : `file://${filePath}`,
    type: 'application/pdf',
  });
};
