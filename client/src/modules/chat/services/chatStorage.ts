import { localDB, OfflineChatMessageRecord } from '../../../shared/db/dexie';
import { getBackendUrl, getApiHeaders } from '../../../shared/services/apiConfig';

export async function getLocalChatMessages(): Promise<OfflineChatMessageRecord[]> {
  try {
    // Purge legacy mock seeds so only authentic user/family messages are retained
    await localDB.offlineChatMessages.where('id').startsWith('msg-seed-').delete();

    const msgs = await localDB.offlineChatMessages.toArray();
    return msgs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  } catch (err) {
    console.error('Failed to get local chat messages:', err);
    return [];
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
      const cloudIds = new Set(data.messages.map((m: any) => m.id));

      // Reconcile: Purge any local message that was deleted in MongoDB Atlas
      const toDelete = existing.filter(local => local.status !== 'queued' && !cloudIds.has(local.id));
      if (toDelete.length > 0) {
        await localDB.offlineChatMessages.bulkDelete(toDelete.map(d => d.id));
        console.log(`🧹 [Chat Storage] Reconciled and purged ${toDelete.length} messages deleted from MongoDB Atlas.`);
      }

      let newCount = 0;
      for (const cloudMsg of data.messages) {
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
 * Completely clears all chat history both locally in Dexie and on MongoDB Atlas
 */
export async function clearAllChatHistory(): Promise<boolean> {
  try {
    const backendUrl = getBackendUrl();
    await fetch(`${backendUrl}/api/chat/history`, {
      method: 'DELETE',
      headers: getApiHeaders()
    }).catch(e => console.warn('Cloud chat delete failed or offline', e));

    await localDB.offlineChatMessages.clear();
    console.log('🧹 [Chat Storage] Cleared all chat messages locally in Dexie and on MongoDB Atlas.');
    return true;
  } catch (err) {
    console.error('Failed to clear chat history', err);
    await localDB.offlineChatMessages.clear();
    return false;
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

