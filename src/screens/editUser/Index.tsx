import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ScrollView, NativeModules, ActivityIndicator } from 'react-native';
import SafeAreaWrapper from '../../wrappers/SafeAreaWrapper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Header from '../../components/header/Index';
import DuplicateFaceModal from '../../components/duplicateFaceModal/Index';
import Styles from '../createUser/Styles';
import colors from '../../constants/colors';
import { openCamera } from '../../utils/camera';
import { getUserByUuid, updateUser } from '../../sqlite/service/user';
import { showToast } from '../../utils/toast';
import { findDuplicateUsers, FaceMatch } from '../../utils/face';
import { RootStackParamList } from '../../navigation/AppContainer';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type EditUserRouteProp = RouteProp<RootStackParamList, 'EditUser'>;

const EditUser = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<EditUserRouteProp>();
  const { userUuid } = route.params;

  const [fullName, setFullName] = useState('');
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageChanged, setImageChanged] = useState(false);
  const [pendingEmbedding, setPendingEmbedding] = useState<number[] | null>(null);
  const [duplicateMatches, setDuplicateMatches] = useState<FaceMatch[]>([]);

  useEffect(() => {
    const loadUser = async () => {
      const user = await getUserByUuid(userUuid);
      if (user) {
        setFullName(user.name);
      } else {
        showToast('User not found', 'error');
        navigation.goBack();
      }
      setLoading(false);
    };
    loadUser();
  }, [userUuid]);

  const handleImagePicker = async () => {
    const image = await openCamera();
    if (!image) return;
    setBase64Image(image);
    setImageChanged(true);
  };

  const persistUpdate = async (newEmbedding?: number[]) => {
    const success = await updateUser(userUuid, fullName.trim(), newEmbedding);
    if (success) {
      showToast('User updated successfully!', 'success');
      setTimeout(() => {
        navigation.goBack();
      }, 500);
    } else {
      showToast('Failed to update user', 'error');
    }
  };

  const handleUpdateUser = async () => {
    if (!fullName.trim()) {
      Alert.alert('Validation', 'Please enter full name');
      return;
    }

    try {
      let newEmbedding: number[] | undefined;

      if (imageChanged && base64Image) {
        const embedding = await NativeModules.FaceEmbedding.getEmbedding(base64Image);
        newEmbedding = embedding.split(',').map(Number);

        const duplicates = await findDuplicateUsers(newEmbedding!, userUuid);
        if (duplicates.length > 0) {
          setPendingEmbedding(newEmbedding!);
          setDuplicateMatches(duplicates);
          return;
        }
      }

      await persistUpdate(newEmbedding);
    } catch (error: any) {
      console.error('Error updating user:', error);
      const errorMessage = error?.message || error?.toString() || '';
      if (errorMessage.includes('No face detected')) {
        showToast('Error: No face detected', 'error');
      } else {
        showToast('Failed to update user', 'error');
      }
    }
  };

  const handleConfirmDuplicate = async () => {
    const embeddingArray = pendingEmbedding;
    setDuplicateMatches([]);
    setPendingEmbedding(null);
    if (embeddingArray) {
      await persistUpdate(embeddingArray);
    }
  };

  const handleCancelDuplicate = () => {
    setDuplicateMatches([]);
    setPendingEmbedding(null);
  };

  if (loading) {
    return (
      <SafeAreaWrapper>
        <Header title="Edit User" showBack />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.PRIMARY} />
        </View>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper>
      <Header title="Edit User" showBack />
      <ScrollView style={Styles.scrollView} contentContainerStyle={Styles.scrollContent}>
        <View style={Styles.formContainer}>
          <View style={Styles.inputContainer}>
            <Text style={Styles.label}>Full Name</Text>
            <TextInput
              style={Styles.input}
              placeholder="Enter full name"
              placeholderTextColor={colors.DARK_GRAY}
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <View style={Styles.inputContainer}>
            <Text style={Styles.label}>Update Profile Image</Text>
            <TouchableOpacity style={Styles.imagePicker} onPress={handleImagePicker}>
              {base64Image ? (
                <Image source={{ uri: `data:image/jpeg;base64,${base64Image}` }} style={Styles.imagePreview} />
              ) : (
                <View style={Styles.imagePlaceholder}>
                  <Text style={Styles.imagePlaceholderIcon}>📷</Text>
                  <Text style={Styles.imagePlaceholderText}>Tap to capture new image</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={Styles.createButton} onPress={handleUpdateUser}>
            <Text style={Styles.createButtonText}>Update User</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <DuplicateFaceModal
        visible={duplicateMatches.length > 0}
        matches={duplicateMatches}
        onCancel={handleCancelDuplicate}
        onConfirm={handleConfirmDuplicate}
        confirmLabel="Update Anyway"
      />
    </SafeAreaWrapper>
  );
};

export default EditUser;
