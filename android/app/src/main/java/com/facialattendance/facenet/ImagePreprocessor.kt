package com.facialattendance.facenet

import android.graphics.Bitmap
import java.nio.ByteBuffer
import java.nio.ByteOrder

object ImagePreprocessor {

    fun preprocess(bitmap: Bitmap): ByteBuffer {
        val resized = Bitmap.createScaledBitmap(bitmap, 160, 160, true)
        val buffer = ByteBuffer.allocateDirect(1 * 160 * 160 * 3 * 4)
        buffer.order(ByteOrder.nativeOrder())

        for (y in 0 until 160) {
            for (x in 0 until 160) {
                val pixel = resized.getPixel(x, y)

                val r = ((pixel shr 16 and 0xFF) - 127.5f) / 128f
                val g = ((pixel shr 8 and 0xFF) - 127.5f) / 128f
                val b = ((pixel and 0xFF) - 127.5f) / 128f

                buffer.putFloat(r)
                buffer.putFloat(g)
                buffer.putFloat(b)
            }
        }
        buffer.rewind()
        return buffer
    }
}
