// Remote API configuration for the Feedback module — TEMPLATE.
//
// SETUP: copy this file to `config.ts` (same folder) and fill in the values.
//   cp src/constants/config.example.ts src/constants/config.ts
//
// `config.ts` is gitignored so the API key never lands in source control. This
// template IS committed so a fresh clone / CI has the module shape to copy from.
// While the values below are empty, submitting feedback fails fast with a clear
// "not configured" message instead of a confusing network error.

// ---- Feedback submit service ----
export const FEEDBACK_API_BASE_URL = ''; // e.g. 'https://api.example.com' (no trailing slash)
export const FEEDBACK_SUBMIT_PATH = '/feedback';

// ---- Image upload service (returns { data: { publicUrl } }) ----
export const FEEDBACK_IMAGE_UPLOAD_BASE_URL = ''; // e.g. 'https://uploads.example.com/api'
export const FEEDBACK_IMAGE_UPLOAD_PATH = '/upload';
export const FEEDBACK_IMAGE_UPLOAD_API_TOKEN = ''; // sent as the `x-api-key` header

/** True once the feedback submit service has a base URL. */
export const isFeedbackApiConfigured = () => FEEDBACK_API_BASE_URL.trim().length > 0;

/** True once the image upload service has both a base URL and an API key. */
export const isFeedbackImageUploadConfigured = () =>
  FEEDBACK_IMAGE_UPLOAD_BASE_URL.trim().length > 0 && FEEDBACK_IMAGE_UPLOAD_API_TOKEN.trim().length > 0;
