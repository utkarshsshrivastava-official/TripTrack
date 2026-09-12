import { Request, Response } from 'express';
import { emailService } from './email.service';

export async function handleTestEmail(req: Request, res: Response) {
  try {
    const { recipient } = req.body;
    const result = await emailService.sendEmail(
      '🏔️ [TripTrack] Test Notification Dispatch',
      `
      <div style="font-family: Arial, sans-serif; background-color: #1c1917; color: #f5f5f4; padding: 20px; border-radius: 12px;">
        <h2 style="color: #f59e0b;">TripTrack Test Email Notification</h2>
        <p>This is a test notification confirming that the Google Gmail App Password notification system is functioning properly.</p>
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
