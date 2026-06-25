import { NativeModules } from 'react-native';
import { openCamera } from './camera';
import { getAllUsers } from '../sqlite/service/user';
import { findBestMatch } from './face';
import { createAttendance } from '../sqlite/service/attendance';

export type AttendanceOutcome =
  | { type: 'cancelled' }
  | { type: 'success'; name: string; similarity: number; message: string }
  | { type: 'error'; message: string };

/**
 * Full "mark attendance" flow: open the camera, build an embedding, match it
 * against registered users and record attendance. Returns a structured result
 * so the caller can decide how to present it (no navigation involved).
 */
export const runMarkAttendance = async (): Promise<AttendanceOutcome> => {
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

    const result = await createAttendance(match.uuid);
    if (!result.success) {
      return { type: 'error', message: result.message };
    }

    return {
      type: 'success',
      name: match.name,
      similarity: match.similarity,
      message: result.message,
    };
  } catch (error: any) {
    console.error('Error marking attendance:', error);
    const errorMessage = error?.message || error?.toString() || '';
    if (errorMessage.includes('No face detected')) {
      return { type: 'error', message: 'No face detected' };
    }
    return { type: 'error', message: 'Failed to mark attendance' };
  }
};
