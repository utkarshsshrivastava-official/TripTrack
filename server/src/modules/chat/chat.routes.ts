import { Router } from 'express';
import { getChatHistory, syncOfflineMessages, clearChatHistory } from './chat.controller';
import { familyPinMutationsOnly } from '../../shared/middleware/familyPinAuth';

const router = Router();

router.get('/history', getChatHistory);
router.post('/sync', syncOfflineMessages);
router.delete('/history', familyPinMutationsOnly, clearChatHistory);

export default router;
