import { Request, Response } from 'express';
import { SegmentModel } from '../../models/segment.model';
import { getIO } from '../chat/socket.service';

// In-memory fallback cache for zero-cost and offline reliability
let cachedDelayMinutes = 0;
let lastDelayReportedBy = 'System Timetable';
let lastDelayReportedAt = new Date();

export async function getTrain12441Status(_req: Request, res: Response): Promise<void> {
  try {
    // Attempt to pull latest delay from Segment 'seg-1' if available in MongoDB
    try {
      const seg1 = await SegmentModel.findOne({ id: 'seg-1' });
      if (seg1 && typeof (seg1 as any).trainDelayMinutes === 'number') {
        cachedDelayMinutes = (seg1 as any).trainDelayMinutes;
      }
    } catch {
      // Gracefully continue with in-memory cache
    }

    res.json({
      success: true,
      trainNo: '12441',
      trainName: 'BSP NDLS RAJ EX',
      pnr: '6709136735',
      serviceClass: 'SECOND AC (2A)',
      quota: 'GENERAL (GN)',
      distanceKm: 1362,
      coach: 'A2',
      berths: '19, 20, 21, 22',
      departureScheduled: '2026-09-24T16:30:00+05:30',
      arrivalScheduled: '2026-09-25T10:40:00+05:30',
      delayMinutes: cachedDelayMinutes,
      reportedBy: lastDelayReportedBy,
      reportedAt: lastDelayReportedAt,
      isRealTimeApiActive: Boolean(process.env.RAILRADAR_API_KEY)
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
}

export async function updateTrain12441Delay(req: Request, res: Response): Promise<void> {
  try {
    const { delayMinutes, reportedBy } = req.body;
    const parsedDelay = Math.max(0, Math.min(720, Number(delayMinutes) || 0)); // max 12 hours

    cachedDelayMinutes = parsedDelay;
    lastDelayReportedBy = reportedBy || 'Family Coordinator';
    lastDelayReportedAt = new Date();

    // Persist to MongoDB if available
    try {
      await SegmentModel.findOneAndUpdate(
        { id: 'seg-1' },
        { $set: { trainDelayMinutes: parsedDelay } },
        { upsert: false }
      );
    } catch (err) {
      console.warn('Could not persist train delay to MongoDB, using memory cache:', err);
    }

    // Broadcast to all connected family members via WebSockets
    try {
      const io = getIO();
      if (io) {
        io.emit('train_delay_updated', {
          trainNo: '12441',
          delayMinutes: parsedDelay,
          reportedBy: lastDelayReportedBy,
          timestamp: lastDelayReportedAt.toISOString()
        });
      }
    } catch {
      // Sockets optional
    }

    res.json({
      success: true,
      trainNo: '12441',
      delayMinutes: parsedDelay,
      reportedBy: lastDelayReportedBy,
      reportedAt: lastDelayReportedAt
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
}
