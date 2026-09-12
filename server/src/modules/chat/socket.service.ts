import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';

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

export function initSocketServer(httpServer: HttpServer): SocketIOServer {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

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

    // Handle chat message broadcast
    socket.on('send_chat_message', (msg: ServerChatMessage) => {
      console.log(`💬 [Chat] ${msg.senderName}: "${msg.text.slice(0, 40)}..."`);
      // Broadcast to all other room members
      socket.to(FAMILY_ROOM).emit('receive_chat_message', {
        ...msg,
        status: 'delivered'
      });

      // Acknowledge back to sender
      socket.emit('message_ack', {
        id: msg.id,
        status: 'delivered'
      });
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
