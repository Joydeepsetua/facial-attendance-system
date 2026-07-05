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

// A picked photo with the fields needed both to preview it and to upload it as
// multipart form-data (used by the Feedback screenshot attachment).
export interface PickedImageAsset {
  uri: string;
  fileName: string;
  type: string; // MIME type
}

// Pick a photo from the gallery and return its uri + metadata (no base64 — the
// image is uploaded to a backend, not stored in SQLite). Returns null if
// cancelled / failed. Downscaled to keep uploads light.
export const pickImageAsset = async (): Promise<PickedImageAsset | null> => {
  try {
    const result: ImagePickerResponse = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1280,
      maxHeight: 1280,
      selectionLimit: 1,
    });

    if (result.didCancel) return null;

    if (result.errorMessage) {
      Alert.alert('Error', result.errorMessage);
      return null;
    }

    const asset = result.assets?.[0];
    if (!asset?.uri) {
      Alert.alert('Error', 'Failed to load image');
      return null;
    }

    return {
      uri: asset.uri,
      fileName: asset.fileName || `screenshot_${asset.uri.split('/').pop() || 'image.jpg'}`,
      type: asset.type || 'image/jpeg',
    };
  } catch (error: any) {
    console.error('Gallery picker error:', error);
    Alert.alert('Error', 'Failed to open gallery. Please try again.');
    return null;
  }
};
