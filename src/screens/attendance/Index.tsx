import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, ScrollView } from 'react-native';
import SafeAreaWrapper from '../../wrappers/SafeAreaWrapper';
import { NativeModules } from 'react-native';
import Header from '../../components/header/Index';
import { openCamera } from '../../utils/camera';
import { getAllUsers } from '../../sqlite/service/user';
import { showToast } from '../../utils/toast';
import { findBestMatch } from '../../utils/face';
import Styles from './Styles';
import colors from '../../constants/colors';
import { createAttendance } from '../../sqlite/service/attendance';

const Attendance = () => {
  const [loading, setLoading] = useState(false);
  const [matchedUser, setMatchedUser] = useState<{ uuid: string, name: string, similarity: number, message?: string } | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [attendanceError, setAttendanceError] = useState<string | null>(null);


  const handleCapturePhoto = async () => {
    try {
      setLoading(true);
      setMatchedUser(null);
      setAttendanceError(null);

      // Take photo
      const base64Image = await openCamera();
      if (!base64Image) {
        setLoading(false);
        return;
      }

      setCapturedImage(base64Image);

      // Get embedding from photo
      const embeddingStr = await NativeModules.FaceEmbedding.getEmbedding(base64Image);
      const capturedEmbedding = embeddingStr.split(',').map(Number);

      // Get all users from database
      const users = await getAllUsers();

      if (users.length === 0) {
        showToast('No users found in database', 'error');
        setLoading(false);
        return;
      }

      const match = findBestMatch(capturedEmbedding, users);
      const bestMatch: { uuid: string; name: string; similarity: number; message?: string } | null =
        match ? { ...match } : null;

      if (bestMatch) {
        const result = await createAttendance(bestMatch.uuid);        
        if (!result.success) {
          setAttendanceError(result.message);
          showToast(result.message, 'error');
          return;
        }
        bestMatch.message = result.message;
        setMatchedUser(bestMatch);
        showToast(result.message, 'success');
      } else {
        setMatchedUser(null);
        showToast('No matching user found', 'error');
      }
    } catch (error: any) {
      console.error('Error marking attendance:', error);
      const errorMessage = error?.message || error?.toString() || '';
      if (errorMessage.includes('No face detected')) {
        showToast('Error: No face detected', 'error');
      } else {
        showToast('Failed to mark attendance', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRetake = () => {
    handleCapturePhoto();
    setCapturedImage(null);
    setMatchedUser(null);
    setAttendanceError(null);
  };


  return (
    <SafeAreaWrapper>
      <Header title="Mark Attendance" showBack />
      <View style={Styles.content}>
        {capturedImage && (
          <View style={Styles.imageContainer}>
            <Image
              source={{ uri: `data:image/jpeg;base64,${capturedImage}` }}
              style={Styles.capturedImage}
            />
            <TouchableOpacity style={Styles.retakeButton} onPress={handleRetake}>
              <Text style={Styles.retakeButtonText}>📸 Take Another Photo</Text>
            </TouchableOpacity>
          </View>
        )}

        {capturedImage && loading ? (
          <View style={Styles.buttonPlaceholder}>
            <ActivityIndicator color={colors.DARK_GRAY} />
          </View>
        ) : matchedUser ? (
          <View style={Styles.resultContainer}>
            <View style={Styles.successCard}>
              <Text style={Styles.successIcon}>✅</Text>
              <Text style={Styles.similarityText}>
                {matchedUser.message || 'Attendance marked for'}
              </Text>
              <Text style={Styles.matchedName}>{matchedUser.name}</Text>
              <Text style={Styles.similarityText}>
                Match: {(matchedUser.similarity * 100).toFixed(1)}%
              </Text>
            </View>
          </View>
        ) : attendanceError ? (
          <View style={Styles.resultContainer}>
            <View style={Styles.errorCard}>
              <Text style={Styles.errorIcon}>❌</Text>
              <Text style={Styles.noMatchText}>{attendanceError}</Text>
            </View>
          </View>
        ) : capturedImage && !loading ? (
          <View style={Styles.resultContainer}>
            <View style={Styles.errorCard}>
              <Text style={Styles.errorIcon}>❌</Text>
              <Text style={Styles.noMatchText}>No matching user found</Text>
            </View>
          </View>
        ) : null}

        {!capturedImage && (
          <TouchableOpacity
            style={Styles.captureButton}
            onPress={handleCapturePhoto}
            disabled={loading}
          >
            <View style={Styles.buttonPlaceholder}>
              <Text style={Styles.buttonPlaceholderIcon}>📸</Text>
              <Text style={Styles.buttonPlaceholderText}>Tap to capture photo</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaWrapper>
  );
};

export default Attendance;