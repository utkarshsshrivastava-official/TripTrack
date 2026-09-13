import { Request, Response } from 'express';
import { SegmentModel } from '../../models/segment.model';
import { getIO } from '../chat/socket.service';

// In-memory fallback cache for zero-cost and offline reliability
let cachedLeg1DelayMinutes = 0;
let cachedLeg2DelayMinutes = 0;
let lastFlightDelayReportedBy = 'System Schedule';
let lastFlightDelayReportedAt = new Date();

export async function getFlight6EStatus(_req: Request, res: Response): Promise<void> {
  try {
    // Attempt to pull latest delay from Segment 'seg-6' if available in MongoDB
    try {
      const seg6 = await SegmentModel.findOne({ id: 'seg-6' });
      if (seg6 && typeof (seg6 as any).flightLeg1DelayMinutes === 'number') {
        cachedLeg1DelayMinutes = (seg6 as any).flightLeg1DelayMinutes;
      }
      if (seg6 && typeof (seg6 as any).flightLeg2DelayMinutes === 'number') {
        cachedLeg2DelayMinutes = (seg6 as any).flightLeg2DelayMinutes;
      }
    } catch {
      // Gracefully continue with in-memory cache
    }

    res.json({
      success: true,
      sonPnr: 'VGLHWK',
      elderPnr: 'L8CM7C',
      leg1: {
        flightNo: '6E 2476',
        origin: 'DED',
        destination: 'DEL (T2)',
        departure: '2026-10-02T13:15:00+05:30',
        arrival: '2026-10-02T14:10:00+05:30',
        delayMinutes: cachedLeg1DelayMinutes
      },
      transit: {
        location: 'DEL (T2 -> T1 Shuttle)',
        scheduledLayoverMinutes: 130,
        remainingLayoverMinutes: Math.max(0, 130 - cachedLeg1DelayMinutes)
      },
      leg2: {
        flightNo: '6E 734',
        origin: 'DEL (T1)',
        destination: 'RPR',
        departure: '2026-10-02T16:20:00+05:30',
        arrival: '2026-10-02T18:10:00+05:30',
        delayMinutes: cachedLeg2DelayMinutes
      },
      reportedBy: lastFlightDelayReportedBy,
      reportedAt: lastFlightDelayReportedAt,
      isRealTimeApiActive: Boolean(process.env.AVIATIONSTACK_API_KEY)
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
}

export async function updateFlight6EDelay(req: Request, res: Response): Promise<void> {
  try {
    const { leg1DelayMinutes, leg2DelayMinutes, reportedBy } = req.body;
    
    if (typeof leg1DelayMinutes === 'number') {
      cachedLeg1DelayMinutes = Math.max(0, Math.min(360, leg1DelayMinutes));
    }
    if (typeof leg2DelayMinutes === 'number') {
      cachedLeg2DelayMinutes = Math.max(0, Math.min(360, leg2DelayMinutes));
    }

    lastFlightDelayReportedBy = reportedBy || 'Family Flight Coordinator';
    lastFlightDelayReportedAt = new Date();

    // Persist to MongoDB if available
    try {
      await SegmentModel.findOneAndUpdate(
        { id: 'seg-6' },
        { 
          $set: { 
            flightLeg1DelayMinutes: cachedLeg1DelayMinutes,
            flightLeg2DelayMinutes: cachedLeg2DelayMinutes
          } 
        },
        { upsert: false }
      );
    } catch (err) {
      console.warn('Could not persist flight delay to MongoDB, using memory cache:', err);
    }

    // Broadcast to all connected family members via WebSockets
    try {
      const io = getIO();
      if (io) {
        io.emit('flight_delay_updated', {
          flightCode: '6E_RETURN',
          leg1DelayMinutes: cachedLeg1DelayMinutes,
          leg2DelayMinutes: cachedLeg2DelayMinutes,
          remainingLayoverMinutes: Math.max(0, 130 - cachedLeg1DelayMinutes),
          reportedBy: lastFlightDelayReportedBy,
          timestamp: lastFlightDelayReportedAt.toISOString()
        });
      }
    } catch {
      // Sockets optional
    }

    res.json({
      success: true,
      leg1DelayMinutes: cachedLeg1DelayMinutes,
      leg2DelayMinutes: cachedLeg2DelayMinutes,
      remainingLayoverMinutes: Math.max(0, 130 - cachedLeg1DelayMinutes),
      reportedBy: lastFlightDelayReportedBy,
      reportedAt: lastFlightDelayReportedAt
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
}
