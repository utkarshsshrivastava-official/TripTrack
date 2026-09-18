import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

// Configure Cloudinary from environment variables
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;
const cloudinaryUrl = process.env.CLOUDINARY_URL;

if (cloudinaryUrl) {
  cloudinary.config({ cloudinary_url: cloudinaryUrl });
} else if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true
  });
}

/**
 * Check whether valid Cloudinary credentials are provided
 */
export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_URL || 
    (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)
  );
}

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  format: string;
  bytes: number;
  resourceType: string;
}

/**
 * Upload an image buffer (Receipt photo, Highway Feed photo) to Cloudinary
 */
export async function uploadImageBuffer(
  buffer: Buffer,
  folder: string = 'receipts',
  customFilename?: string
): Promise<CloudinaryUploadResult> {
  if (!isCloudinaryConfigured()) {
    console.warn('⚠️ [Cloudinary] Credentials not set. Falling back to inline data URL.');
    const base64 = buffer.toString('base64');
    return {
      url: `data:image/jpeg;base64,${base64}`,
      publicId: customFilename || `mock-${Date.now()}`,
      format: 'jpeg',
      bytes: buffer.length,
      resourceType: 'image'
    };
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `triptrack-badrinath-2026/${folder}`,
        public_id: customFilename,
        resource_type: 'image',
        transformation: [
          { width: 1600, height: 1600, crop: 'limit' },
          { quality: 'auto:good' },
          { fetch_format: 'auto' }
        ]
      },
      (error, result: UploadApiResponse | undefined) => {
        if (error || !result) {
          console.error('❌ [Cloudinary] Image upload failed:', error);
          reject(error || new Error('Image upload failed with empty result'));
        } else {
          console.log(`☁️ [Cloudinary] Image uploaded: ${result.secure_url} (${Math.round(result.bytes / 1024)} KB)`);
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            format: result.format,
            bytes: result.bytes,
            resourceType: result.resource_type
          });
        }
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Upload an audio buffer (Voice dispatch recording) to Cloudinary
 */
export async function uploadAudioBuffer(
  buffer: Buffer,
  folder: string = 'voice-notes',
  customFilename?: string
): Promise<CloudinaryUploadResult> {
  if (!isCloudinaryConfigured()) {
    console.warn('⚠️ [Cloudinary] Credentials not set. Falling back to inline audio data URL.');
    const base64 = buffer.toString('base64');
    return {
      url: `data:audio/webm;base64,${base64}`,
      publicId: customFilename || `mock-audio-${Date.now()}`,
      format: 'webm',
      bytes: buffer.length,
      resourceType: 'video'
    };
  }

  return new Promise((resolve, reject) => {
    // Cloudinary stores audio streams under resource_type: 'video'
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `triptrack-badrinath-2026/${folder}`,
        public_id: customFilename,
        resource_type: 'video'
      },
      (error, result: UploadApiResponse | undefined) => {
        if (error || !result) {
          console.error('❌ [Cloudinary] Audio upload failed:', error);
          reject(error || new Error('Audio upload failed with empty result'));
        } else {
          console.log(`🎙️ [Cloudinary] Voice audio uploaded: ${result.secure_url} (${Math.round(result.bytes / 1024)} KB)`);
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            format: result.format || 'webm',
            bytes: result.bytes,
            resourceType: result.resource_type
          });
        }
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Upload a document buffer (PDF or pass photo/scan) to Cloudinary
 */
export async function uploadDocumentBuffer(
  buffer: Buffer,
  mimeType: string = 'application/pdf',
  folder: string = 'vault',
  customFilename?: string
): Promise<CloudinaryUploadResult> {
  if (!isCloudinaryConfigured()) {
    console.warn('⚠️ [Cloudinary] Credentials not set. Falling back to inline document data URL.');
    const base64 = buffer.toString('base64');
    return {
      url: `data:${mimeType};base64,${base64}`,
      publicId: customFilename || `mock-doc-${Date.now()}`,
      format: mimeType.split('/')[1] || 'pdf',
      bytes: buffer.length,
      resourceType: 'auto'
    };
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `triptrack-badrinath-2026/${folder}`,
        public_id: customFilename,
        resource_type: 'auto'
      },
      (error, result: UploadApiResponse | undefined) => {
        if (error || !result) {
          console.error('❌ [Cloudinary] Document upload failed:', error);
          reject(error || new Error('Document upload failed with empty result'));
        } else {
          console.log(`📄 [Cloudinary] Travel pass/document uploaded: ${result.secure_url} (${Math.round(result.bytes / 1024)} KB)`);
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            format: result.format || 'pdf',
            bytes: result.bytes,
            resourceType: result.resource_type
          });
        }
      }
    );

    uploadStream.end(buffer);
  });
}
