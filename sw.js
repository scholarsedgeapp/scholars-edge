// Scholar's Edge — Service Worker
// Enables PWA install prompt and basic offline shell caching

// v2: relative paths, not absolute ('/index.html' etc.). Absolute paths
// resolve against the domain root, but this app is served from a subpath on
// GitHub Pages (scholarsedgeapp.github.io/scholars-edge/) — every entry
// 404'd there, which made cache.addAll() reject (it's all-or-nothing) and
// the service worker never finished installing. Cache version bumped so
// devices that already have a broken/empty v1 cache pick up a fresh install
// instead of being stuck on it.
// v3: cache bump to ship the app.js change (navigator.storage.persist() at
// init) — app.js is in the cache-first SHELL list, so devices only pick it
// up when the cache version changes.
const CACHE = 'scholars-edge-v3';
const SHELL = [
  './',
  'index.html',
  'css/design-system.css',
  'css/layout.css',
  'css/components.css',
  'js/storage.js',
  'js/router.js',
  'js/ui.js',
  'js/app.js',
  'icons/icon-192.png',
  'icons/icon-512.png',
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
