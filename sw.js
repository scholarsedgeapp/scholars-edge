// Scholar's Edge — Service Worker
// Enables PWA install prompt and basic offline shell caching

const CACHE = 'scholars-edge-v1';
const SHELL = [
  '/',
  '/index.html',
  '/css/design-system.css',
  '/css/layout.css',
  '/css/components.css',
  '/js/storage.js',
  '/js/router.js',
  '/js/ui.js',
  '/js/app.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Network-first for JS modules (always fresh), cache-first for shell
  if (e.request.url.includes('/js/modules/')) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request))
    );
  }
});
