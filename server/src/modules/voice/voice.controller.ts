import { Request, Response } from 'express';
import { parseAudioWithGemini } from './voice.service';
import { getTravellerName } from '../../shared/config/travellers.config';

// In-memory audio logs storage
let memoryVoiceLogs: any[] = [];

export async function transcribeAudioHandler(req: Request, res: Response): Promise<void> {
  try {
    const file = req.file;
    const speakerId = req.body.speakerId || 'traveller-utkarsh';
    const locationName = req.body.locationName || 'En route Badrinath (NH-7)';
    const speakerName = getTravellerName(speakerId, 'Pilgrim');

    let transcription = `${speakerName}: Update received.`;
    let summary = `Update received from ${speakerName}. All pilgrims safe.`;

    if (file && file.buffer) {
      const parsed = await parseAudioWithGemini(
        file.buffer,
        file.mimetype || 'audio/webm',
        speakerName,
        locationName
      );
      transcription = parsed.transcription;
      summary = parsed.summary;
    }

    const newVoiceLog = {
      id: `voice-${Date.now()}`,
      speakerId,
      speakerName,
      transcription,
      summary,
      locationName,
      recordedAt: new Date().toISOString()
    };

    memoryVoiceLogs.unshift(newVoiceLog);
    if (memoryVoiceLogs.length > 100) memoryVoiceLogs.pop();

    res.json({
      success: true,
      voiceUpdate: newVoiceLog
    });
  } catch (err: any) {
    console.error('Error handling voice upload', err);
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function getVoiceLogsHandler(_req: Request, res: Response): Promise<void> {
  res.json({
    success: true,
    data: memoryVoiceLogs
  });
}
