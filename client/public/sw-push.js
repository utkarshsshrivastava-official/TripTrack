// ==========================================================
// TripTrack Standalone WebAPK & PWA Background Push Handler
// ==========================================================

self.addEventListener('push', (event) => {
  console.log('[SW Push] Push event received:', event);

  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { body: event.data.text() };
    }
  }

  const title = data.title || 'TripTrack Family Chat';
  const options = {
    body: data.body || 'New sacred message from family',
    icon: data.icon || '/pwa-192x192.png',
    badge: data.badge || '/favicon.svg',
    tag: data.tag || 'triptrack-chat',
    renotify: true,
    // Elder-friendly high-notice vibration cadence
    vibrate: [200, 100, 200, 100, 200],
    data: data.data || { url: '/?openChat=true' },
    actions: [
      { action: 'open_chat', title: '💬 Open Chat' },
      { action: 'dismiss', title: 'Close' }
    ]
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  console.log('[SW Push] Notification clicked:', event);
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  const targetUrl = (event.notification.data && event.notification.data.url) || '/?openChat=true';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // 1. If an instance of the PWA/WebAPK is already open, focus it and tell it to open the chat
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.postMessage({ type: 'OPEN_CHAT', data: event.notification.data });
          return client.focus();
        }
      }
      // 2. Otherwise launch the standalone WebAPK directly with ?openChat=true
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
