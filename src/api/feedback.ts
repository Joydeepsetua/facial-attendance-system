import {
  FEEDBACK_API_BASE_URL,
  FEEDBACK_SUBMIT_PATH,
  FEEDBACK_IMAGE_UPLOAD_BASE_URL,
  FEEDBACK_IMAGE_UPLOAD_PATH,
  FEEDBACK_IMAGE_UPLOAD_API_TOKEN,
  isFeedbackApiConfigured,
  isFeedbackImageUploadConfigured,
} from '../constants/config';

import { PickedImageAsset } from '../utils/image';

export type FeedbackType = 'bug' | 'feature' | 'improvement' | 'other';

/** A screenshot chosen from the gallery, ready to upload as multipart form-data. */
export type FeedbackImageAsset = PickedImageAsset;

/** The exact JSON body POSTed to the feedback endpoint. */
export interface FeedbackPayload {
  feedbackType: FeedbackType;
  module: string;
  description: string;
  name: string;
  phone: string;
  image: string; // hosted URL ('' when no screenshot was attached)
  appVersion: string;
  buildNumber: string;
  osVersion: string;
  deviceModel: string;
}

/** Thrown when the feedback endpoints haven't been configured in config.ts yet. */
export class FeedbackApiNotConfigured extends Error {
  constructor() {
    super('Feedback API is not configured');
    this.name = 'FeedbackApiNotConfigured';
  }
}

const url = (path: string) => `${FEEDBACK_API_BASE_URL.replace(/\/+$/, '')}${path}`;
const imageUploadUrl = (path: string) => `${FEEDBACK_IMAGE_UPLOAD_BASE_URL.replace(/\/+$/, '')}${path}`;



/**
 * Upload the chosen screenshot and return its hosted URL.
 * The upload service authenticates via an `x-api-key` header, expects the file
 * in a multipart field named `image`, and responds (201) with:
 *   { success: true, data: { publicUrl, webContentLink, webViewLink, ... } }
 */
export const uploadFeedbackImage = async (asset: FeedbackImageAsset): Promise<string> => {
  if (!isFeedbackImageUploadConfigured()) throw new FeedbackApiNotConfigured();

  const form = new FormData();
  form.append('image', {
    uri: asset.uri,
    name: asset.fileName,
    type: asset.type,
  } as any);

  const res = await fetch(imageUploadUrl(FEEDBACK_IMAGE_UPLOAD_PATH), {
    method: 'POST',
    // Let fetch set the multipart Content-Type + boundary; only add auth.
    headers: { 'x-api-key': FEEDBACK_IMAGE_UPLOAD_API_TOKEN },
    body: form,
  });

  if (!res.ok) throw new Error(`Image upload failed (${res.status})`);

  const data = await res.json();
  const hosted = data?.data?.publicUrl ?? data?.data?.webContentLink ?? data?.data?.webViewLink;
  if (typeof hosted !== 'string' || !hosted) {
    throw new Error('Image upload response did not include a url');
  }
  return hosted;
};

const DEFAULT_THANKS = 'Thank you! Your feedback is valuable to us and helps us improve.';

/**
 * POST the feedback JSON. Resolves with the server's thank-you message (falling
 * back to a default) on a 2xx response, throws otherwise.
 */
export const submitFeedback = async (payload: FeedbackPayload): Promise<string> => {
  if (!isFeedbackApiConfigured()) throw new FeedbackApiNotConfigured();

  const res = await fetch(url(FEEDBACK_SUBMIT_PATH), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(`Feedback submit failed (${res.status})`);

  const body = await res.json().catch(() => null);
  return typeof body?.message === 'string' && body.message ? body.message : DEFAULT_THANKS;
};
