import { launchCamera } from 'react-native-image-picker';

export const openCamera = async () => {
  const result = await launchCamera({
    mediaType: 'photo',
    includeBase64: true,
    cameraType: 'front',
    quality: 0.8,
  });

  if (result.didCancel) return;

  const base64 = result.assets?.[0]?.base64 || null;
  if (!base64) return null;
  return base64;
};
