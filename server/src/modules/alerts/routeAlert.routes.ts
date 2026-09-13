import { Router } from 'express';
import { 
  getRouteStatusHandler, 
  postFamilySpotterReportHandler,
  deleteFamilySpotterReportHandler,
  clearAllSpotterReportsHandler
} from './routeAlert.controller';
import { familyPinMutationsOnly } from '../../shared/middleware/familyPinAuth';

const router = Router();

// Public read with optional pin; mutations protected
router.get('/route-status', getRouteStatusHandler);
router.post('/report', familyPinMutationsOnly, postFamilySpotterReportHandler);
router.delete('/report/:id', familyPinMutationsOnly, deleteFamilySpotterReportHandler);
router.delete('/reports/reset', familyPinMutationsOnly, clearAllSpotterReportsHandler);

export default router;
