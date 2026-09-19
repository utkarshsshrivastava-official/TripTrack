import { getBackendUrl, getApiHeaders } from './apiConfig';
import { UserProfile } from '../types/user';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function isPushSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

export function getNotificationPermission(): NotificationPermission {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'default';
  }
  return Notification.permission;
}

/**
 * Register this device for background WebAPK / PWA push notifications
 */
export async function subscribeUserToWebPush(activeUser: UserProfile): Promise<boolean> {
  if (!isPushSupported()) {
    console.warn('⚠️ [WebPush] PushManager or ServiceWorker is not supported in this browser.');
    return false;
  }

  try {
    // 1. Request notification permission from the user
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('ℹ️ [WebPush] Notification permission was not granted:', permission);
      return false;
    }

    // 2. Fetch public VAPID key from backend
    const backendUrl = getBackendUrl();
    const keyRes = await fetch(`${backendUrl}/api/notifications/vapid-public-key`, {
      headers: getApiHeaders()
    });
    const keyData = await keyRes.json();
    if (!keyData.success || !keyData.publicKey) {
      throw new Error(keyData.error || 'Failed to fetch VAPID public key');
    }

    // 3. Wait for service worker to become active
    const registration = await navigator.serviceWorker.ready;

    // 4. Subscribe with PushManager (cleanly refresh token to guarantee valid key binding)
    const applicationServerKey = urlBase64ToUint8Array(keyData.publicKey);
    let subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      try {
        await subscription.unsubscribe();
      } catch (e) {
        console.warn('Could not unsubscribe stale token:', e);
      }
    }

    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey as unknown as BufferSource
    });

    // 5. Send subscription endpoint & keys to MongoDB Atlas backend
    const subRes = await fetch(`${backendUrl}/api/notifications/push-subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getApiHeaders()
      },
      body: JSON.stringify({
        userId: activeUser.id,
        userName: activeUser.name,
        subscription: subscription.toJSON()
      })
    });

    const subData = await subRes.json();
    if (subData.success) {
      console.log('✅ [WebPush] Device registered for background family notifications');
      localStorage.setItem('triptrack_push_registered', 'true');
      return true;
    } else {
      console.warn('⚠️ [WebPush] Server rejected push subscription:', subData.error);
      return false;
    }
  } catch (err) {
    console.error('⚠️ [WebPush] Push subscription workflow failed:', err);
    return false;
  }
}

/**
 * Unsubscribe current device from background pushes
 */
export async function unsubscribeUserFromWebPush(): Promise<boolean> {
  if (!isPushSupported()) return false;

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      const endpoint = subscription.endpoint;
      await subscription.unsubscribe();

      const backendUrl = getBackendUrl();
      await fetch(`${backendUrl}/api/notifications/push-unsubscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getApiHeaders()
        },
        body: JSON.stringify({ endpoint })
      }).catch(() => {});

      localStorage.removeItem('triptrack_push_registered');
      console.log('✅ [WebPush] Device unsubscribed successfully');
      return true;
    }
    return false;
  } catch (err) {
    console.warn('⚠️ [WebPush] Failed to unsubscribe device:', err);
    return false;
  }
}
