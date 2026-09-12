import { Router } from 'express';
import {
  handleTestEmail,
  handleMilestoneNotification,
  handleDeadZoneNotification,
  handleSosNotification
} from './notifications.controller';

const router = Router();

router.post('/test-email', handleTestEmail);
router.post('/milestone', handleMilestoneNotification);
router.post('/dead-zone', handleDeadZoneNotification);
router.post('/sos', handleSosNotification);

export { router as notificationsRouter };
