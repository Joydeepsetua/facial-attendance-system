import { Platform, PermissionsAndroid, Alert, Linking } from 'react-native';
import { launchCamera, ImagePickerResponse } from 'react-native-image-picker';

const requestCameraPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app needs access to your camera to take photos',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Camera permission error:', err);
      return false;
    }
  }
  // iOS permissions are handled automatically by react-native-image-picker
  return true;
};

export const openCamera = async (): Promise<string | null> => {
  // Check and request camera permission
  const hasPermission = await requestCameraPermission();
  
  if (!hasPermission) {
    if (Platform.OS === 'android') {
      Alert.alert(
        'Camera Permission Required',
        'Please grant camera permission to use this feature. You can enable it in app settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Open Settings',
            onPress: () => Linking.openSettings(),
          },
        ]
      );
    }
    return null;
  }

  try {
    const result: ImagePickerResponse = await launchCamera({
      mediaType: 'photo',
      includeBase64: true,
      cameraType: 'front',
      quality: 0.8,
    });

    if (result.didCancel) {
      return null;
    }

    if (result.errorMessage) {
      if (result.errorMessage.includes('permission') || result.errorMessage.includes('Permission')) {
        Alert.alert(
          'Camera Permission Denied',
          'Please grant camera permission in your device settings to use this feature.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Open Settings',
              onPress: () => Linking.openSettings(),
            },
          ]
        );
      } else {
        Alert.alert('Camera Error', result.errorMessage);
      }
      return null;
    }

    const base64 = result.assets?.[0]?.base64 || null;
    if (!base64) {
      Alert.alert('Error', 'Failed to capture image');
      return null;
    }
    
    return base64;
  } catch (error: any) {
    console.error('Camera error:', error);
    Alert.alert('Error', 'Failed to open camera. Please try again.');
    return null;
  }
};
