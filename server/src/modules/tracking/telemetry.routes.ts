import { Router } from 'express';
import {
  pingLocationHandler,
  bulkPingHandler,
  getLatestTelemetryHandler
} from './telemetry.controller';

const router = Router();

router.post('/ping', pingLocationHandler);
router.post('/bulk-ping', bulkPingHandler);
router.get('/latest', getLatestTelemetryHandler);

export default router;
