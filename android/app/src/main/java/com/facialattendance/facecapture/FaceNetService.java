package com.facialattendance.facecapture;

import android.content.Context;
import android.content.res.AssetFileDescriptor;
import android.graphics.Bitmap;

import org.tensorflow.lite.Interpreter;

import java.io.FileInputStream;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.MappedByteBuffer;
import java.nio.channels.FileChannel;

/**
 * Thin wrapper around the FaceNet TFLite model used by the CameraX capture screen.
 * 160x160 RGB input, (px-127.5)/127.5 normalisation, 128-d output. The output is
 * L2-normalised here; matching uses cosine similarity (scale-invariant) so this stays
 * compatible with embeddings produced by the existing base64 FaceEmbedding module.
 */
public class FaceNetService {

    private static final String MODEL_ASSET = "facenet.tflite";
    public static final int INPUT_SIZE = 160;
    public static final int EMBEDDING_DIM = 128;

    private static FaceNetService instance;

    private final Interpreter interpreter;

    public static synchronized FaceNetService getInstance(Context context) throws IOException {
        if (instance == null) {
            instance = new FaceNetService(context.getApplicationContext());
        }
        return instance;
    }

    private FaceNetService(Context context) throws IOException {
        AssetFileDescriptor afd = context.getAssets().openFd(MODEL_ASSET);
        try (FileInputStream fis = new FileInputStream(afd.getFileDescriptor())) {
            FileChannel channel = fis.getChannel();
            MappedByteBuffer model = channel.map(
                FileChannel.MapMode.READ_ONLY,
                afd.getStartOffset(),
                afd.getDeclaredLength()
            );
            Interpreter.Options opts = new Interpreter.Options();
            opts.setNumThreads(2);
            interpreter = new Interpreter(model, opts);
        } finally {
            afd.close();
        }
    }

    /** Run inference on a 160x160 ARGB_8888 bitmap, returning the L2-normalised 128-d embedding. */
    public float[] embed(Bitmap face160) {
        if (face160.getWidth() != INPUT_SIZE || face160.getHeight() != INPUT_SIZE) {
            throw new IllegalArgumentException("FaceNet input must be 160x160, got "
                    + face160.getWidth() + "x" + face160.getHeight());
        }

        ByteBuffer input = ByteBuffer
                .allocateDirect(1 * INPUT_SIZE * INPUT_SIZE * 3 * 4)
                .order(ByteOrder.nativeOrder());

        int[] pixels = new int[INPUT_SIZE * INPUT_SIZE];
        face160.getPixels(pixels, 0, INPUT_SIZE, 0, 0, INPUT_SIZE, INPUT_SIZE);
        for (int p : pixels) {
            float r = ((p >> 16) & 0xFF);
            float g = ((p >> 8) & 0xFF);
            float b = (p & 0xFF);
            // (px/255 - 0.5) * 2 == (px - 127.5) / 127.5 — same as the base64 module's path.
            input.putFloat((r - 127.5f) / 127.5f);
            input.putFloat((g - 127.5f) / 127.5f);
            input.putFloat((b - 127.5f) / 127.5f);
        }
        input.rewind();

        float[][] output = new float[1][EMBEDDING_DIM];
        interpreter.run(input, output);

        float[] emb = output[0];
        double norm = 0;
        for (float v : emb) norm += v * v;
        norm = Math.sqrt(norm);
        if (norm > 1e-10) {
            for (int i = 0; i < emb.length; i++) {
                emb[i] = (float) (emb[i] / norm);
            }
        }
        return emb;
    }
}
