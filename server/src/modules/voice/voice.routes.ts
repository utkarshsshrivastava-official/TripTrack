import { Router } from 'express';
import multer from 'multer';
import { transcribeAudioHandler, getVoiceLogsHandler } from './voice.controller';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB max voice note
});

router.post('/transcribe', upload.single('audio'), transcribeAudioHandler);
router.get('/feed', getVoiceLogsHandler);

export default router;
