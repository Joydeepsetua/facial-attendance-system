package com.facialattendance

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facialattendance.facecapture.FaceCapturePackage
import com.facialattendance.fileexport.FileExportPackage

class MainApplication : Application(), ReactApplication {

  override val reactHost: ReactHost by lazy {
    getDefaultReactHost(
      context = applicationContext,
      packageList =
        PackageList(this).packages.apply {
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // add(MyReactNativePackage())
          // CameraX live face-capture bridge (FaceCaptureModule). Loads the FaceNet
          // model lazily on first capture, so app startup stays fast.
          add(FaceCapturePackage())
          // Writes base64 → cache file for the Excel export share.
          add(FileExportPackage())
        },
    )
  }

  override fun onCreate() {
    super.onCreate()
    loadReactNative(this)
  }
}
