export const TN_ORGANIZATION = 'organization';

// Single-row table (id is always 1) holding the company profile used on
// payslips / payroll documents — name, logo, contact details and tax ids.
export const createTableQueryOrganization = `CREATE TABLE IF NOT EXISTS ${TN_ORGANIZATION} (
  id INTEGER PRIMARY KEY,
  name TEXT,
  logo TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  website TEXT,
  gstin TEXT,
  pan TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;
