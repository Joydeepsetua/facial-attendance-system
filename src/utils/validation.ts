// Shared field validators. Optional fields are only validated when a value is
// entered; empty values pass so users can leave them blank.

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 4 letters + '0' + 6 alphanumerics, e.g. SBIN0001234
const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;
// 5 letters + 4 digits + 1 letter, e.g. ABCDE1234F
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
// Universal Account Number: exactly 12 digits
const UAN_REGEX = /^[0-9]{12}$/;

export const validateEmail = (value: string): string | undefined =>
  !value.trim() || EMAIL_REGEX.test(value.trim()) ? undefined : 'Enter a valid email address';

export const validateIfsc = (value: string): string | undefined =>
  !value.trim() || IFSC_REGEX.test(value.trim().toUpperCase()) ? undefined : 'Enter a valid IFSC code';

export const validatePan = (value: string): string | undefined =>
  !value.trim() || PAN_REGEX.test(value.trim().toUpperCase()) ? undefined : 'Enter a valid PAN';

export const validateUan = (value: string): string | undefined =>
  !value.trim() || UAN_REGEX.test(value.trim()) ? undefined : 'UAN must be 12 digits';
