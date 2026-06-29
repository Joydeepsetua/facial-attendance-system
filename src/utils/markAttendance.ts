import { captureFace, MultipleFacesDetected } from './faceCapture';
import { getAllUsers } from '../sqlite/service/user';
import { findBestMatch } from './face';
import { createAttendance, getTodayAttendance } from '../sqlite/service/attendance';

export type PunchAction = 'in' | 'out';

export type ScanOutcome =
  | { type: 'cancelled' }
  | { type: 'pending'; uuid: string; name: string; similarity: number; action: PunchAction }
  | {
      type: 'completed';
      name: string;
      employeeId: string | null;
      similarity: number;
      punchIn: string | null;
      punchOut: string | null;
    }
  | { type: 'error'; message: string };

/**
 * Open the camera, build an embedding and match it against registered users.
 * Resolves the matched user plus the action that WOULD be taken (punch in/out)
 * but records nothing — the caller confirms with the operator first, then calls
 * confirmAttendance().
 */
export const scanFaceForAttendance = async (): Promise<ScanOutcome> => {
  try {
    // Native CameraX screen: live preview + auto-capture, returns the embedding directly.
    const capture = await captureFace('recognize');
    if (!capture) {
      return { type: 'cancelled' };
    }
    const capturedEmbedding = capture.embedding;

    const users = await getAllUsers();
    if (users.length === 0) {
      return { type: 'error', message: 'No users found in database' };
    }

    const match = findBestMatch(capturedEmbedding, users);
    if (!match) {
      return { type: 'error', message: 'No matching user found' };
    }

    // Throws on a DB read error (vs. resolving null for "no record today"), so we never
    // mislabel the punch — a read failure surfaces as an error instead of a wrong action.
    const today = await getTodayAttendance(match.uuid);
    if (today && today.punchOut) {
      // Both punch-in and punch-out done for today — nothing left to record.
      return {
        type: 'completed',
        name: match.name,
        employeeId: match.employeeId ?? null,
        similarity: match.similarity,
        punchIn: today.punchIn,
        punchOut: today.punchOut,
      };
    }

    return {
      type: 'pending',
      uuid: match.uuid,
      name: match.name,
      similarity: match.similarity,
      action: today ? 'out' : 'in',
    };
  } catch (error: any) {
    if (error instanceof MultipleFacesDetected) {
      return { type: 'error', message: 'Multiple faces detected. Only one person at a time.' };
    }
    console.error('Error scanning face:', error);
    return { type: 'error', message: 'Failed to scan face' };
  }
};

/** Record the confirmed punch in/out for the matched user. */
export const confirmAttendance = (uuid: string) => createAttendance(uuid);
