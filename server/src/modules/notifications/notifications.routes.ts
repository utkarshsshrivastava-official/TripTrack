import { Router } from 'express';
import {
  handleTestEmail,
  handleMilestoneNotification,
  handleDeadZoneNotification,
  handleSosNotification,
  handleGetAutomationStatus,
  handleDispatchEveningDigest,
  handleSimulateTrigger,
  handleScheduleCustomBriefing,
  handleTriggerGeofenceCheck,
  handleResetTrigger,
  handleGetVapidPublicKey,
  handlePushSubscribe,
  handlePushUnsubscribe,
  handleTestPush
} from './notifications.controller';

const router = Router();

router.get('/status', handleGetAutomationStatus);
router.post('/test-email', handleTestEmail);
router.post('/milestone', handleMilestoneNotification);
router.post('/dead-zone', handleDeadZoneNotification);
router.post('/sos', handleSosNotification);
router.post('/digest', handleDispatchEveningDigest);
router.post('/trigger-simulation', handleSimulateTrigger);
router.post('/schedule-custom', handleScheduleCustomBriefing);
router.post('/trigger-geofence', handleTriggerGeofenceCheck);
router.post('/reset-trigger', handleResetTrigger);

// Web Push (Standalone WebAPK / PWA)
router.get('/vapid-public-key', handleGetVapidPublicKey);
router.post('/push-subscribe', handlePushSubscribe);
router.post('/push-unsubscribe', handlePushUnsubscribe);
router.post('/test-push', handleTestPush);

export { router as notificationsRouter };

