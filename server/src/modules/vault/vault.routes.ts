import { Router } from 'express';
import multer from 'multer';
import { 
  uploadDocumentHandler, 
  getDocumentsHandler, 
  getDocumentByIdHandler,
  deleteDocumentHandler
} from './vault.controller';
import { verifyFamilyPin } from '../../shared/middleware/auth.middleware';

const router = Router();

// Configure multer memory storage for buffer streaming to Gemini Flash
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024 // 15MB
  }
});

// Routes
router.post('/upload', verifyFamilyPin, upload.single('document'), uploadDocumentHandler);
router.get('/', verifyFamilyPin, getDocumentsHandler);
router.get('/:id', verifyFamilyPin, getDocumentByIdHandler);
router.delete('/:id', verifyFamilyPin, deleteDocumentHandler);

export default router;
