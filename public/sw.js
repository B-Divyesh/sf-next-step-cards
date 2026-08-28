const CACHE_NAME = 'next-step-cards-shell-v1.0.6';
const SHELL = [
  '/',
  '/index.html',
  '/demo/',
  '/privacy/',
  '/terms/',
  '/404.html',
  '/offline.html',
  '/manifest.webmanifest?v=1.0.6',
  '/assets/hero-card-640.webp?v=1.0.6',
  '/assets/hero-card.webp?v=1.0.6',
  '/assets/social-card.webp',
  '/assets/app2.js',
  '/assets/style.css',
  '/assets/route.js',
  '/favicon.ico',
  '/icons/icon-192.png?v=1.0.6',
  '/icons/icon-512.png?v=1.0.6',
  '/icons/maskable-512.png?v=1.0.6',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then((response) => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
      return response;
    }).catch(async () => (await caches.match(request)) || (await caches.match('/')) || caches.match('/offline.html')));
    return;
  }

  event.respondWith(caches.match(request).then((cached) => cached || fetch(request).then((response) => {
    if (response.ok) caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone()));
    return response;
  })));
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
    const existing = clients.find((client) => 'focus' in client);
    return existing ? existing.focus() : self.clients.openWindow('/');
  }));
});
