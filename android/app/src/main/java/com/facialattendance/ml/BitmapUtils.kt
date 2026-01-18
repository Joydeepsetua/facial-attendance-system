package com.facialattendance.ml

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.util.Base64

object BitmapUtils {

    fun base64ToBitmap(base64: String): Bitmap {
        val clean = base64.replace("data:image/jpeg;base64,", "")
        val decoded = Base64.decode(clean, Base64.DEFAULT)
        return BitmapFactory.decodeByteArray(decoded, 0, decoded.size)
    }

    fun cropFace(
        bitmap: Bitmap,
        left: Int,
        top: Int,
        width: Int,
        height: Int
    ): Bitmap {
        return Bitmap.createBitmap(bitmap, left, top, width, height)
    }
}
