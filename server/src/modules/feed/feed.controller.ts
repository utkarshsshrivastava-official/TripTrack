import { Request, Response } from 'express';
import { FamilyFeedModel } from '../../models/familyFeed.model';
import { isMongoConnected } from '../../shared/lib/mongodb';
import { getIO, FAMILY_ROOM } from '../chat/socket.service';

// In-memory fallback if MongoDB is not connected
let memoryFeed: any[] = [];

export async function getFeedHandler(_req: Request, res: Response): Promise<void> {
  try {
    if (isMongoConnected()) {
      const items = await FamilyFeedModel.find().sort({ timestamp: -1 });
      res.json({
        success: true,
        mode: 'mongodb',
        data: items.map(item => ({
          id: item.id,
          type: item.type,
          title: item.title,
          description: item.description,
          timestamp: item.timestamp.toISOString(),
          speakerId: item.speakerId,
          locationName: item.locationName,
          duoId: item.duoId,
          category: item.category,
          statusBadge: item.statusBadge,
          metadata: item.metadata
        }))
      });
      return;
    }

    res.json({
      success: true,
      mode: 'memory',
      data: memoryFeed
    });
  } catch (err: any) {
    console.error('⚠️ [Feed API] Error fetching feed items:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function createFeedItemHandler(req: Request, res: Response): Promise<void> {
  try {
    const {
      id,
      type,
      title,
      description,
      timestamp,
      speakerId,
      locationName,
      duoId,
      category,
      statusBadge,
      metadata
    } = req.body;

    if (!id || !type || !title || !description || !speakerId) {
      res.status(400).json({ success: false, error: 'Missing required feed fields' });
      return;
    }

    const payload = {
      id,
      type,
      title,
      description,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      speakerId,
      locationName: locationName || 'En Route',
      duoId: duoId || 'ALL',
      category,
      statusBadge,
      metadata
    };

    if (isMongoConnected()) {
      await FamilyFeedModel.findOneAndUpdate(
        { id },
        payload,
        { upsert: true, new: true }
      );
    } else {
      const idx = memoryFeed.findIndex(item => item.id === id);
      const jsonItem = { ...payload, timestamp: payload.timestamp.toISOString() };
      if (idx >= 0) {
        memoryFeed[idx] = jsonItem;
      } else {
        memoryFeed.unshift(jsonItem);
      }
    }

    const broadcastItem = {
      ...payload,
      timestamp: payload.timestamp.toISOString()
    };

    // Broadcast live to all family devices in pilgrimage room
    const io = getIO();
    if (io) {
      io.to(FAMILY_ROOM).emit('receive_feed_post', broadcastItem);
    }

    console.log(`📰 [Feed API] Published feed item "${title}" by ${speakerId}`);
    res.status(201).json({ success: true, data: broadcastItem });
  } catch (err: any) {
    console.error('⚠️ [Feed API] Error creating feed item:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function deleteFeedItemHandler(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    if (isMongoConnected()) {
      await FamilyFeedModel.findOneAndDelete({ id });
    } else {
      memoryFeed = memoryFeed.filter(item => item.id !== id);
    }

    // Broadcast removal to all family devices
    const io = getIO();
    if (io) {
      io.to(FAMILY_ROOM).emit('feed_post_removed', { id });
    }

    res.json({ success: true, message: `Feed item ${id} deleted` });
  } catch (err: any) {
    console.error('⚠️ [Feed API] Error deleting feed item:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function clearFeedHandler(_req: Request, res: Response): Promise<void> {
  try {
    if (isMongoConnected()) {
      await FamilyFeedModel.deleteMany({});
    }
    memoryFeed = [];

    const io = getIO();
    if (io) {
      io.to(FAMILY_ROOM).emit('feed_cleared', { timestamp: new Date().toISOString() });
    }

    console.log('📰 [Feed API] All family feed items cleared.');
    res.json({ success: true, message: 'All feed items cleared' });
  } catch (err: any) {
    console.error('⚠️ [Feed API] Error clearing feed items:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}
