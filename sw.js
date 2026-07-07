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
// v4: ships the app.js RE-KEY notice modal (v3 was already deployed).
// v5: re-ship — the v3/v4 app.js uploads landed at the repo ROOT instead of
// js/app.js (index.html loads js/app.js), so devices cached the old shell
// under v4. v5 forces a refetch once js/app.js is actually replaced.
// v6: Batch 0 (2026-07-07) — storage.js (G8–G10 mastery keys, courseOrder
// setting) and app.js (course-order control, 54-strategy strings) are both
// cache-first SHELL files, so the bump is required for devices to fetch them.
const CACHE = 'scholars-edge-v6';
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
