import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { ChatMessageModel } from '../../models/chatMessage.model';
import { ExpenseModel } from '../../models/expense.model';
import { FamilyFeedModel } from '../../models/familyFeed.model';
import { SegmentModel } from '../../models/segment.model';
import { DocumentModel } from '../../models/document.model';
import { isMongoConnected } from '../../shared/lib/mongodb';
import { pushNotificationService } from '../notifications/pushNotification.service';

export const FAMILY_ROOM = 'badrinath-family-2026';

export interface ServerChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatarColor: string;
  senderType: 'PILGRIM' | 'GUEST';
  senderDuo?: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered';
}

let ioInstance: SocketIOServer | null = null;

export function getIO(): SocketIOServer | null {
  return ioInstance;
}

export function initSocketServer(httpServer: HttpServer): SocketIOServer {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PATCH', 'DELETE']
    }
  });

  ioInstance = io;

  io.on('connection', (socket: Socket) => {
    console.log(`🔌 [Socket.io] Member connected: ${socket.id}`);

    // Join family pilgrimage room
    socket.on('join_family_room', (data: { userId: string; userName: string }) => {
      socket.join(FAMILY_ROOM);
      console.log(`👨‍👩‍👧‍👦 [Family Room] ${data.userName || 'Member'} (${data.userId}) joined.`);
      
      // Notify other members
      socket.to(FAMILY_ROOM).emit('member_joined', {
        userId: data.userId,
        userName: data.userName,
        timestamp: new Date().toISOString()
      });
    });

    // ==========================================
    // 1. CHAT PERSISTENCE & BROADCAST
    // ==========================================
    socket.on('send_chat_message', async (msg: ServerChatMessage) => {
      console.log(`💬 [Chat] ${msg.senderName}: "${msg.text.slice(0, 40)}..."`);
      
      try {
        if (isMongoConnected()) {
          await ChatMessageModel.findOneAndUpdate(
            { id: msg.id },
            {
              id: msg.id,
              senderId: msg.senderId,
              senderName: msg.senderName,
              senderAvatarColor: msg.senderAvatarColor || '#2563eb',
              senderType: msg.senderType || 'PILGRIM',
              senderDuo: msg.senderDuo,
              text: msg.text,
              timestamp: new Date(msg.timestamp || Date.now()),
              status: 'delivered'
            },
            { upsert: true, new: true }
          );
        }
      } catch (dbErr) {
        console.error('⚠️ [Socket.io Chat] Failed to persist message to MongoDB Atlas:', dbErr);
      }

      // Broadcast to all other room members
      socket.to(FAMILY_ROOM).emit('receive_chat_message', {
        ...msg,
        status: 'delivered'
      });

      // Dispatch Web Push notification to all other family members (for backgrounded WebAPKs)
      pushNotificationService.sendChatPushToFamily(msg).catch(err => {
        console.warn('⚠️ [WebPush] Async family push error:', err.message || err);
      });

      // Acknowledge back to sender
      socket.emit('message_ack', {
        id: msg.id,
        status: 'delivered'
      });
    });

    // ==========================================
    // 2. GULLAK EXPENSES PERSISTENCE & BROADCAST
    // ==========================================
    socket.on('send_expense', async (expenseData: any) => {
      console.log(`💰 [Socket.io Gullak] New expense from ${expenseData.paidBy}: ₹${expenseData.amountINR} (${expenseData.title})`);
      try {
        if (isMongoConnected() && expenseData.id) {
          await ExpenseModel.findOneAndUpdate(
            { id: expenseData.id },
            {
              id: expenseData.id,
              title: expenseData.title,
              amountINR: Number(expenseData.amountINR),
              paidBy: expenseData.paidBy,
              category: expenseData.category,
              receiptUrl: expenseData.receiptUrl,
              createdAt: expenseData.createdAt ? new Date(expenseData.createdAt) : new Date()
            },
            { upsert: true, new: true }
          );
        }
      } catch (err) {
        console.error('⚠️ [Socket.io Gullak] Failed to persist expense to MongoDB:', err);
      }

      // Broadcast to all devices in the room (including sender or others)
      io.to(FAMILY_ROOM).emit('receive_expense', expenseData);
    });

    socket.on('delete_expense', async (data: { id: string }) => {
      console.log(`💰 [Socket.io Gullak] Delete expense ${data.id}`);
      try {
        if (isMongoConnected() && data.id) {
          await ExpenseModel.findOneAndDelete({ id: data.id });
        }
      } catch (err) {
        console.error('⚠️ [Socket.io Gullak] Failed to delete expense from MongoDB:', err);
      }

      io.to(FAMILY_ROOM).emit('expense_removed', { id: data.id });
    });

    // ==========================================
    // 3. FAMILY FEED PERSISTENCE & BROADCAST
    // ==========================================
    socket.on('send_feed_post', async (feedData: any) => {
      console.log(`📰 [Socket.io Feed] New post from ${feedData.speakerId}: "${feedData.title}"`);
      try {
        if (isMongoConnected() && feedData.id) {
          await FamilyFeedModel.findOneAndUpdate(
            { id: feedData.id },
            {
              id: feedData.id,
              type: feedData.type,
              title: feedData.title,
              description: feedData.description,
              timestamp: feedData.timestamp ? new Date(feedData.timestamp) : new Date(),
              speakerId: feedData.speakerId,
              locationName: feedData.locationName || 'En Route',
              duoId: feedData.duoId || 'ALL',
              category: feedData.category,
              statusBadge: feedData.statusBadge,
              metadata: feedData.metadata
            },
            { upsert: true, new: true }
          );
        }
      } catch (err) {
        console.error('⚠️ [Socket.io Feed] Failed to persist feed post to MongoDB:', err);
      }

      io.to(FAMILY_ROOM).emit('receive_feed_post', feedData);
    });

    socket.on('delete_feed_post', async (data: { id: string }) => {
      console.log(`📰 [Socket.io Feed] Delete feed post ${data.id}`);
      try {
        if (isMongoConnected() && data.id) {
          await FamilyFeedModel.findOneAndDelete({ id: data.id });
        }
      } catch (err) {
        console.error('⚠️ [Socket.io Feed] Failed to delete feed post from MongoDB:', err);
      }

      io.to(FAMILY_ROOM).emit('feed_post_removed', { id: data.id });
    });

    socket.on('clear_feed', async () => {
      console.log('📰 [Socket.io Feed] Clear all family feed requested');
      try {
        if (isMongoConnected()) {
          await FamilyFeedModel.deleteMany({});
        }
      } catch (err) {
        console.error('⚠️ [Socket.io Feed] Failed to clear feed posts from MongoDB:', err);
      }

      io.to(FAMILY_ROOM).emit('feed_cleared', { timestamp: new Date().toISOString() });
    });

    // ==========================================
    // 4. ITINERARY CHECKPOINT LIVE SYNC
    // ==========================================
    socket.on('toggle_checkpoint', async (data: { segmentId: string; checkpointId: string }) => {
      console.log(`🧭 [Socket.io Itinerary] Toggle checkpoint ${data.checkpointId} in segment ${data.segmentId}`);
      try {
        if (isMongoConnected()) {
          const segment = await SegmentModel.findOne({ id: data.segmentId });
          if (segment) {
            const cp = segment.checkpoints.find(c => c.id === data.checkpointId);
            if (cp) {
              cp.done = !cp.done;
              cp.completedAt = cp.done ? new Date() : undefined;
              await segment.save();

              io.to(FAMILY_ROOM).emit('checkpoint_updated', {
                segmentId: data.segmentId,
                checkpointId: data.checkpointId,
                done: cp.done,
                completedAt: cp.completedAt ? cp.completedAt.toISOString() : undefined,
                checkpointName: cp.name
              });
              return;
            }
          }
        }
      } catch (err) {
        console.error('⚠️ [Socket.io Itinerary] Failed to update checkpoint in MongoDB:', err);
      }

      // If mongo failed or not connected, still broadcast state toggle
      io.to(FAMILY_ROOM).emit('checkpoint_updated', {
        segmentId: data.segmentId,
        checkpointId: data.checkpointId
      });
    });

    // ==========================================
    // 5. DOCUMENT VAULT LIVE SYNC
    // ==========================================
    socket.on('send_document', async (docData: any) => {
      console.log(`📂 [Socket.io Vault] New document from ${docData.passengerId}: "${docData.title}"`);
      try {
        if (isMongoConnected()) {
          await DocumentModel.findOneAndUpdate(
            { id: docData.id },
            docData,
            { upsert: true, new: true, setDefaultsOnInsert: true }
          );
        }
      } catch (err) {
        console.error('⚠️ [Socket.io Vault] Failed to persist document to MongoDB:', err);
      }

      socket.to(FAMILY_ROOM).emit('receive_document', docData);
    });

    socket.on('delete_document', async (data: { id: string }) => {
      console.log(`🗑️ [Socket.io Vault] Delete document ${data.id}`);
      try {
        if (isMongoConnected()) {
          await DocumentModel.deleteOne({ $or: [{ id: data.id }, { _id: data.id }] });
        }
      } catch (err) {
        console.error('⚠️ [Socket.io Vault] Failed to delete document from MongoDB:', err);
      }

      socket.to(FAMILY_ROOM).emit('document_removed', { id: data.id });
    });

    // Handle typing indicator
    socket.on('typing_indicator', (data: { userId: string; userName: string; isTyping: boolean }) => {
      socket.to(FAMILY_ROOM).emit('member_typing', data);
    });

    // Handle elder quick reassure ping
    socket.on('elder_ping', (data: { elderName: string; note: string }) => {
      console.log(`🔔 [Elder Ping] ${data.elderName}: ${data.note}`);
      io.to(FAMILY_ROOM).emit('elder_reassurance_ping', {
        ...data,
        timestamp: new Date().toISOString()
      });
    });

    socket.on('disconnect', () => {
      console.log(`🔌 [Socket.io] Member disconnected: ${socket.id}`);
    });
  });

  return io;
}
