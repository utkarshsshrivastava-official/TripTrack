import { Router } from 'express';
import {
  getSegmentsHandler,
  toggleCheckpointHandler,
  updateStatusHandler,
  updateLogisticsHandler
} from './segment.controller';

const router = Router();

router.get('/', getSegmentsHandler);
router.patch('/:id/checkpoint', toggleCheckpointHandler);
router.patch('/:id/status', updateStatusHandler);
router.patch('/:id/logistics', updateLogisticsHandler);

export default router;
