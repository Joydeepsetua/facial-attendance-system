package com.facialattendance.bridge

import android.graphics.Bitmap
import com.facebook.react.bridge.*
import com.facialattendance.ml.BitmapUtils
import com.facialattendance.ml.FaceDetectorHelper
import org.tensorflow.lite.Interpreter
import org.tensorflow.lite.support.common.FileUtil
import org.tensorflow.lite.support.tensorbuffer.TensorBuffer
import java.nio.ByteBuffer
import java.nio.ByteOrder

class FaceEmbeddingModule(
    reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    private var interpreter: Interpreter? = null

    init {
        val model = FileUtil.loadMappedFile(reactContext, "facenet.tflite")
        interpreter = Interpreter(model)
    }

    override fun getName(): String = "FaceEmbedding"

    @ReactMethod
    fun getEmbedding(base64Image: String, promise: Promise) {
        try {
            // 1️⃣ Decode base64 → Bitmap
            val bitmap = BitmapUtils.base64ToBitmap(base64Image)

            // 2️⃣ Detect & crop face
            FaceDetectorHelper.detectAndCropFace(bitmap,
                onSuccess = { faceBitmap ->
                    // 3️⃣ Preprocess & run FaceNet
                    val input = preprocess(faceBitmap)
                    val output = TensorBuffer.createFixedSize(intArrayOf(1, 128), org.tensorflow.lite.DataType.FLOAT32)
                    interpreter?.run(input, output.buffer.rewind())
                    promise.resolve(output.floatArray.joinToString(","))
                },
                onFailure = {
                    promise.reject("FACE_ERROR", it.message)
                }
            )
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }

    private fun preprocess(bitmap: Bitmap): ByteBuffer {
        val inputImage = Bitmap.createScaledBitmap(bitmap, 160, 160, true)
        val imgData = ByteBuffer.allocateDirect(1 * 160 * 160 * 3 * 4)
        imgData.order(ByteOrder.nativeOrder())

        for (y in 0 until 160) {
            for (x in 0 until 160) {
                val pixel = inputImage.getPixel(x, y)
                val r = ((pixel shr 16) and 0xFF) / 255.0f
                val g = ((pixel shr 8) and 0xFF) / 255.0f
                val b = (pixel and 0xFF) / 255.0f

                imgData.putFloat((r - 0.5f) * 2f)
                imgData.putFloat((g - 0.5f) * 2f)
                imgData.putFloat((b - 0.5f) * 2f)
            }
        }
        return imgData
    }
}
