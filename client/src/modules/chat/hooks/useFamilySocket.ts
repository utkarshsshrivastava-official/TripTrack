import { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { UserProfile } from '../../../shared/types/user';
import { OfflineChatMessageRecord } from '../../../shared/db/dexie';
import {
  getLocalChatMessages,
  saveLocalChatMessage,
  getQueuedMessages,
  updateMessageStatus
} from '../services/chatStorage';

export function useFamilySocket(activeUser: UserProfile) {
  const [messages, setMessages] = useState<OfflineChatMessageRecord[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const typingTimeoutRef = useRef<any>(null);

  // Load existing Dexie messages
  const loadMessages = useCallback(async () => {
    const loaded = await getLocalChatMessages();
    setMessages(loaded);
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // Connect socket
  useEffect(() => {
    const serverUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : window.location.origin;

    const socket = io(serverUrl, {
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 2000,
      timeout: 10000
    });

    socketRef.current = socket;

    socket.on('connect', async () => {
      console.log('🔌 Connected to family live socket');
      setIsConnected(true);

      // Join room
      socket.emit('join_family_room', {
        userId: activeUser.id,
        userName: activeUser.name
      });

      // Flush offline messages
      const queued = await getQueuedMessages();
      if (queued.length > 0) {
        console.log(`📡 Replaying ${queued.length} queued messages...`);
        for (const msg of queued) {
          socket.emit('send_chat_message', msg);
          await updateMessageStatus(msg.id, 'sent');
        }
        loadMessages();
      }
    });

    socket.on('disconnect', () => {
      console.log('🔌 Disconnected from family live socket');
      setIsConnected(false);
    });

    socket.on('receive_chat_message', async (incoming: OfflineChatMessageRecord) => {
      await saveLocalChatMessage(incoming);
      setMessages(prev => {
        if (prev.some(m => m.id === incoming.id)) return prev;
        return [...prev, incoming];
      });
    });

    socket.on('message_ack', async (data: { id: string; status: 'delivered' }) => {
      await updateMessageStatus(data.id, data.status);
      setMessages(prev => prev.map(m => m.id === data.id ? { ...m, status: data.status } : m));
    });

    socket.on('member_typing', (data: { userId: string; userName: string; isTyping: boolean }) => {
      if (data.userId !== activeUser.id && data.isTyping) {
        setTypingUser(data.userName);
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
          setTypingUser(null);
        }, 3000);
      } else if (!data.isTyping) {
        setTypingUser(null);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [activeUser.id, activeUser.name, loadMessages]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const newMsg: OfflineChatMessageRecord = {
      id: `chat-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      senderId: activeUser.id,
      senderName: activeUser.name,
      senderAvatarColor: activeUser.avatarColor,
      senderType: activeUser.type,
      senderDuo: activeUser.duoId,
      text: text.trim(),
      timestamp: new Date().toISOString(),
      status: socketRef.current?.connected ? 'sent' : 'queued'
    };

    // 1. Immediately save to local Dexie (Offline-First!)
    await saveLocalChatMessage(newMsg);
    setMessages(prev => [...prev, newMsg]);

    // 2. Broadcast via Socket if connected
    if (socketRef.current?.connected) {
      socketRef.current.emit('send_chat_message', newMsg);
    }
  }, [activeUser]);

  const sendTyping = useCallback((isTyping: boolean) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('typing_indicator', {
        userId: activeUser.id,
        userName: activeUser.name,
        isTyping
      });
    }
  }, [activeUser]);

  return {
    messages,
    isConnected,
    typingUser,
    sendMessage,
    sendTyping
  };
}
