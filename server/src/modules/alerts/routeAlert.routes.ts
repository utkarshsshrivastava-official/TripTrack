import { Router } from 'express';
import { getRouteStatusHandler, postFamilySpotterReportHandler } from './routeAlert.controller';
import { familyPinMutationsOnly } from '../../shared/middleware/familyPinAuth';

const router = Router();

// Public read with optional pin; mutations protected
router.get('/route-status', getRouteStatusHandler);
router.post('/report', familyPinMutationsOnly, postFamilySpotterReportHandler);

export default router;
