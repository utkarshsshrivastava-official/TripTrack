import { Request, Response } from 'express';
import { emailService } from './email.service';
import { automationService } from './automation.service';

export async function handleTestEmail(req: Request, res: Response) {
  try {
    const { recipient } = req.body;
    const result = await emailService.sendEmail(
      '🏔️ [TripTrack by Ut-tech] Test Notification Dispatch',
      `
      <div style="font-family: Arial, sans-serif; background-color: #1c1917; color: #f5f5f4; padding: 20px; border-radius: 12px;">
        <h2 style="color: #f59e0b;">TripTrack by Ut-tech Test Email Notification</h2>
        <p>This is a test notification confirming that the family notification system is functioning properly.</p>
        <p style="color: #10b981;">✅ Ready for Badrinath Dham Sacred Pilgrimage 2026</p>
      </div>
      `,
      recipient ? [recipient] : undefined
    );

    res.json({
      ...result,
      message: result.simulated
        ? 'Test email simulated successfully (check server logs).'
        : 'Test email dispatched successfully via Gmail SMTP.'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function handleMilestoneNotification(req: Request, res: Response) {
  try {
    const { landmarkName, time, duoOrPilgrim, notes, nextMilestone, altitudeMeters } = req.body;
    if (!landmarkName || !time) {
      return res.status(400).json({ success: false, error: 'landmarkName and time are required' });
    }

    const result = await emailService.notifyMilestoneCrossed({
      landmarkName,
      time,
      duoOrPilgrim: duoOrPilgrim || 'Pilgrim Family',
      notes,
      nextMilestone,
      altitudeMeters
    });

    res.json({ success: true, result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function handleDeadZoneNotification(req: Request, res: Response) {
  try {
    const { segmentTitle, enteredAt, expectedSilenceHours, expectedReconnectionPoint } = req.body;
    const result = await emailService.notifyDeadZoneEntry({
      segmentTitle: segmentTitle || 'Alaknanda Gorge Route',
      enteredAt: enteredAt || new Date().toLocaleTimeString(),
      expectedSilenceHours: expectedSilenceHours || 2.5,
      expectedReconnectionPoint: expectedReconnectionPoint || 'Joshimath CHC'
    });

    res.json({ success: true, result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function handleSosNotification(req: Request, res: Response) {
  try {
    const { triggeredBy, duoName, timestamp, latitude, longitude, batteryLevel, seniorMedicalDossier } = req.body;
    if (!latitude || !longitude) {
      return res.status(400).json({ success: false, error: 'latitude and longitude are required for SOS dispatch' });
    }

    const result = await emailService.notifyEmergencySos({
      triggeredBy: triggeredBy || 'Pilgrim Coordinator',
      duoName: duoName || 'Family A',
      timestamp: timestamp || new Date().toLocaleString(),
      latitude,
      longitude,
      batteryLevel,
      seniorMedicalDossier
    });

    res.json({ success: true, result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function handleGetAutomationStatus(_req: Request, res: Response) {
  try {
    const status = automationService.getStatus();
    res.json({ success: true, data: status });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function handleDispatchEveningDigest(_req: Request, res: Response) {
  try {
    const digest = await automationService.compileAndSendDailyDigest(new Date());
    res.json({ success: true, message: 'Daily Sandhya Bulletin dispatched to family', digest });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function handleSimulateTrigger(req: Request, res: Response) {
  try {
    const { type, targetId } = req.body;
    if (!type) {
      return res.status(400).json({ success: false, error: 'type is required (BRIEFING | WAYPOINT | DIGEST)' });
    }
    const result = await automationService.simulateTrigger(type, targetId);
    res.json({ success: true, result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function handleScheduleCustomBriefing(req: Request, res: Response) {
  try {
    const { minutesFromNow, subject, transitInfo, highlights, elderCareTip, dayTitle } = req.body;
    const mins = Number(minutesFromNow) || 15;
    const scheduledTime = new Date(Date.now() + mins * 60 * 1000);

    const briefing = automationService.scheduleCustomBriefing({
      id: `briefing-custom-${Date.now()}`,
      phase: req.body.phase || 'PRE_DEPARTURE',
      timeSlot: req.body.timeSlot || 'AFTERNOON',
      dayTitle: dayTitle || `Test Briefing: ${mins} Mins Trigger`,
      scheduledFor: scheduledTime.toISOString(),
      subject: subject || `⏰ [TripTrack Test] Scheduled Briefing (${mins} Mins)`,
      transitInfo: transitInfo || `Automated schedule trigger executing at ${scheduledTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
      highlights: highlights || [
        `Target execution time: ${scheduledTime.toLocaleTimeString()}`,
        'Autonomous heartbeat checks every 60 seconds',
        'Direct SMTP transport to family inboxes'
      ],
      elderCareTip: elderCareTip || 'Test timer active. Elders comfortable and well rested.',
      logisticsSummary: 'Custom briefing queued in TripTrack Autonomous Engine.'
    });

    res.json({
      success: true,
      message: `Briefing scheduled for ${scheduledTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (in ${mins} minutes)`,
      briefing
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function handleTriggerGeofenceCheck(req: Request, res: Response) {
  try {
    const { latitude, longitude, passengerId } = req.body;
    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ success: false, error: 'latitude and longitude are required' });
    }

    const lat = Number(latitude);
    const lng = Number(longitude);

    const arrival = await automationService.checkAndTriggerGeofence(lat, lng, passengerId);
    res.json({
      success: true,
      detected: !!arrival,
      arrival: arrival || null,
      message: arrival 
        ? `📍 Geofence arrival detected: ${arrival.name}! Email alert dispatched.`
        : 'Coordinates processed, no new unnotified geofences matched.'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function handleResetTrigger(req: Request, res: Response) {
  try {
    const { triggerId } = req.body;
    if (!triggerId) {
      return res.status(400).json({ success: false, error: 'triggerId is required' });
    }
    automationService.resetTrigger(triggerId);
    res.json({ success: true, message: `Trigger ${triggerId} reset successfully.` });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// ==========================================
// WEB PUSH CONTROLLERS (STANDALONE WEBAPK)
// ==========================================

export async function handleGetVapidPublicKey(_req: Request, res: Response) {
  try {
    const { pushNotificationService } = await import('./pushNotification.service');
    const publicKey = pushNotificationService.getPublicKey();
    res.json({ success: true, publicKey });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function handlePushSubscribe(req: Request, res: Response) {
  try {
    const { userId, userName, subscription } = req.body;
    if (!userId || !subscription) {
      return res.status(400).json({ success: false, error: 'userId and subscription are required' });
    }

    const { pushNotificationService } = await import('./pushNotification.service');
    const record = await pushNotificationService.saveSubscription({
      userId,
      userName: userName || userId,
      subscription,
      userAgent: req.headers['user-agent']
    });

    res.json({ success: true, message: 'Push subscription registered successfully.', record });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function handlePushUnsubscribe(req: Request, res: Response) {
  try {
    const { endpoint } = req.body;
    if (!endpoint) {
      return res.status(400).json({ success: false, error: 'endpoint is required' });
    }

    const { pushNotificationService } = await import('./pushNotification.service');
    await pushNotificationService.removeSubscription(endpoint);
    res.json({ success: true, message: 'Push subscription removed successfully.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function handleTestPush(req: Request, res: Response) {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId is required' });
    }

    const { pushNotificationService } = await import('./pushNotification.service');
    const result = await pushNotificationService.sendTestPush(userId);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}


