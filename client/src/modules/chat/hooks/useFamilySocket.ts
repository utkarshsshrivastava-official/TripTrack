import { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { UserProfile } from '../../../shared/types/user';
import { OfflineChatMessageRecord } from '../../../shared/db/dexie';
import {
  getLocalChatMessages,
  saveLocalChatMessage,
  getQueuedMessages,
  updateMessageStatus,
  syncWithCloudHistory,
  bulkSyncQueuedMessages,
  clearAllChatHistory
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
    // Hydrate from MongoDB Atlas cloud history
    syncWithCloudHistory().then(() => {
      loadMessages();
    });
  }, [loadMessages]);

  // Connect socket
  useEffect(() => {
    const serverUrl = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_BACKEND_URL) ||
      (window.location.hostname === 'localhost' ? 'http://localhost:5000' : window.location.origin);

    const socket = io(serverUrl, {
      auth: {
        pin: localStorage.getItem('triptrack_family_pin') || '2026'
      },
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

      // 1. Sync latest chat history from MongoDB Atlas
      await syncWithCloudHistory();

      // 2. Flush offline queued messages
      const queued = await getQueuedMessages();
      if (queued.length > 0) {
        console.log(`📡 Replaying ${queued.length} queued messages to family room...`);
        for (const msg of queued) {
          socket.emit('send_chat_message', msg);
          await updateMessageStatus(msg.id, 'sent');
        }
        await bulkSyncQueuedMessages();
      }
      loadMessages();
    });

    socket.on('disconnect', () => {
      console.log('🔌 Disconnected from family live socket');
      setIsConnected(false);
    });

    socket.on('receive_chat_message', async (incoming: OfflineChatMessageRecord) => {
      await saveLocalChatMessage(incoming);
      setMessages(prev => {
        if (prev.some(m => m.id === incoming.id)) {
          return prev.map(m => m.id === incoming.id ? incoming : m);
        }
        return [...prev, incoming].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      });
    });

    socket.on('message_ack', async (data: { id: string; status: 'delivered' }) => {
      await updateMessageStatus(data.id, data.status);
      setMessages(prev => prev.map(m => m.id === data.id ? { ...m, status: data.status } : m));
    });

    socket.on('chat_history_cleared', async () => {
      console.log('🧹 [Socket] Received chat_history_cleared from server');
      await clearAllChatHistory();
      setMessages([]);
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

    const handleOnline = async () => {
      console.log('🌐 Network restored: syncing chat with cloud...');
      await syncWithCloudHistory();
      await bulkSyncQueuedMessages();
      loadMessages();
    };

    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('online', handleOnline);
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
      senderDuo: activeUser.type === 'PILGRIM' ? activeUser.duoId : undefined,
      text: text.trim(),
      timestamp: new Date().toISOString(),
      status: isConnected ? 'sent' : 'queued'
    };

    // Save locally
    await saveLocalChatMessage(newMsg);
    setMessages(prev => [...prev, newMsg]);

    // Emit if socket is connected
    if (socketRef.current && isConnected) {
      socketRef.current.emit('send_chat_message', newMsg);
    }
  }, [activeUser, isConnected]);

  const sendTyping = useCallback((isTyping: boolean) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('typing', {
        userId: activeUser.id,
        userName: activeUser.name,
        isTyping
      });
    }
  }, [activeUser, isConnected]);

  const clearChat = useCallback(async () => {
    await clearAllChatHistory();
    setMessages([]);
  }, []);

  return {
    messages,
    isConnected,
    typingUser,
    sendMessage,
    sendTyping,
    clearChat
  };
}
