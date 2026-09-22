import { Router } from 'express';
import {
  getSegmentsHandler,
  toggleCheckpointHandler,
  updateStatusHandler,
  updateLogisticsHandler,
  addCheckpointHandler,
  rebalanceItineraryHandler
} from './segment.controller';

const router = Router();

router.get('/', getSegmentsHandler);
router.post('/rebalance', rebalanceItineraryHandler);
router.post('/:id/checkpoints', addCheckpointHandler);
router.patch('/:id/checkpoint', toggleCheckpointHandler);
router.patch('/:id/status', updateStatusHandler);
router.patch('/:id/logistics', updateLogisticsHandler);

export default router;
