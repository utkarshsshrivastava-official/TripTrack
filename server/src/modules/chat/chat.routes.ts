import { Router } from 'express';
import { getChatHistory, syncOfflineMessages } from './chat.controller';

const router = Router();

router.get('/history', getChatHistory);
router.post('/sync', syncOfflineMessages);

export default router;
