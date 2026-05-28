import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ScrollView, NativeModules } from 'react-native';
import SafeAreaWrapper from '../../wrappers/SafeAreaWrapper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Header from '../../components/header/Index';
import DuplicateFaceModal from '../../components/duplicateFaceModal/Index';
import Styles from './Styles';
import colors from '../../constants/colors';
import { openCamera } from '../../utils/camera';
import { createUser } from '../../sqlite/service/user';
import { showToast } from '../../utils/toast';
import { findDuplicateUsers, FaceMatch } from '../../utils/face';
import { RootStackParamList } from '../../navigation/AppContainer';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const CreateUser = () => {
  const navigation = useNavigation<NavigationProp>();
  const [fullName, setFullName] = useState('');
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [pendingEmbedding, setPendingEmbedding] = useState<number[] | null>(null);
  const [duplicateMatches, setDuplicateMatches] = useState<FaceMatch[]>([]);

  const handleImagePicker = async () => {
    const base64Image = await openCamera();
    if (!base64Image) return;
    setBase64Image(base64Image);
  };

  const saveUser = async (embeddingArray: number[]) => {
    const success = await createUser(fullName, embeddingArray);
    if (success) {
      showToast('User created successfully!', 'success');
      setTimeout(() => {
        navigation.goBack();
      }, 500);
    } else {
      showToast('Failed to create user', 'error');
    }
  };

  const handleCreateUser = async () => {
    if (!fullName.trim()) {
      Alert.alert('Validation', 'Please enter full name');
      return;
    }
    if (!base64Image) {
      Alert.alert('Validation', 'Please select an image');
      return;
    }
    try {
      const embedding = await NativeModules.FaceEmbedding.getEmbedding(base64Image);
      const embeddingArray = embedding.split(',').map(Number);

      const duplicates = await findDuplicateUsers(embeddingArray);
      if (duplicates.length > 0) {
        setPendingEmbedding(embeddingArray);
        setDuplicateMatches(duplicates);
        return;
      }

      await saveUser(embeddingArray);
    } catch (error: any) {
      console.error('Error creating user:', error);
      const errorMessage = error?.message || error?.toString() || '';
      if (errorMessage.includes('No face detected')) {
        showToast('Error: No face detected', 'error');
      } else {
        showToast('Failed to create user', 'error');
      }
    }
  };

  const handleConfirmDuplicate = async () => {
    const embeddingArray = pendingEmbedding;
    setDuplicateMatches([]);
    setPendingEmbedding(null);
    if (embeddingArray) {
      await saveUser(embeddingArray);
    }
  };

  const handleCancelDuplicate = () => {
    setDuplicateMatches([]);
    setPendingEmbedding(null);
  };

  return (
    <SafeAreaWrapper>
      <Header title="Create User" showBack />
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
            <Text style={Styles.label}>Profile Image</Text>
            <TouchableOpacity style={Styles.imagePicker} onPress={handleImagePicker}>
                {base64Image ? (
                  <Image source={{ uri: `data:image/jpeg;base64,${base64Image}` }} style={Styles.imagePreview} />
              ) : (
                <View style={Styles.imagePlaceholder}>
                  <Text style={Styles.imagePlaceholderIcon}>📷</Text>
                  <Text style={Styles.imagePlaceholderText}>Tap to select image</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={Styles.createButton} onPress={handleCreateUser}>
            <Text style={Styles.createButtonText}>Create User</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <DuplicateFaceModal
        visible={duplicateMatches.length > 0}
        matches={duplicateMatches}
        onCancel={handleCancelDuplicate}
        onConfirm={handleConfirmDuplicate}
      />
    </SafeAreaWrapper>
  );
};

export default CreateUser;
