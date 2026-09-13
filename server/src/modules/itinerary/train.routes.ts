import { Router } from 'express';
import { getTrain12441Status, updateTrain12441Delay } from './train.controller';

const router = Router();

router.get('/12441/status', getTrain12441Status);
router.post('/12441/delay', updateTrain12441Delay);

export default router;
