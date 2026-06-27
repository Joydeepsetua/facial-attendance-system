// Shared field validators. Optional fields are only validated when a value is
// entered; empty values pass so users can leave them blank.

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 4 letters + '0' + 6 alphanumerics, e.g. SBIN0001234
const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;
// 5 letters + 4 digits + 1 letter, e.g. ABCDE1234F
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
// Universal Account Number: exactly 12 digits
const UAN_REGEX = /^[0-9]{12}$/;
// GSTIN: 2-digit state + 10-char PAN + entity digit + 'Z' + checksum char
const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
// Website: optional scheme, a dotted domain, optional path/query
const WEBSITE_REGEX = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/\S*)?$/i;

export const validateEmail = (value: string): string | undefined =>
  !value.trim() || EMAIL_REGEX.test(value.trim()) ? undefined : 'Enter a valid email address';

export const validateIfsc = (value: string): string | undefined =>
  !value.trim() || IFSC_REGEX.test(value.trim().toUpperCase()) ? undefined : 'Enter a valid IFSC code';

export const validatePan = (value: string): string | undefined =>
  !value.trim() || PAN_REGEX.test(value.trim().toUpperCase()) ? undefined : 'Enter a valid PAN';

export const validateUan = (value: string): string | undefined =>
  !value.trim() || UAN_REGEX.test(value.trim()) ? undefined : 'UAN must be 12 digits';

// Accepts 10–13 digits after stripping spaces, hyphens and a leading '+'/country code.
export const validatePhone = (value: string): string | undefined => {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const digits = trimmed.replace(/[\s-]/g, '').replace(/^\+/, '');
  return /^[0-9]{10,13}$/.test(digits) ? undefined : 'Enter a valid phone number';
};

export const validateWebsite = (value: string): string | undefined =>
  !value.trim() || WEBSITE_REGEX.test(value.trim()) ? undefined : 'Enter a valid website URL';

export const validateGstin = (value: string): string | undefined =>
  !value.trim() || GSTIN_REGEX.test(value.trim().toUpperCase()) ? undefined : 'Enter a valid GSTIN';
