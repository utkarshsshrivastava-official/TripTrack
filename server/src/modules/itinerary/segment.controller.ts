import { Request, Response } from 'express';
import { SegmentModel } from '../../models/segment.model';
import { isMongoConnected } from '../../shared/lib/mongodb';
import { getIO, FAMILY_ROOM } from '../chat/socket.service';
import { automationService } from '../notifications/automation.service';

// In-memory fallback segments storage when MongoDB is not connected
let memorySegments: any[] = [];

export function setMemorySegments(segs: any[]) {
  memorySegments = segs;
}

export async function getSegmentsHandler(_req: Request, res: Response): Promise<void> {
  try {
    if (isMongoConnected()) {
      const segments = await SegmentModel.find().sort({ departureTime: 1 });
      res.json({ success: true, mode: 'mongodb', data: segments });
      return;
    }
    res.json({ success: true, mode: 'memory', data: memorySegments });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function toggleCheckpointHandler(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const checkpointId = req.body.checkpointId || req.params.checkpointId;

  try {
    const io = getIO();

    if (isMongoConnected()) {
      const segment = await SegmentModel.findOne({ id });
      if (!segment) {
        res.status(404).json({ success: false, error: 'Segment not found' });
        return;
      }

      const cp = segment.checkpoints.find(c => c.id === checkpointId);
      if (cp) {
        cp.done = !cp.done;
        cp.completedAt = cp.done ? new Date() : undefined;
        await segment.save();

        if (cp.done) {
          automationService.checkAndTriggerMilestoneCheckpoint(checkpointId, cp.name, id)
            .catch(err => console.warn('⚠️ [Milestone Automation] Error:', err));
        }

        if (io) {
          io.to(FAMILY_ROOM).emit('checkpoint_updated', {
            segmentId: id,
            checkpointId,
            done: cp.done,
            completedAt: cp.completedAt ? cp.completedAt.toISOString() : undefined,
            checkpointName: cp.name
          });
        }
      }
      res.json({ success: true, segment });
      return;
    }

    // Memory fallback
    const seg = memorySegments.find(s => s.id === id);
    if (seg) {
      const cp = seg.checkpoints?.find((c: any) => c.id === checkpointId);
      if (cp) {
        cp.done = !cp.done;
        cp.completedAt = cp.done ? new Date().toISOString() : undefined;

        if (cp.done) {
          automationService.checkAndTriggerMilestoneCheckpoint(checkpointId, cp.name, id)
            .catch(err => console.warn('⚠️ [Milestone Automation] Error:', err));
        }

        if (io) {
          io.to(FAMILY_ROOM).emit('checkpoint_updated', {
            segmentId: id,
            checkpointId,
            done: cp.done,
            completedAt: cp.completedAt
          });
        }
      }
    }
    res.json({ success: true, segment: seg });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function updateStatusHandler(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { status } = req.body;

  try {
    if (isMongoConnected()) {
      const segment = await SegmentModel.findOneAndUpdate(
        { id },
        { status },
        { new: true }
      );
      res.json({ success: true, segment });
      return;
    }

    // Memory fallback
    const seg = memorySegments.find(s => s.id === id);
    if (seg) {
      seg.status = status;
    }
    res.json({ success: true, segment: seg });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function updateLogisticsHandler(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const updates = req.body;

  try {
    if (isMongoConnected()) {
      const segment = await SegmentModel.findOne({ id });
      if (!segment) {
        res.status(404).json({ success: false, error: 'Segment not found' });
        return;
      }
      segment.logistics = { ...segment.logistics, ...updates };
      await segment.save();
      res.json({ success: true, segment });
      return;
    }

    // Memory fallback
    const seg = memorySegments.find(s => s.id === id);
    if (seg) {
      seg.logistics = { ...seg.logistics, ...updates };
    }
    res.json({ success: true, segment: seg });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}
