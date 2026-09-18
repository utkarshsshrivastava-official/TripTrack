import { Router } from 'express';
import multer from 'multer';
import { uploadMediaHandler, getMediaStatusHandler } from './media.controller';

const router = Router();

// Configure multer for memory buffer storage up to 20MB
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024 // 20MB max
  }
});

router.post('/upload', upload.single('file'), uploadMediaHandler);
router.get('/status', getMediaStatusHandler);

export default router;
