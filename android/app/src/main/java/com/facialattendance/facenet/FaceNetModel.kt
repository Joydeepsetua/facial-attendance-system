package com.facialattendance.facenet

import android.content.Context
import org.tensorflow.lite.Interpreter
import java.nio.ByteBuffer
import java.nio.ByteOrder

class FaceNetModel(context: Context) {

    private val interpreter: Interpreter

    init {
        val model = context.assets.open("facenet.tflite").readBytes()
        val buffer = ByteBuffer.allocateDirect(model.size)
        buffer.order(ByteOrder.nativeOrder())
        buffer.put(model)
        buffer.rewind()
        interpreter = Interpreter(buffer)
    }

    fun getEmbedding(input: ByteBuffer): FloatArray {
        input.rewind()
        val output = Array(1) { FloatArray(128) }
        interpreter.run(input, output)
        return output[0]
    }
}
