import { Router } from 'express';
import {
  handleTestEmail,
  handleMilestoneNotification,
  handleDeadZoneNotification,
  handleSosNotification,
  handleGetAutomationStatus,
  handleDispatchEveningDigest,
  handleSimulateTrigger
} from './notifications.controller';

const router = Router();

router.get('/status', handleGetAutomationStatus);
router.post('/test-email', handleTestEmail);
router.post('/milestone', handleMilestoneNotification);
router.post('/dead-zone', handleDeadZoneNotification);
router.post('/sos', handleSosNotification);
router.post('/digest', handleDispatchEveningDigest);
router.post('/trigger-simulation', handleSimulateTrigger);

export { router as notificationsRouter };
