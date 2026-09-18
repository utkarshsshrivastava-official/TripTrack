import { compressImageFile } from '../../modules/vault/services/imageCompression';

export interface MediaUploadResponse {
  url: string;
  publicId: string;
  format: string;
  bytes: number;
  resourceType: string;
  isCloudinary: boolean;
}

/**
 * Upload an image or audio file to Cloudinary via backend media API
 */
export async function uploadMedia(
  fileOrBlob: File | Blob,
  category: 'receipt' | 'voice' | 'feed_photo' | 'general' = 'general',
  customFilename?: string
): Promise<MediaUploadResponse> {
  const pin = localStorage.getItem('triptrack_family_pin') || '2026';
  let processedBlob = fileOrBlob;

  // If it's an image File, compress client-side first
  if (fileOrBlob instanceof File && fileOrBlob.type.startsWith('image/')) {
    try {
      processedBlob = await compressImageFile(fileOrBlob, {
        maxWidth: 1600,
        maxHeight: 1600,
        quality: 0.8
      });
    } catch (compErr) {
      console.warn('⚠️ [Media Service] Client compression bypassed:', compErr);
    }
  }

  const formData = new FormData();
  const filename = customFilename || (fileOrBlob instanceof File ? fileOrBlob.name : `${category}-${Date.now()}`);
  formData.append('file', processedBlob, filename);
  formData.append('category', category);
  if (customFilename) {
    formData.append('filename', customFilename);
  }

  const res = await fetch('/api/media/upload', {
    method: 'POST',
    headers: {
      'x-family-pin': pin
    },
    body: formData
  });

  if (!res.ok) {
    const errJson = await res.json().catch(() => ({}));
    throw new Error(errJson.error || `Upload failed with status ${res.status}`);
  }

  const json = await res.json();
  if (!json.success || !json.data) {
    throw new Error('Invalid upload response from media server');
  }

  return json.data;
}
