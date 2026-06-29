package com.facialattendance.facecapture;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Matrix;
import android.graphics.Rect;
import android.media.ExifInterface;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.provider.Settings;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.camera.core.CameraSelector;
import androidx.camera.core.ImageAnalysis;
import androidx.camera.core.ImageCapture;
import androidx.camera.core.ImageCaptureException;
import androidx.camera.core.ImageProxy;
import androidx.camera.core.Preview;
import androidx.camera.lifecycle.ProcessCameraProvider;
import androidx.camera.view.PreviewView;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.google.android.gms.tasks.Task;
import com.google.common.util.concurrent.ListenableFuture;
import com.google.mlkit.vision.common.InputImage;
import com.google.mlkit.vision.face.Face;
import com.google.mlkit.vision.face.FaceDetection;
import com.google.mlkit.vision.face.FaceDetector;
import com.google.mlkit.vision.face.FaceDetectorOptions;
import com.facialattendance.R;

import java.io.File;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Native face-capture screen: CameraX live preview + ML Kit face detection. Once a single
 * face is steady for a couple of frames it auto-captures (a manual Capture button is also
 * available), crops to the face, runs FaceNet and returns the 128-d embedding + JPEG path.
 *
 * Result extras (RESULT_OK):
 *   EXTRA_EMBEDDING (float[])  — 128-d L2-normalised
 *   EXTRA_IMAGE_PATH (String)  — absolute path to the captured JPEG
 *   EXTRA_ERROR / EXTRA_ERROR_CODE — present on a post-capture failure
 */
public class FaceCaptureActivity extends AppCompatActivity {

    private static final String TAG = "FaceCaptureActivity";
    private static final int REQUEST_PERMISSION = 4111;

    public static final String EXTRA_EMBEDDING = "embedding";
    public static final String EXTRA_IMAGE_PATH = "imagePath";
    public static final String EXTRA_ERROR = "error";
    public static final String EXTRA_ERROR_CODE = "errorCode";
    public static final String EXTRA_MODE = "mode"; // "register" | "recognize"

    public static final String ERR_MULTIPLE_FACES = "E_MULTIPLE_FACES";

    private PreviewView previewView;
    private Button btnCapture;
    private ImageButton btnCancel;
    private ImageButton btnFlip;
    private TextView tvHint;
    private TextView tvStatus;
    private ProgressBar progress;

    private ImageCapture imageCapture;
    private ImageAnalysis imageAnalysis;
    private ExecutorService cameraExecutor;
    private FaceDetector faceDetector;

    private volatile boolean busy = false;
    private volatile boolean autoCaptureTriggered = false;
    private volatile boolean captureEnabled = false; // manual button only enabled once liveness passes
    private int faceFrameStreak = 0;
    private static final int AUTO_CAPTURE_FRAME_STREAK = 2;
    private static final int MAX_DECODE_DIM = 1280; // cap captured-bitmap larger side

    /** Blink-liveness: require an open → closed → open eye transition before we accept a face,
     *  so a static photo (a photo of a photo) can't punch attendance. */
    private boolean blinkVerified = false;
    private int blinkStage = 0; // 0 = need open, 1 = need close, 2 = need re-open
    private String lastHint = null;
    private static final float EYE_OPEN = 0.6f;
    private static final float EYE_CLOSED = 0.25f;

    /** Capture mode ("register" | "recognize"). Recognize doesn't need the JPEG kept. */
    private String mode = "register";

    /** Ensures exactly one result is delivered, so a late background embedding can't
     *  overwrite a user cancel (and vice-versa). */
    private volatile boolean resultDelivered = false;

    /** Selfie attendance/registration → default to the front camera; flip toggles. */
    private int currentLensFacing = CameraSelector.LENS_FACING_FRONT;
    private ProcessCameraProvider cameraProvider;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_face_capture);

        mode = getIntent().getStringExtra(EXTRA_MODE);
        if (mode == null) mode = "register";

        previewView = findViewById(R.id.previewView);
        btnCapture = findViewById(R.id.btnCapture);
        btnCancel = findViewById(R.id.btnCancel);
        btnFlip = findViewById(R.id.btnFlip);
        tvHint = findViewById(R.id.tvHint);
        tvStatus = findViewById(R.id.tvStatus);
        progress = findViewById(R.id.progress);

        btnCancel.setOnClickListener(v -> deliver(RESULT_CANCELED, null));
        btnFlip.setOnClickListener(v -> flipCamera());
        btnCapture.setOnClickListener(v -> onCapturePressed());
        // Disabled until a face is detected in the live preview.
        btnCapture.setEnabled(false);
        btnCapture.setAlpha(0.5f);

        cameraExecutor = Executors.newSingleThreadExecutor();

        FaceDetectorOptions opts = new FaceDetectorOptions.Builder()
                .setPerformanceMode(FaceDetectorOptions.PERFORMANCE_MODE_ACCURATE)
                // Classification gives per-eye "open" probability — needed for blink liveness.
                .setClassificationMode(FaceDetectorOptions.CLASSIFICATION_MODE_ALL)
                .setMinFaceSize(0.22f)
                .build();
        faceDetector = FaceDetection.getClient(opts);

        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA)
                != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(
                    this, new String[]{Manifest.permission.CAMERA}, REQUEST_PERMISSION);
        } else {
            startCamera();
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode,
                                           @NonNull String[] permissions,
                                           @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == REQUEST_PERMISSION) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                startCamera();
            } else if (!ActivityCompat.shouldShowRequestPermissionRationale(this, Manifest.permission.CAMERA)) {
                // "Don't ask again" / permanently denied — offer a path to app settings,
                // otherwise the feature is unrecoverable from inside the app.
                new AlertDialog.Builder(this)
                        .setTitle("Camera Permission Required")
                        .setMessage("Please enable the Camera permission in Settings to capture faces.")
                        .setCancelable(false)
                        .setPositiveButton("Open Settings", (d, w) -> {
                            Intent intent = new Intent(
                                    Settings.ACTION_APPLICATION_DETAILS_SETTINGS,
                                    Uri.fromParts("package", getPackageName(), null));
                            startActivity(intent);
                            deliver(RESULT_CANCELED, null);
                        })
                        .setNegativeButton("Cancel", (d, w) -> deliver(RESULT_CANCELED, null))
                        .show();
            } else {
                Toast.makeText(this, "Camera permission is required", Toast.LENGTH_SHORT).show();
                deliver(RESULT_CANCELED, null);
            }
        }
    }

    private void startCamera() {
        ListenableFuture<ProcessCameraProvider> future = ProcessCameraProvider.getInstance(this);
        future.addListener(() -> {
            try {
                cameraProvider = future.get();
                bindCameraUseCases();
            } catch (Exception e) {
                Log.e(TAG, "startCamera failed", e);
                Toast.makeText(this, "Could not start camera: " + e.getMessage(), Toast.LENGTH_LONG).show();
                setResult(RESULT_CANCELED);
                finish();
            }
        }, ContextCompat.getMainExecutor(this));
    }

    private void bindCameraUseCases() {
        if (cameraProvider == null) return;
        try {
            Preview preview = new Preview.Builder().build();
            preview.setSurfaceProvider(previewView.getSurfaceProvider());

            imageCapture = new ImageCapture.Builder()
                    .setCaptureMode(ImageCapture.CAPTURE_MODE_MAXIMIZE_QUALITY)
                    .build();

            imageAnalysis = new ImageAnalysis.Builder()
                    .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
                    .build();
            imageAnalysis.setAnalyzer(cameraExecutor, this::analyzeFrame);

            CameraSelector selector = new CameraSelector.Builder()
                    .requireLensFacing(currentLensFacing)
                    .build();

            autoCaptureTriggered = false;
            faceFrameStreak = 0;
            resetLiveness();
            lastHint = null;

            cameraProvider.unbindAll();
            cameraProvider.bindToLifecycle(this, selector, preview, imageCapture, imageAnalysis);
        } catch (Exception e) {
            Log.e(TAG, "bindCameraUseCases failed", e);
            if (currentLensFacing == CameraSelector.LENS_FACING_FRONT) {
                currentLensFacing = CameraSelector.LENS_FACING_BACK;
                Toast.makeText(this, "Front camera unavailable — using back",
                        Toast.LENGTH_SHORT).show();
                bindCameraUseCases();
            } else {
                Toast.makeText(this, "No usable camera found", Toast.LENGTH_LONG).show();
                setResult(RESULT_CANCELED);
                finish();
            }
        }
    }

    private void flipCamera() {
        currentLensFacing = (currentLensFacing == CameraSelector.LENS_FACING_BACK)
                ? CameraSelector.LENS_FACING_FRONT
                : CameraSelector.LENS_FACING_BACK;
        bindCameraUseCases();
    }

    @androidx.camera.core.ExperimentalGetImage
    private void analyzeFrame(@NonNull ImageProxy imageProxy) {
        if (busy || autoCaptureTriggered || faceDetector == null || imageProxy.getImage() == null) {
            imageProxy.close();
            return;
        }
        InputImage img = InputImage.fromMediaImage(
                imageProxy.getImage(), imageProxy.getImageInfo().getRotationDegrees());
        faceDetector.process(img)
                .addOnSuccessListener(faces -> {
                    if (faces == null || faces.size() != 1) {
                        // No single face → reset liveness so the next person must blink again.
                        resetLiveness();
                        setCaptureEnabled(false);
                        faceFrameStreak = 0;
                        updateHint(faces != null && faces.size() > 1
                                ? "Only one person in the frame, please"
                                : "Position your face inside the frame");
                        return;
                    }

                    updateLiveness(faces.get(0));

                    // Capture only allowed once a real blink has been verified.
                    setCaptureEnabled(blinkVerified);
                    if (blinkVerified) {
                        faceFrameStreak++;
                        if (faceFrameStreak >= AUTO_CAPTURE_FRAME_STREAK
                                && !autoCaptureTriggered && !busy) {
                            autoCaptureTriggered = true;
                            new Handler(Looper.getMainLooper()).post(this::onCapturePressed);
                        }
                    } else {
                        faceFrameStreak = 0;
                    }
                })
                .addOnCompleteListener(t -> imageProxy.close());
    }

    private void onCapturePressed() {
        if (imageCapture == null || busy) return;
        setBusy(true, "Capturing...");

        File outFile = new File(getCacheDir(),
                "face_capture_" + System.currentTimeMillis() + ".jpg");

        ImageCapture.OutputFileOptions output =
                new ImageCapture.OutputFileOptions.Builder(outFile).build();

        imageCapture.takePicture(
                output,
                ContextCompat.getMainExecutor(this),
                new ImageCapture.OnImageSavedCallback() {
                    @Override
                    public void onImageSaved(@NonNull ImageCapture.OutputFileResults results) {
                        runOnExecutor(() -> processCapturedFile(outFile));
                    }

                    @Override
                    public void onError(@NonNull ImageCaptureException ex) {
                        Log.e(TAG, "takePicture failed", ex);
                        setBusy(false, null);
                        Toast.makeText(FaceCaptureActivity.this,
                                "Capture failed: " + ex.getMessage(), Toast.LENGTH_SHORT).show();
                    }
                });
    }

    private void processCapturedFile(File jpegFile) {
        try {
            updateStatus("Detecting face...");
            // Downsample while decoding so a high-MP capture doesn't OOM on low-RAM devices.
            // A face only needs modest resolution; cap the larger side near MAX_DECODE_DIM.
            Bitmap decoded = decodeScaled(jpegFile.getAbsolutePath(), MAX_DECODE_DIM);
            if (decoded == null) throw new IllegalStateException("Failed to decode captured image");
            Bitmap bitmap = applyExifOrientation(decoded, jpegFile.getAbsolutePath());

            InputImage img = InputImage.fromBitmap(bitmap, 0);
            Task<List<Face>> task = faceDetector.process(img);
            task.addOnSuccessListener(faces -> handleFaces(jpegFile, bitmap, faces))
                .addOnFailureListener(e -> finishWithError("Face detection failed: " + e.getMessage()));
        } catch (Throwable t) {
            Log.e(TAG, "processCapturedFile error", t);
            finishWithError(t.getMessage());
        }
    }

    private void handleFaces(File jpegFile, Bitmap full, List<Face> faces) {
        if (faces == null || faces.isEmpty()) {
            setBusy(false, null);
            Toast.makeText(this, "No face detected. Please try again.", Toast.LENGTH_SHORT).show();
            jpegFile.delete();
            return;
        }
        if (faces.size() > 1) {
            Log.w(TAG, "Multiple faces detected (" + faces.size() + "); rejecting");
            jpegFile.delete();
            full.recycle();
            finishWithErrorCode(ERR_MULTIPLE_FACES,
                    "Multiple faces detected (" + faces.size() + "). Make sure only one face is in the frame.");
            return;
        }
        Face face = faces.get(0);
        runOnExecutor(() -> {
            try {
                updateStatus("Generating embedding...");
                Bitmap crop = cropFace(full, face.getBoundingBox());
                Bitmap scaled = Bitmap.createScaledBitmap(crop, 160, 160, true);

                FaceNetService faceNet = FaceNetService.getInstance(getApplicationContext());
                float[] embedding = faceNet.embed(scaled);

                if (crop != scaled) crop.recycle();
                scaled.recycle();
                full.recycle();

                // Recognize/attendance never reads the JPEG — delete it so a kiosk doing
                // hundreds of scans/day doesn't grow the cache without bound. Register keeps
                // it because the form shows it as a preview.
                if ("recognize".equals(mode)) {
                    jpegFile.delete();
                }

                Intent result = new Intent();
                result.putExtra(EXTRA_EMBEDDING, embedding);
                result.putExtra(EXTRA_IMAGE_PATH, jpegFile.getAbsolutePath());
                deliver(RESULT_OK, result);
            } catch (Throwable t) {
                Log.e(TAG, "embedding error", t);
                finishWithError(t.getMessage());
            }
        });
    }

    private static Bitmap applyExifOrientation(Bitmap bitmap, String path) {
        try {
            ExifInterface exif = new ExifInterface(path);
            int orientation = exif.getAttributeInt(
                    ExifInterface.TAG_ORIENTATION, ExifInterface.ORIENTATION_NORMAL);
            Matrix m = new Matrix();
            switch (orientation) {
                case ExifInterface.ORIENTATION_ROTATE_90:  m.postRotate(90);  break;
                case ExifInterface.ORIENTATION_ROTATE_180: m.postRotate(180); break;
                case ExifInterface.ORIENTATION_ROTATE_270: m.postRotate(270); break;
                case ExifInterface.ORIENTATION_FLIP_HORIZONTAL: m.postScale(-1f, 1f); break;
                case ExifInterface.ORIENTATION_FLIP_VERTICAL:   m.postScale(1f, -1f); break;
                case ExifInterface.ORIENTATION_TRANSPOSE:  m.postRotate(90);  m.postScale(-1f, 1f); break;
                case ExifInterface.ORIENTATION_TRANSVERSE: m.postRotate(270); m.postScale(-1f, 1f); break;
                default: return bitmap; // ORIENTATION_NORMAL / undefined
            }
            Bitmap out = Bitmap.createBitmap(
                    bitmap, 0, 0, bitmap.getWidth(), bitmap.getHeight(), m, true);
            if (out != bitmap) bitmap.recycle();
            return out;
        } catch (Exception e) {
            Log.w(TAG, "EXIF orientation read failed; using raw bitmap", e);
            return bitmap;
        }
    }

    /** Decode a JPEG downsampled so its larger side is <= maxDim, capping peak memory. */
    private static Bitmap decodeScaled(String path, int maxDim) {
        BitmapFactory.Options bounds = new BitmapFactory.Options();
        bounds.inJustDecodeBounds = true;
        BitmapFactory.decodeFile(path, bounds);
        int sample = 1;
        int larger = Math.max(bounds.outWidth, bounds.outHeight);
        while (larger / sample > maxDim) sample *= 2;
        BitmapFactory.Options opts = new BitmapFactory.Options();
        opts.inSampleSize = sample;
        opts.inPreferredConfig = Bitmap.Config.ARGB_8888;
        return BitmapFactory.decodeFile(path, opts);
    }

    private static Bitmap cropFace(Bitmap src, Rect bbox) {
        int left = Math.max(0, bbox.left);
        int top = Math.max(0, bbox.top);
        int right = Math.min(src.getWidth(), bbox.right);
        int bottom = Math.min(src.getHeight(), bbox.bottom);
        int w = Math.max(1, right - left);
        int h = Math.max(1, bottom - top);
        return Bitmap.createBitmap(src, left, top, w, h, (Matrix) null, false);
    }

    /** Delivers the activity result exactly once. Guards the cancel-vs-background-embedding
     *  race: whichever fires first wins, the other is ignored. */
    private synchronized void deliver(int code, @Nullable Intent data) {
        if (resultDelivered) return;
        resultDelivered = true;
        if (data != null) setResult(code, data);
        else setResult(code);
        finish();
    }

    private void finishWithError(@Nullable String message) {
        Intent result = new Intent();
        if (message != null) result.putExtra(EXTRA_ERROR, message);
        deliver(RESULT_OK, result);
    }

    private void finishWithErrorCode(@NonNull String code, @NonNull String message) {
        Intent result = new Intent();
        result.putExtra(EXTRA_ERROR_CODE, code);
        result.putExtra(EXTRA_ERROR, message);
        deliver(RESULT_OK, result);
    }

    private void runOnExecutor(Runnable r) {
        if (cameraExecutor != null && !cameraExecutor.isShutdown()) cameraExecutor.execute(r);
        else r.run();
    }

    /** Advances the blink state machine from a detected face's eye-open probabilities. */
    private void updateLiveness(Face face) {
        if (blinkVerified) {
            updateHint("Verified ✓ Hold still…");
            return;
        }
        Float l = face.getLeftEyeOpenProbability();
        Float r = face.getRightEyeOpenProbability();
        if (l == null || r == null) {
            // Eye state not available this frame (face angle / lighting) — guide the user.
            updateHint("Look straight at the camera");
            return;
        }
        float p = (l + r) / 2f;
        switch (blinkStage) {
            case 0: // wait until eyes are clearly open before asking for a blink
                if (p > EYE_OPEN) blinkStage = 1;
                updateHint("Blink your eyes to verify it's you");
                break;
            case 1: // wait for the blink (eyes close)
                if (p < EYE_CLOSED) blinkStage = 2;
                updateHint("Blink your eyes to verify it's you");
                break;
            case 2: // eyes re-open → blink complete
                if (p > EYE_OPEN) {
                    blinkVerified = true;
                    updateHint("Verified ✓ Hold still…");
                }
                break;
            default:
                break;
        }
    }

    private void resetLiveness() {
        blinkVerified = false;
        blinkStage = 0;
    }

    /** Sets the on-screen hint, de-duping so we don't post the same text every frame. */
    private void updateHint(String text) {
        if (busy) return;
        if (text == null || text.equals(lastHint)) return;
        lastHint = text;
        new Handler(Looper.getMainLooper()).post(() -> tvHint.setText(text));
    }

    /** Enable/disable the manual Capture button based on whether a face is in frame. */
    private void setCaptureEnabled(boolean enabled) {
        if (busy) return; // while capturing, the busy state owns the button
        if (captureEnabled == enabled) return;
        captureEnabled = enabled;
        new Handler(Looper.getMainLooper()).post(() -> {
            btnCapture.setEnabled(enabled);
            btnCapture.setAlpha(enabled ? 1f : 0.5f);
        });
    }

    private void setBusy(boolean isBusy, @Nullable String hint) {
        this.busy = isBusy;
        if (!isBusy) {
            autoCaptureTriggered = false;
            faceFrameStreak = 0;
            captureEnabled = false; // re-armed by the analyzer on the next face frame
            resetLiveness(); // a fresh blink is required after any capture attempt
            lastHint = null;
        }
        new Handler(Looper.getMainLooper()).post(() -> {
            // When idle, the button stays disabled until the analyzer detects a face again.
            btnCapture.setEnabled(false);
            btnCapture.setAlpha(0.5f);
            progress.setVisibility(isBusy ? View.VISIBLE : View.GONE);
            tvHint.setVisibility(isBusy ? View.GONE : View.VISIBLE);
            tvStatus.setVisibility(isBusy && hint != null ? View.VISIBLE : View.GONE);
            if (hint != null) tvStatus.setText(hint);
        });
    }

    private void updateStatus(String s) {
        new Handler(Looper.getMainLooper()).post(() -> {
            tvStatus.setVisibility(View.VISIBLE);
            tvStatus.setText(s);
        });
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (cameraExecutor != null) cameraExecutor.shutdown();
        if (faceDetector != null) faceDetector.close();
    }
}
