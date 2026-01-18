import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import Header from '../../components/header/Index';
import Styles from './Styles';
import colors from '../../utils/colors';

const CreateUser = () => {
  const [fullName, setFullName] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  const handleImagePicker = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: true,
        quality: 0.8,
      },
      (response: ImagePickerResponse) => {
        if (response.didCancel) {
          return;
        }
        if (response.errorMessage) {
          Alert.alert('Error', response.errorMessage);
          return;
        }
        if (response.assets && response.assets[0]) {
          setImageUri(response.assets[0].uri || null);
        }
      }
    );
  };

  const handleCreateUser = () => {
    if (!fullName.trim()) {
      Alert.alert('Validation', 'Please enter full name');
      return;
    }
    if (!imageUri) {
      Alert.alert('Validation', 'Please select an image');
      return;
    }
    // TODO: Implement user creation logic
    Alert.alert('Success', 'User created successfully!');
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
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={Styles.imagePreview} />
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