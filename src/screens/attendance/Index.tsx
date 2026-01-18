import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeModules } from 'react-native';
import Header from '../../components/header/Index';
import { openCamera } from '../../utils/camera';
import { getAllUsers } from '../../sqlite/service/user';
import { showToast } from '../../utils/toast';
import Styles from './Styles';
import colors from '../../utils/colors';

const cosineSimilarity = (vecA: number[], vecB: number[]): number => {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) return 0;

  return dotProduct / denominator;
};

const Attendance = () => {
  const [loading, setLoading] = useState(false);
  const [matchedUser, setMatchedUser] = useState<{ uuid: string, name: string, similarity: number } | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  
  const handleCapturePhoto = async () => {
    try {
      setLoading(true);
      setMatchedUser(null);

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

      // Compare with each user
      let bestMatch: { uuid: string, name: string; similarity: number } | null = null;
      const threshold = 0.75; // Similarity threshold

      for (const user of users) {
        try {
          const userEmbedding = JSON.parse(user.embedding) as number[];
          const sim = cosineSimilarity(capturedEmbedding, userEmbedding);

          if (sim > threshold && (!bestMatch || sim > bestMatch.similarity)) {
            bestMatch = {
              uuid: user.uuid,
              name: user.name,
              similarity: sim,
            };
          }
        } catch (error) {
          console.error('Error parsing user embedding:', error);
        }
      }

      if (bestMatch) {
        setMatchedUser(bestMatch);
        showToast(`Attendance marked for ${bestMatch.name}`, 'success');
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
  };


  return (
    <SafeAreaView style={Styles.container}>
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
              <Text style={Styles.matchedName}>{matchedUser.name}</Text>
                <Text style={Styles.similarityText}>
                Match: {(matchedUser.similarity * 100).toFixed(1)}%
              </Text>
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
    </SafeAreaView>
  );
};

export default Attendance;