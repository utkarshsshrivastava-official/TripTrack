import webpush from 'web-push';
import { PushSubscriptionModel } from '../../models/pushSubscription.model';
import { isMongoConnected } from '../../shared/lib/mongodb';

// Default fallback keys if not in env
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || 'BDRY-W3qw4-oEUxq8el3fpaTs-rB1HURGXWql5zyIBohVr2KVCN8ogCIrUR5w6D33sbHxqhRMjzf08BkWg2WUZo';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || 'U7e_9uM289pWnitLT6143jIfFMGlxMxL55BQ7Yt_bp4';
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:utkarshshrivastava.13@gmail.com';

try {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
  console.log('🔔 [WebPush] VAPID configuration initialized successfully.');
} catch (err) {
  console.error('⚠️ [WebPush] Failed to initialize VAPID details:', err);
}

export class PushNotificationService {
  /**
   * Return the public key needed by browser / WebAPK to register
   */
  getPublicKey(): string {
    return VAPID_PUBLIC_KEY;
  }

  /**
   * Save or update a family member's device subscription
   */
  async saveSubscription(data: {
    userId: string;
    userName: string;
    subscription: {
      endpoint: string;
      keys: {
        p256dh: string;
        auth: string;
      };
    };
    userAgent?: string;
  }) {
    if (!isMongoConnected()) {
      console.warn('⚠️ [WebPush] Cannot save subscription: MongoDB not connected.');
      return null;
    }

    const { userId, userName, subscription, userAgent } = data;
    if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
      throw new Error('Invalid Web Push subscription payload.');
    }

    const record = await PushSubscriptionModel.findOneAndUpdate(
      { endpoint: subscription.endpoint },
      {
        userId,
        userName,
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth
        },
        userAgent: userAgent || 'TripTrack Standalone WebAPK'
      },
      { upsert: true, new: true }
    );

    console.log(`📱 [WebPush] Saved push subscription for ${userName} (${userId})`);
    return record;
  }

  /**
   * Remove a subscription when user opts out or uninstalls
   */
  async removeSubscription(endpoint: string) {
    if (!isMongoConnected() || !endpoint) return;
    await PushSubscriptionModel.findOneAndDelete({ endpoint });
    console.log('📱 [WebPush] Removed subscription for endpoint:', endpoint.slice(0, 30) + '...');
  }

  /**
   * Broadcast background push to all family members except the sender
   */
  async sendChatPushToFamily(msg: {
    senderId: string;
    senderName: string;
    text: string;
  }) {
    if (!isMongoConnected()) return;

    try {
      // Find all subscriptions for family members other than sender
      const subscriptions = await PushSubscriptionModel.find({
        userId: { $ne: msg.senderId }
      });

      if (!subscriptions || subscriptions.length === 0) {
        return;
      }

      const bodyText = msg.text.length > 120 ? `${msg.text.slice(0, 117)}...` : msg.text;

      const payload = JSON.stringify({
        title: `TripTrack • ${msg.senderName}`,
        body: bodyText,
        icon: '/pwa-192x192.png',
        badge: '/favicon.svg',
        tag: 'triptrack-chat',
        data: {
          url: '/?openChat=true',
          senderId: msg.senderId,
          senderName: msg.senderName,
          timestamp: new Date().toISOString()
        }
      });

      console.log(`🔔 [WebPush] Dispatching background push to ${subscriptions.length} family devices for "${msg.senderName}"...`);

      const promises = subscriptions.map(async sub => {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.keys.p256dh,
                auth: sub.keys.auth
              }
            },
            payload
          );
        } catch (err: any) {
          // If status is 404 (Not Found) or 410 (Gone), device unsubscribed or token expired
          if (err.statusCode === 404 || err.statusCode === 410) {
            console.log(`🧹 [WebPush] Cleaning expired subscription for endpoint: ${sub.endpoint.slice(0, 30)}...`);
            await PushSubscriptionModel.findOneAndDelete({ endpoint: sub.endpoint }).catch(() => {});
          } else {
            console.warn(`⚠️ [WebPush] Push dispatch error for ${sub.userName}:`, err.message || err);
          }
        }
      });

      await Promise.allSettled(promises);
    } catch (outerErr) {
      console.error('⚠️ [WebPush] Failed family push dispatch:', outerErr);
    }
  }

  /**
   * Send a test push notification to a specific user
   */
  async sendTestPush(userId: string) {
    if (!isMongoConnected()) {
      throw new Error('MongoDB not connected');
    }

    const subscriptions = await PushSubscriptionModel.find({ userId });
    if (!subscriptions || subscriptions.length === 0) {
      return { success: false, message: 'No registered push devices found for this user.' };
    }

    const payload = JSON.stringify({
      title: '🏔️ TripTrack WebAPK Push Active',
      body: 'Live background notifications are working perfectly on this device!',
      icon: '/pwa-192x192.png',
      badge: '/favicon.svg',
      tag: 'triptrack-test',
      data: {
        url: '/?openChat=true',
        timestamp: new Date().toISOString()
      }
    });

    let sent = 0;
    for (const sub of subscriptions) {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.keys.p256dh,
              auth: sub.keys.auth
            }
          },
          payload
        );
        sent++;
      } catch (err: any) {
        if (err.statusCode === 404 || err.statusCode === 410) {
          await PushSubscriptionModel.findOneAndDelete({ endpoint: sub.endpoint }).catch(() => {});
        }
      }
    }

    return {
      success: true,
      message: `Test push sent to ${sent} device(s).`
    };
  }
}

export const pushNotificationService = new PushNotificationService();
