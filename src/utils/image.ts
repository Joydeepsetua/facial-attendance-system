import { Alert } from 'react-native';
import { launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';

// Pick an image from the gallery and return it as a base64 string (no data:
// prefix), or null if cancelled / failed. Used for the organization logo.
//
// The image is downscaled (maxWidth/maxHeight) and compressed before returning
// so the base64 we store in SQLite stays small — a logo never needs to be more
// than a few hundred px, which keeps the DB row light.
export const pickImageFromGallery = async (): Promise<string | null> => {
  try {
    const result: ImagePickerResponse = await launchImageLibrary({
      mediaType: 'photo',
      includeBase64: true,
      quality: 0.8,
      maxWidth: 512,
      maxHeight: 512,
      selectionLimit: 1,
    });

    if (result.didCancel) return null;

    if (result.errorMessage) {
      Alert.alert('Error', result.errorMessage);
      return null;
    }

    const base64 = result.assets?.[0]?.base64 || null;
    if (!base64) {
      Alert.alert('Error', 'Failed to load image');
      return null;
    }
    return base64;
  } catch (error: any) {
    console.error('Gallery picker error:', error);
    Alert.alert('Error', 'Failed to open gallery. Please try again.');
    return null;
  }
};
