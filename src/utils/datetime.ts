// Shared formatting for SQLite "YYYY-MM-DD HH:MM:SS" punch timestamps, so the
// on-screen report, the modals and the Excel export all read times the same way.
// Parsing is done by string slicing (not `new Date(str)`) because that string is
// not a standard ISO format and Date parsing of it is engine-dependent.

/** "YYYY-MM-DD HH:MM:SS" → "h:mm AM/PM". Returns `empty` for missing/invalid input. */
export const formatPunchTime = (dt?: string | null, empty: string = '--:--'): string => {
  if (!dt) return empty;
  const hm = dt.substring(11, 16); // "HH:MM"
  const [hStr, m] = hm.split(':');
  let h = parseInt(hStr, 10);
  if (isNaN(h) || !m) return empty;
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${m} ${ampm}`;
};

/** Worked minutes between two punches, or null if missing/invalid (guards out <= in). */
export const punchDurationMinutes = (punchIn?: string | null, punchOut?: string | null): number | null => {
  if (!punchIn || !punchOut) return null;
  const a = new Date(punchIn.replace(' ', 'T')).getTime();
  const b = new Date(punchOut.replace(' ', 'T')).getTime();
  if (isNaN(a) || isNaN(b) || b <= a) return null;
  return Math.round((b - a) / 60000);
};

/** Duration as "HH:MM", or null when not computable. */
export const formatDurationHHMM = (punchIn?: string | null, punchOut?: string | null): string | null => {
  const mins = punchDurationMinutes(punchIn, punchOut);
  if (mins == null) return null;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

/** Duration as "Hh Mm" (e.g. "8h 5m"), or "" when not computable. */
export const formatDurationHm = (punchIn?: string | null, punchOut?: string | null): string => {
  const mins = punchDurationMinutes(punchIn, punchOut);
  if (mins == null) return '';
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
};
