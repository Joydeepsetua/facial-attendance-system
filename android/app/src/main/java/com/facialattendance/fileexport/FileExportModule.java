package com.facialattendance.fileexport;

import android.util.Base64;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.File;
import java.io.FileOutputStream;

/**
 * Minimal helper to write a base64 payload to a file in the app cache and return its
 * absolute path. Used by the Excel export so we can share a real file:// URI with
 * react-native-share (sharing a data: URI directly triggers a Uri.getScheme() NPE on
 * some Android builds).
 */
public class FileExportModule extends ReactContextBaseJavaModule {

    public static final String NAME = "FileExport";

    public FileExportModule(ReactApplicationContext context) {
        super(context);
    }

    @NonNull
    @Override
    public String getName() { return NAME; }

    @ReactMethod
    public void writeBase64ToCache(String base64, String filename, Promise promise) {
        try {
            // Keep exports in a dedicated cache subdir and clear it first, so old
            // export files don't accumulate (only the latest one ever lingers).
            File dir = new File(getReactApplicationContext().getCacheDir(), "exports");
            if (dir.exists()) {
                File[] old = dir.listFiles();
                if (old != null) {
                    for (File f : old) {
                        // best-effort cleanup; ignore failures
                        f.delete();
                    }
                }
            } else {
                dir.mkdirs();
            }

            // Strip any path separators so a bad filename can't escape the dir.
            String safeName = new File(filename).getName();
            byte[] bytes = Base64.decode(base64, Base64.DEFAULT);
            File outFile = new File(dir, safeName);
            try (FileOutputStream fos = new FileOutputStream(outFile)) {
                fos.write(bytes);
            }
            promise.resolve(outFile.getAbsolutePath());
        } catch (Throwable t) {
            promise.reject("E_WRITE", t.getMessage(), t);
        }
    }
}
