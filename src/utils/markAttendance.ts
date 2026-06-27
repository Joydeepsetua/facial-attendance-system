import { NativeModules } from 'react-native';
import { openCamera } from './camera';
import { getAllUsers } from '../sqlite/service/user';
import { findBestMatch } from './face';
import { createAttendance, getTodayAttendanceAction } from '../sqlite/service/attendance';

export type PunchAction = 'in' | 'out';

export type ScanOutcome =
  | { type: 'cancelled' }
  | { type: 'pending'; uuid: string; name: string; similarity: number; action: PunchAction }
  | { type: 'error'; message: string };

/**
 * Open the camera, build an embedding and match it against registered users.
 * Resolves the matched user plus the action that WOULD be taken (punch in/out)
 * but records nothing — the caller confirms with the operator first, then calls
 * confirmAttendance().
 */
export const scanFaceForAttendance = async (): Promise<ScanOutcome> => {
  try {
    const base64Image = await openCamera();
    if (!base64Image) {
      return { type: 'cancelled' };
    }

    const embeddingStr = await NativeModules.FaceEmbedding.getEmbedding(base64Image);
    const capturedEmbedding = embeddingStr.split(',').map(Number);

    const users = await getAllUsers();
    if (users.length === 0) {
      return { type: 'error', message: 'No users found in database' };
    }

    const match = findBestMatch(capturedEmbedding, users);
    if (!match) {
      return { type: 'error', message: 'No matching user found' };
    }

    const action = await getTodayAttendanceAction(match.uuid);
    if (action === 'completed') {
      return { type: 'error', message: 'Attendance for today already completed!' };
    }

    return {
      type: 'pending',
      uuid: match.uuid,
      name: match.name,
      similarity: match.similarity,
      action,
    };
  } catch (error: any) {
    console.error('Error scanning face:', error);
    const errorMessage = error?.message || error?.toString() || '';
    if (errorMessage.includes('No face detected')) {
      return { type: 'error', message: 'No face detected' };
    }
    return { type: 'error', message: 'Failed to scan face' };
  }
};

/** Record the confirmed punch in/out for the matched user. */
export const confirmAttendance = (uuid: string) => createAttendance(uuid);
