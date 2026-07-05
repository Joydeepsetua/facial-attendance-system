package com.facialattendance.facecapture;

import android.app.Activity;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facialattendance.BuildConfig;

import java.util.HashMap;
import java.util.Map;

/**
 * JS bridge: launches the CameraX face-capture activity and resolves with
 * { embedding: number[], imagePath: string }.
 *
 * Reject codes: E_CANCELLED, E_NO_ACTIVITY, E_IN_FLIGHT, E_MULTIPLE_FACES, E_NATIVE.
 */
public class FaceCaptureModule extends ReactContextBaseJavaModule
        implements ActivityEventListener {

    public static final String NAME = "FaceCaptureModule";
    private static final int REQUEST_CODE = 41711;

    // volatile: written on the JS/native-modules thread, read on the UI thread in
    // onActivityResult — guarantees the result-handler sees the latest promise.
    @Nullable private volatile Promise pendingPromise;

    public FaceCaptureModule(ReactApplicationContext context) {
        super(context);
        context.addActivityEventListener(this);
    }

    @NonNull
    @Override
    public String getName() { return NAME; }

    /**
     * Exposes the build's version and device info so JS can show the real app
     * version and attach device metadata (e.g. to feedback) with no extra dependency.
     */
    @Nullable
    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("appVersion", BuildConfig.VERSION_NAME);
        constants.put("buildNumber", BuildConfig.VERSION_CODE);
        constants.put("osVersion", "Android " + Build.VERSION.RELEASE);
        constants.put("deviceModel", Build.MODEL);
        return constants;
    }

    @ReactMethod
    public void capture(String mode, Promise promise) {
        if (pendingPromise != null) {
            promise.reject("E_IN_FLIGHT", "A face capture is already in progress");
            return;
        }
        Activity current = getCurrentActivity();
        if (current == null) {
            promise.reject("E_NO_ACTIVITY", "No current Activity to launch from");
            return;
        }
        pendingPromise = promise;
        try {
            Intent intent = new Intent(current, FaceCaptureActivity.class);
            intent.putExtra(FaceCaptureActivity.EXTRA_MODE, mode == null ? "register" : mode);
            current.startActivityForResult(intent, REQUEST_CODE);
        } catch (Throwable t) {
            Promise p = pendingPromise;
            pendingPromise = null;
            if (p != null) p.reject("E_NATIVE", t.getMessage(), t);
        }
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, @Nullable Intent data) {
        if (requestCode != REQUEST_CODE) return;
        Promise p = pendingPromise;
        pendingPromise = null;
        if (p == null) return;

        if (resultCode != Activity.RESULT_OK || data == null) {
            p.reject("E_CANCELLED", "Capture cancelled");
            return;
        }
        Bundle extras = data.getExtras();
        if (extras == null) {
            p.reject("E_NATIVE", "Empty result from FaceCaptureActivity");
            return;
        }
        String error = extras.getString(FaceCaptureActivity.EXTRA_ERROR);
        if (error != null) {
            String code = extras.getString(FaceCaptureActivity.EXTRA_ERROR_CODE);
            p.reject(code != null ? code : "E_NATIVE", error);
            return;
        }

        float[] emb = extras.getFloatArray(FaceCaptureActivity.EXTRA_EMBEDDING);
        String path = extras.getString(FaceCaptureActivity.EXTRA_IMAGE_PATH);
        if (emb == null || path == null) {
            p.reject("E_NATIVE", "Missing embedding or imagePath in result");
            return;
        }

        WritableArray jsEmb = Arguments.createArray();
        for (float v : emb) jsEmb.pushDouble((double) v);

        WritableMap out = Arguments.createMap();
        out.putArray("embedding", jsEmb);
        out.putString("imagePath", path);
        p.resolve(out);
    }

    @Override
    public void onNewIntent(Intent intent) {
        // no-op
    }
}
