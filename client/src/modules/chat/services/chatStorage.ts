import { localDB, OfflineChatMessageRecord } from '../../../shared/db/dexie';
import { getBackendUrl, getApiHeaders } from '../../../shared/services/apiConfig';

const INITIAL_CHAT_SEEDS: OfflineChatMessageRecord[] = [
  {
    id: 'msg-seed-1',
    senderId: 'traveller-utkarsh',
    senderName: 'Utkarsh',
    senderAvatarColor: '#2563eb',
    senderType: 'PILGRIM',
    senderDuo: 'DUO_A',
    text: 'Har Har Mahadev! 🙏 TripTrack is live. Cab bookings and Haridwar train tickets are cached offline.',
    timestamp: '2026-09-24T05:00:00.000Z',
    status: 'delivered'
  },
  {
    id: 'msg-seed-2',
    senderId: 'traveller-rajnish',
    senderName: 'Rajnish (Dad)',
    senderAvatarColor: '#dc2626',
    senderType: 'PILGRIM',
    senderDuo: 'DUO_A',
    text: 'Jai Badri Vishal! Reached railway station safely. All woolens packed.',
    timestamp: '2026-09-24T05:30:00.000Z',
    status: 'delivered'
  },
  {
    id: 'msg-seed-3',
    senderId: 'guest-1',
    senderName: 'Home Family 1 (Mummy)',
    senderAvatarColor: '#8b5cf6',
    senderType: 'GUEST',
    text: 'Subh Yatra! Have a safe journey. Keep taking warm water and checking blood pressure.',
    timestamp: '2026-09-24T05:45:00.000Z',
    status: 'delivered'
  }
];

export async function getLocalChatMessages(): Promise<OfflineChatMessageRecord[]> {
  try {
    const count = await localDB.offlineChatMessages.count();
    if (count === 0) {
      await localDB.offlineChatMessages.bulkAdd(INITIAL_CHAT_SEEDS);
      return INITIAL_CHAT_SEEDS;
    }
    const msgs = await localDB.offlineChatMessages.toArray();
    return msgs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  } catch (err) {
    console.error('Failed to get local chat messages:', err);
    return INITIAL_CHAT_SEEDS;
  }
}

export async function saveLocalChatMessage(msg: OfflineChatMessageRecord): Promise<void> {
  try {
    await localDB.offlineChatMessages.put(msg);
  } catch (err) {
    console.error('Failed to save local chat message:', err);
  }
}

export async function getQueuedMessages(): Promise<OfflineChatMessageRecord[]> {
  try {
    return await localDB.offlineChatMessages.where('status').equals('queued').toArray();
  } catch (err) {
    console.error('Failed to get queued messages:', err);
    return [];
  }
}

export async function updateMessageStatus(id: string, status: 'queued' | 'sent' | 'delivered'): Promise<void> {
  try {
    await localDB.offlineChatMessages.update(id, { status });
  } catch (err) {
    console.error('Failed to update message status:', err);
  }
}

/**
 * Hydrates local Dexie cache with MongoDB Atlas chat history.
 * Preserves local queued messages that have not yet synced.
 */
export async function syncWithCloudHistory(): Promise<{ synced: number; total: number }> {
  try {
    const backendUrl = getBackendUrl();
    const res = await fetch(`${backendUrl}/api/chat/history?limit=100`, {
      headers: getApiHeaders()
    });

    if (!res.ok) {
      console.warn(`⚠️ [Chat Storage] Cloud history fetch returned status ${res.status}`);
      const count = await localDB.offlineChatMessages.count();
      return { synced: 0, total: count };
    }

    const data = await res.json();
    if (data.success && Array.isArray(data.messages)) {
      const existing = await localDB.offlineChatMessages.toArray();
      const localMap = new Map(existing.map(m => [m.id, m]));

      let newCount = 0;
      for (const cloudMsg of data.messages) {
        const local = localMap.get(cloudMsg.id);
        // Do not overwrite a locally queued message that hasn't finished dispatching
        if (local && local.status === 'queued') {
          continue;
        }

        await localDB.offlineChatMessages.put({
          id: cloudMsg.id,
          senderId: cloudMsg.senderId,
          senderName: cloudMsg.senderName,
          senderAvatarColor: cloudMsg.senderAvatarColor || '#2563eb',
          senderType: cloudMsg.senderType || 'PILGRIM',
          senderDuo: cloudMsg.senderDuo,
          text: cloudMsg.text,
          timestamp: cloudMsg.timestamp,
          status: 'delivered'
        });
        newCount++;
      }

      console.log(`☁️ [Chat Storage] Synced ${newCount} messages from MongoDB Atlas to Dexie.`);
      const total = await localDB.offlineChatMessages.count();
      return { synced: newCount, total };
    }

    const total = await localDB.offlineChatMessages.count();
    return { synced: 0, total };
  } catch (err) {
    console.warn('⚠️ [Chat Storage] Offline or error syncing with cloud history:', err);
    const count = await localDB.offlineChatMessages.count();
    return { synced: 0, total: count };
  }
}

/**
 * Flushes all locally queued messages to MongoDB Atlas via HTTP POST /api/chat/sync.
 */
export async function bulkSyncQueuedMessages(): Promise<number> {
  try {
    const queued = await getQueuedMessages();
    if (queued.length === 0) return 0;

    const backendUrl = getBackendUrl();
    const res = await fetch(`${backendUrl}/api/chat/sync`, {
      method: 'POST',
      headers: getApiHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ messages: queued })
    });

    if (!res.ok) {
      console.warn(`⚠️ [Chat Storage] Bulk sync failed with status ${res.status}`);
      return 0;
    }

    const data = await res.json();
    if (data.success) {
      for (const msg of queued) {
        await updateMessageStatus(msg.id, 'delivered');
      }
      console.log(`📡 [Chat Storage] Successfully flushed ${queued.length} queued messages to cloud.`);
      return queued.length;
    }
    return 0;
  } catch (err) {
    console.warn('⚠️ [Chat Storage] Could not flush queued messages to cloud (offline):', err);
    return 0;
  }
}

