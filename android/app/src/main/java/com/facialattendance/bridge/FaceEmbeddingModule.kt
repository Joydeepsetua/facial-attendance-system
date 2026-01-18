package com.facialattendance.bridge

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.util.Base64
import com.facebook.react.bridge.*
import com.facialattendance.facenet.FaceNetModel
import com.facialattendance.facenet.ImagePreprocessor

class FaceEmbeddingModule(
    reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    private val faceNetModel: FaceNetModel by lazy {
        FaceNetModel(reactContext.applicationContext)
    }

    override fun getName(): String {
        return "FaceEmbedding"
    }

    @ReactMethod
    fun ping(promise: Promise) {
        promise.resolve("Native module connected")
    }

    @ReactMethod
    fun getEmbedding(base64Image: String, promise: Promise) {
        try {
            // Decode base64 string to byte array
            val imageBytes = Base64.decode(base64Image, Base64.DEFAULT)
            
            // Convert byte array to Bitmap
            val bitmap = BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.size)
                ?: throw Exception("Failed to decode image")
            
            // Preprocess the image
            val preprocessedBuffer = ImagePreprocessor.preprocess(bitmap)
            
            // Get embedding from FaceNet model
            val embedding = faceNetModel.getEmbedding(preprocessedBuffer)
            
            // Convert FloatArray to WritableArray
            val embeddingArray = Arguments.createArray()
            for (value in embedding) {
                embeddingArray.pushDouble(value.toDouble())
            }
            
            promise.resolve(embeddingArray)
        } catch (e: Exception) {
            promise.reject("EMBEDDING_ERROR", "Failed to get embedding: ${e.message}", e)
        }
    }
}
