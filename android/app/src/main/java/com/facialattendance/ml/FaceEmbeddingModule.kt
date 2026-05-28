package com.facialattendance.ml

import android.graphics.Bitmap
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.face.*

object FaceDetectorHelper {

    private val fastDetector by lazy {
        FaceDetection.getClient(
            FaceDetectorOptions.Builder()
                .setPerformanceMode(FaceDetectorOptions.PERFORMANCE_MODE_FAST)
                .setLandmarkMode(FaceDetectorOptions.LANDMARK_MODE_NONE)
                .setClassificationMode(FaceDetectorOptions.CLASSIFICATION_MODE_NONE)
                .setMinFaceSize(0.1f)
                .build()
        )
    }

    private val accurateDetector by lazy {
        FaceDetection.getClient(
            FaceDetectorOptions.Builder()
                .setPerformanceMode(FaceDetectorOptions.PERFORMANCE_MODE_ACCURATE)
                .setLandmarkMode(FaceDetectorOptions.LANDMARK_MODE_NONE)
                .setClassificationMode(FaceDetectorOptions.CLASSIFICATION_MODE_NONE)
                .setMinFaceSize(0.1f)
                .build()
        )
    }

    fun detectAndCropFace(
        bitmap: Bitmap,
        onSuccess: (Bitmap) -> Unit,
        onFailure: (Exception) -> Unit
    ) {
        runDetector(fastDetector, bitmap,
            onSuccess = onSuccess,
            onEmpty = {
                runDetector(
                    detector = accurateDetector,
                    bitmap = bitmap,
                    onSuccess = onSuccess,
                    onEmpty = { onFailure(Exception("No face detected")) },
                    onFailure = onFailure
                )
            },
            onFailure = onFailure
        )
    }

    private fun runDetector(
        detector: FaceDetector,
        bitmap: Bitmap,
        onSuccess: (Bitmap) -> Unit,
        onEmpty: () -> Unit,
        onFailure: (Exception) -> Unit
    ) {
        val image = InputImage.fromBitmap(bitmap, 0)
        detector.process(image)
            .addOnSuccessListener { faces ->
                if (faces.isEmpty()) {
                    onEmpty()
                    return@addOnSuccessListener
                }
                val face = faces.maxByOrNull { it.boundingBox.width() * it.boundingBox.height() }!!
                val box = face.boundingBox
                val cropped = BitmapUtils.cropFace(
                    bitmap,
                    box.left,
                    box.top,
                    box.width(),
                    box.height()
                )
                onSuccess(cropped)
            }
            .addOnFailureListener { onFailure(it) }
    }
}
