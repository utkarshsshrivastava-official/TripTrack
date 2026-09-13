import { Request, Response } from 'express';
import { getLiveRouteStatus, addFamilySpotterReport, RouteAlertPayload } from './routeAlert.service';
import { getIO } from '../chat/socket.service';

/**
 * GET /api/alerts/route-status
 * Fetches current NH-7 corridor health, landslides, and BRO clearances
 */
export async function getRouteStatusHandler(req: Request, res: Response): Promise<void> {
  try {
    const status = await getLiveRouteStatus();
    res.status(200).json({
      success: true,
      ...status
    });
  } catch (err: any) {
    console.error('Error fetching route status:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch route status'
    });
  }
}

/**
 * POST /api/alerts/report
 * Receives crowdsourced road spotter report from pilgrims on the road
 */
export async function postFamilySpotterReportHandler(req: Request, res: Response): Promise<void> {
  try {
    const reportData: RouteAlertPayload = req.body;

    if (!reportData.stretch || !reportData.location || !reportData.headline) {
      res.status(400).json({
        success: false,
        error: 'Missing required report fields (stretch, location, headline)'
      });
      return;
    }

    const saved = addFamilySpotterReport(reportData);

    // Broadcast spotter alert to family members via Socket.io if available
    try {
      const io = getIO();
      if (io) {
        io.to('badrinath-family-2026').emit('family_spotter_alert', saved);
      }
    } catch (socketErr) {
      console.warn('Socket broadcast failed for family spotter alert:', socketErr);
    }

    res.status(201).json({
      success: true,
      report: saved
    });
  } catch (err: any) {
    console.error('Error creating family spotter report:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to record spotter report'
    });
  }
}
