import { io, Socket } from 'socket.io-client';
import { UserProfile } from '../types/user';
import { TRAVELLERS_CONFIG } from '../config/travellers.config';

let globalSocket: Socket | null = null;
let currentActiveUser: UserProfile | null = null;

export function getSocketServerUrl(): string {
  if (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_BACKEND_URL) {
    return (import.meta as any).env.VITE_BACKEND_URL;
  }
  return window.location.hostname === 'localhost' ? 'http://localhost:5000' : window.location.origin;
}

/**
 * Initialize or re-authenticate the global application-wide Socket.io singleton
 */
export function initSocket(activeUser: UserProfile): Socket {
  currentActiveUser = activeUser;

  if (globalSocket && globalSocket.connected) {
    // Already connected, ensure active user joins the room
    globalSocket.emit('join_family_room', {
      userId: activeUser.id,
      userName: activeUser.name
    });
    return globalSocket;
  }

  if (!globalSocket) {
    const serverUrl = getSocketServerUrl();
    globalSocket = io(serverUrl, {
      auth: {
        pin: localStorage.getItem('triptrack_family_pin') || '2026'
      },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 2000,
      timeout: 10000
    });

    globalSocket.on('connect', () => {
      console.log('🔌 [Global Socket] Connected to Badrinath Family live server');
      if (currentActiveUser) {
        globalSocket?.emit('join_family_room', {
          userId: currentActiveUser.id,
          userName: currentActiveUser.name
        });
      }

      // Notify entire app that socket is online and data should reconcile
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('triptrack_socket_status', { detail: { connected: true } }));
        window.dispatchEvent(new CustomEvent('triptrack_network_sync'));
      }
    });

    globalSocket.on('disconnect', () => {
      console.log('🔌 [Global Socket] Disconnected from live server');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('triptrack_socket_status', { detail: { connected: false } }));
      }
    });

    globalSocket.on('connect_error', (err) => {
      console.warn('⚠️ [Global Socket] Connection error:', err.message);
    });
  }

  return globalSocket;
}

/**
 * Retrieve the active socket singleton
 */
export function getSocket(): Socket | null {
  return globalSocket;
}

/**
 * Check if the global socket is currently connected
 */
export function isSocketConnected(): boolean {
  return !!globalSocket && globalSocket.connected;
}

/**
 * Safely emit an event to the shared family server
 */
export function emitFamilyEvent(event: string, payload: any): void {
  if (globalSocket && globalSocket.connected) {
    globalSocket.emit(event, payload);
  } else {
    console.warn(`⚠️ [Global Socket] Cannot emit "${event}" - socket disconnected`);
  }
}

/**
 * Subscribe to a socket event
 */
export function onFamilyEvent(event: string, callback: (...args: any[]) => void): void {
  if (!globalSocket) {
    // If not yet initialized, lazily init with active user from storage or default
    const savedId = typeof window !== 'undefined' ? localStorage.getItem('triptrack_active_user_id') : null;
    const pilgrim = TRAVELLERS_CONFIG.find(t => t.id === savedId);
    if (pilgrim) {
      initSocket({
        id: pilgrim.id,
        name: pilgrim.name,
        type: 'PILGRIM',
        roleLabel: pilgrim.role === 'COORDINATOR' ? `${pilgrim.duoId === 'DUO_A' ? 'Family A' : 'Family B'} Coordinator` : 'Senior Elder',
        relation: pilgrim.relation,
        duoId: pilgrim.duoId,
        avatarColor: pilgrim.avatarColor
      });
    } else {
      initSocket({
        id: 'traveller-utkarsh',
        name: 'Utkarsh',
        type: 'PILGRIM',
        roleLabel: 'Coordinator & Son',
        relation: 'Son & Tech Lead',
        duoId: 'DUO_A',
        avatarColor: '#2563eb'
      });
    }
  }
  globalSocket?.on(event, callback);
}

/**
 * Unsubscribe from a socket event
 */
export function offFamilyEvent(event: string, callback: (...args: any[]) => void): void {
  globalSocket?.off(event, callback);
}
