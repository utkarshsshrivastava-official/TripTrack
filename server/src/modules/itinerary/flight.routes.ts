import { Router } from 'express';
import { getFlight6EStatus, updateFlight6EDelay } from './flight.controller';

const router = Router();

router.get('/6e/status', getFlight6EStatus);
router.post('/6e/delay', updateFlight6EDelay);

export default router;
