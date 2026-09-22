import { Request, Response } from 'express';
import { SegmentModel } from '../../models/segment.model';
import { isMongoConnected } from '../../shared/lib/mongodb';
import { getIO, FAMILY_ROOM } from '../chat/socket.service';
import { automationService } from '../notifications/automation.service';
import { getGeminiClient } from '../../shared/lib/geminiClient';

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

export async function addCheckpointHandler(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { name, estimatedTime, elderComfortNote } = req.body;

  if (!name) {
    res.status(400).json({ success: false, error: 'Checkpoint name is required' });
    return;
  }

  const newCp = {
    id: `cp-${id}-${Date.now()}`,
    name,
    estimatedTime: estimatedTime || 'Flexible',
    done: false,
    elderComfortNote
  };

  try {
    const io = getIO();

    if (isMongoConnected()) {
      const segment = await SegmentModel.findOne({ id });
      if (!segment) {
        res.status(404).json({ success: false, error: 'Segment not found' });
        return;
      }
      segment.checkpoints.push(newCp as any);
      await segment.save();

      if (io) {
        io.to(FAMILY_ROOM).emit('segment_updated', { segmentId: id, segment });
      }

      res.json({ success: true, checkpoint: newCp, segment });
      return;
    }

    const seg = memorySegments.find(s => s.id === id);
    if (seg) {
      if (!seg.checkpoints) seg.checkpoints = [];
      seg.checkpoints.push(newCp);
      if (io) {
        io.to(FAMILY_ROOM).emit('segment_updated', { segmentId: id, segment: seg });
      }
    }
    res.json({ success: true, checkpoint: newCp, segment: seg });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function rebalanceItineraryHandler(req: Request, res: Response): Promise<void> {
  const { situationPrompt, flightDate } = req.body;

  try {
    const ai = getGeminiClient();

    if (!ai) {
      // Fallback structured heuristic guidance
      res.json({
        success: true,
        source: 'heuristic',
        plan: `🏔️ **Adaptive Pacing Protocol:**\n\n` +
          `1. **Senior Comfort First:** Ensure Sanjay Ji and Rajnish Ji rest in a comfortable hotel/dhabha with warm ginger tea while BRO clears the route.\n` +
          `2. **Schedule Recalibration:** Absorb delays using the Oct 01 buffer day. Do not rush mountain driving during evening hours.\n` +
          `3. **Flight Guarantee:** The return flight on Oct 02 (${flightDate || '13:15'}) remains 100% safe as long as the descent reaches the foothills by Oct 01 evening.`
      });
      return;
    }

    const systemPrompt = `You are the AI Mountain Highway Coordinator for TripTrack, an elder-first pilgrimage app for a 9-day pilgrimage to Badrinath Dham (Sep 24 – Oct 02, 2026).
Travellers: 4 pilgrims (Utkarsh & Shreyas as sons/coordinators, Rajnish Ji & Sanjay Ji as senior fathers in their 60s).
Critical Flight Constraint: Return flight on Oct 02 at 13:15 from Dehradun (DED) to Raipur.
Current Plan:
- Sep 24: Train Durg -> NDLS
- Sep 25: Cab NDLS -> Haridwar (Devpura)
- Sep 26: Ascent Haridwar -> Joshimath/Badrinath via NH-7
- Sep 27: Badrinath Temple Darshan, Brahma Kapal Tarpan & Mana Village
- Sep 28: Descent via Panch Prayags & Maa Dhari Devi -> Haridwar
- Sep 29: Full day Haridwar Sacred Sightseeing
- Sep 30: Rishikesh Sacred Exploration
- Oct 01: Buffer day (Mussoorie/Dehradun) -> Night near Jolly Grant Airport
- Oct 02: 13:15 IndiGo Flight home

The user is reporting a delay or roadblock condition on NH-7. Analyze the condition and provide a clear, calm, 3-point action plan:
1. Immediate elder comfort action (rest, hydration, warm tea, medication).
2. Schedule rebalancing adjustments (how to absorb delays using the Oct 01 buffer).
3. Reassurance that the Oct 02 13:15 flight remains safe and unhurried. Keep it concise (under 150 words).`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Situation: "${situationPrompt}"` }] }
      ]
    });

    const reply = response.text || 'Schedule successfully rebalanced with elder comfort priority.';

    res.json({
      success: true,
      source: 'gemini-2.5-flash',
      plan: reply
    });
  } catch (err: any) {
    console.warn('Gemini rebalance error:', err);
    res.json({
      success: true,
      source: 'fallback',
      plan: `🏔️ **Adaptive Pacing Protocol:**\n\n` +
        `1. **Elder Care:** Settle both fathers in comfortable warm seating with light satvik refreshments.\n` +
        `2. **Schedule Adaptation:** Shift subsequent stops forward. The Oct 01 buffer day absorbs highway delays without risk.\n` +
        `3. **Flight Safety:** Return flight on Oct 02 remains completely secure.`
    });
  }
}
