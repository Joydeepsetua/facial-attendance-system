# Facial Attendance System

A React Native mobile application for facial recognition-based attendance tracking. Features **on-device AI/ML processing**, **fully offline operation**, and real-time face matching using TensorFlow Lite and ML Kit.

## Tech Stack

- **Frontend**: React Native 0.83.1, TypeScript, React Navigation
- **Database**: SQLite (react-native-sqlite-2) for local storage
- **ML/AI**: 
  - TensorFlow Lite 2.12.0 (FaceNet model)
  - ML Kit Face Detection 16.1.6
- **Native**: Kotlin for Android native modules
- **Utilities**: react-native-image-picker, react-native-uuid

## Model Chosen & Why

**FaceNet TFLite Model** (128-dimensional embeddings)
- **Why**: Lightweight, runs on-device, produces high-quality face embeddings
- **Face Detection**: ML Kit Face Detection for fast, accurate face detection
- **Benefits**: No cloud dependency, privacy-preserving, real-time performance

## How Matching Works

1. **Face Detection**: ML Kit detects and crops face from captured image
2. **Embedding Generation**: FaceNet model generates 128-dim embedding vector
3. **Similarity Calculation**: Cosine similarity between captured and stored embeddings
4. **Matching**: Threshold of 0.75; best match above threshold is selected
5. **Storage**: Attendance record saved with user ID and timestamp

## Advantages

- ✅ **Fully Offline**: No internet connection required - works completely offline
- ✅ **High Performance**: On-device processing ensures fast, real-time face recognition
- ✅ **Latest React Native**: Built with React Native 0.83.1 (latest stable version)
- ✅ **Play Store Ready**: Production-ready for Google Play Store deployment
- ✅ **Privacy-First**: All data processed locally, no cloud dependency
- ✅ **Cost-Effective**: No API costs or subscription fees
- ✅ **Lightweight**: Optimized TensorFlow Lite model for minimal app size
- ✅ **Scalable**: Efficient database design supports growing user base

## What's Incomplete / Next Steps

- **iOS Support**: Native modules currently Android-only
- **Performance**: Optimize embedding comparison for large user databases
- **Testing**: Unit tests for matching algorithm and database operations
- **Security**: Encryption for stored embeddings and attendance data
- **UI/UX**: Loading states, better feedback, offline mode indicators
