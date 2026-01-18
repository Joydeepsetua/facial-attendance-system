import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ScrollView, NativeModules } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import Header from '../../components/header/Index';
import Styles from './Styles';
import colors from '../../utils/colors';
import { openCamera } from '../../utils/camera';
import { createUser } from '../../sqlite/service/user';

const CreateUser = () => {
  const [fullName, setFullName] = useState('');
  const [base64Image, setBase64Image] = useState<string | null>(null);

  const handleImagePicker = async () => {
    const base64Image = await openCamera();
    if (!base64Image) return;
    setBase64Image(base64Image);
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
    const embedding = await NativeModules.FaceEmbedding.getEmbedding(base64Image);
    console.log('Embedding:', embedding);
    const embeddingArray = embedding.split(',').map(Number);
    console.log('Embedding Array:', embeddingArray);
    const success = await createUser(fullName, embeddingArray);
    if (success) {
      Alert.alert('Success', 'User created successfully!');
    } else {
      Alert.alert('Error', 'Failed to create user');
    }
  };

  return (
    <SafeAreaView style={Styles.container}>
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
    </SafeAreaView>
  );
};

export default CreateUser;