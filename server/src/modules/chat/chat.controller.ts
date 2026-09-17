import { Request, Response } from 'express';
import { ChatMessageModel } from '../../models/chatMessage.model';
import { isMongoConnected } from '../../shared/lib/mongodb';

export async function getChatHistory(req: Request, res: Response): Promise<void> {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 100, 200);

    if (!isMongoConnected()) {
      res.json({
        success: true,
        source: 'in-memory-empty',
        messages: []
      });
      return;
    }

    const messages = await ChatMessageModel.find()
      .sort({ timestamp: 1 })
      .limit(limit)
      .lean();

    res.json({
      success: true,
      source: 'mongodb',
      count: messages.length,
      messages: messages.map(m => ({
        id: m.id,
        senderId: m.senderId,
        senderName: m.senderName,
        senderAvatarColor: m.senderAvatarColor,
        senderType: m.senderType,
        senderDuo: m.senderDuo,
        text: m.text,
        timestamp: new Date(m.timestamp).toISOString(),
        status: m.status
      }))
    });
  } catch (error: any) {
    console.error('❌ [Chat Controller] Error retrieving chat history:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function syncOfflineMessages(req: Request, res: Response): Promise<void> {
  try {
    const { messages } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      res.json({ success: true, syncedCount: 0, message: 'No messages provided to sync.' });
      return;
    }

    if (!isMongoConnected()) {
      res.json({
        success: true,
        syncedCount: 0,
        message: 'Database currently disconnected. Kept in offline queue.'
      });
      return;
    }

    const operations = messages.map((msg: any) => ({
      updateOne: {
        filter: { id: msg.id },
        update: {
          $set: {
            id: msg.id,
            senderId: msg.senderId,
            senderName: msg.senderName,
            senderAvatarColor: msg.senderAvatarColor || '#2563eb',
            senderType: msg.senderType || 'PILGRIM',
            senderDuo: msg.senderDuo,
            text: msg.text,
            timestamp: new Date(msg.timestamp || Date.now()),
            status: 'delivered' as const
          }
        },
        upsert: true
      }
    }));

    const result = await ChatMessageModel.bulkWrite(operations);
    const syncedCount = (result.upsertedCount || 0) + (result.modifiedCount || 0);

    res.json({
      success: true,
      syncedCount,
      message: `Successfully synchronized ${syncedCount} messages to MongoDB Atlas.`
    });
  } catch (error: any) {
    console.error('❌ [Chat Controller] Error syncing offline messages:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function clearChatHistory(req: Request, res: Response): Promise<void> {
  try {
    if (!isMongoConnected()) {
      res.json({ success: true, message: 'Database offline.' });
      return;
    }

    const deleteResult = await ChatMessageModel.deleteMany({});
    console.log(`🧹 [Chat Controller] Cleared all chat history from MongoDB Atlas (${deleteResult.deletedCount} messages deleted).`);

    // Broadcast chat_history_cleared to all connected family socket clients
    try {
      const { getIO } = require('./socket.service');
      const io = getIO();
      if (io) {
        io.to('badrinath-family-2026').emit('chat_history_cleared');
      }
    } catch (socketErr) {
      console.warn('Socket broadcast for chat clear failed', socketErr);
    }

    res.json({
      success: true,
      deletedCount: deleteResult.deletedCount,
      message: 'Chat history cleared successfully across all devices.'
    });
  } catch (error: any) {
    console.error('❌ [Chat Controller] Error clearing chat history:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
