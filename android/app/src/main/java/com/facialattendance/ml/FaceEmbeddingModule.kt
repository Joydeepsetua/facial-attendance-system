package com.facialattendance.ml

import android.graphics.Bitmap
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.face.*

object FaceDetectorHelper {

    private val detector by lazy {
        val options = FaceDetectorOptions.Builder()
            .setPerformanceMode(FaceDetectorOptions.PERFORMANCE_MODE_FAST)
            .setLandmarkMode(FaceDetectorOptions.LANDMARK_MODE_NONE)
            .setClassificationMode(FaceDetectorOptions.CLASSIFICATION_MODE_NONE)
            .build()

        FaceDetection.getClient(options)
    }

    fun detectAndCropFace(
        bitmap: Bitmap,
        onSuccess: (Bitmap) -> Unit,
        onFailure: (Exception) -> Unit
    ) {
        val image = InputImage.fromBitmap(bitmap, 0)

        detector.process(image)
            .addOnSuccessListener { faces ->
                if (faces.isEmpty()) {
                    onFailure(Exception("No face detected"))
                    return@addOnSuccessListener
                }

                val face = faces[0]
                val box = face.boundingBox

                val cropped = BitmapUtils.cropFace(
                    bitmap,
                    box.left.coerceAtLeast(0),
                    box.top.coerceAtLeast(0),
                    box.width().coerceAtMost(bitmap.width),
                    box.height().coerceAtMost(bitmap.height)
                )

                onSuccess(cropped)
            }
            .addOnFailureListener {
                onFailure(it)
            }
    }
}
