import { Request, Response } from 'express';
import { 
  uploadImageBuffer, 
  uploadAudioBuffer, 
  isCloudinaryConfigured 
} from '../../shared/lib/cloudinary.service';

export async function uploadMediaHandler(req: Request, res: Response): Promise<void> {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ success: false, error: 'No media file provided' });
      return;
    }

    const category = (req.body.category as string) || 'general'; // 'receipt' | 'voice' | 'feed_photo' | 'general'
    const customFilename = req.body.filename ? String(req.body.filename) : undefined;
    const isAudio = file.mimetype.startsWith('audio/') || file.mimetype.includes('webm') || category === 'voice';

    console.log(`📤 [Media API] Processing ${isAudio ? 'audio' : 'image'} upload (${Math.round(file.size / 1024)} KB, category: ${category})`);

    let result;
    if (isAudio) {
      result = await uploadAudioBuffer(file.buffer, `voice-notes`, customFilename);
    } else {
      result = await uploadImageBuffer(file.buffer, category, customFilename);
    }

    res.status(201).json({
      success: true,
      data: {
        url: result.url,
        publicId: result.publicId,
        format: result.format,
        bytes: result.bytes,
        resourceType: result.resourceType,
        isCloudinary: isCloudinaryConfigured()
      }
    });
  } catch (err: any) {
    console.error('❌ [Media API] Error uploading media:', err);
    res.status(500).json({ success: false, error: err.message || 'Media upload failed' });
  }
}

export function getMediaStatusHandler(_req: Request, res: Response): void {
  res.json({
    success: true,
    cloudinaryConfigured: isCloudinaryConfigured(),
    timestamp: new Date().toISOString()
  });
}
