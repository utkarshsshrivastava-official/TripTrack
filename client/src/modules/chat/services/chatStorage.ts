import { localDB, OfflineChatMessageRecord } from '../../../shared/db/dexie';

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
