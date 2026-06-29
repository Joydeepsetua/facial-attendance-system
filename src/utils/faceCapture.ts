import { NativeModules } from 'react-native';

export type FaceCaptureMode = 'register' | 'recognize';

export interface FaceCaptureResult {
  embedding: number[]; // 128 floats, L2-normalised
  imagePath: string; // absolute path to a JPEG in the app cache
}

interface NativeFaceCapture {
  capture(mode: string): Promise<FaceCaptureResult>;
}

const native = NativeModules.FaceCaptureModule as NativeFaceCapture | undefined;

/** Native detected more than one face and refused to return an embedding. */
export class MultipleFacesDetected extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MultipleFacesDetected';
  }
}

/**
 * Opens the native CameraX face-capture screen (live preview + auto-capture) and
 * resolves with the captured face's embedding + a local JPEG path.
 * Returns `null` if the user backs out of the camera.
 */
export const captureFace = async (
  mode: FaceCaptureMode = 'recognize',
): Promise<FaceCaptureResult | null> => {
  if (!native) {
    throw new Error(
      'FaceCaptureModule is not linked. Rebuild the Android app (npx react-native run-android).',
    );
  }
  try {
    return await native.capture(mode);
  } catch (err: any) {
    const code = err?.code;
    if (code === 'E_CANCELLED') return null;
    if (code === 'E_MULTIPLE_FACES') {
      throw new MultipleFacesDetected(err?.message || 'Multiple faces detected');
    }
    throw err instanceof Error ? err : new Error(String(err));
  }
};
